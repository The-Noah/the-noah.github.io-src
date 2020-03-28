const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const sass = require("node-sass");
const htmlMinify = require("html-minifier").minify;

const srcDir = path.join(__dirname, "src");
const buildDir = path.join(__dirname, "build");

let watch = false;
if(process.argv[2] === "watch"){
  watch = true;
}

const build = () => {
  if(!fs.existsSync(buildDir)){
    fs.mkdirSync(buildDir);
  }else{
    fs.readdirSync(buildDir).forEach((file) => fs.unlinkSync(path.join(buildDir, file)));
  }

  fs.copyFileSync(path.join(srcDir, "favicon.ico"), path.join(buildDir, "favicon.ico"));

  const projects = JSON.parse(fs.readFileSync(path.join(srcDir, "projects.json"), "utf8"));

  const css = (sass.renderSync({
    file: path.join(srcDir, "style.scss"),
    outputStyle: "compressed"
  })).css.toString();

  ejs.renderFile(path.join(srcDir, "index.ejs"), {
    css,
    projects
  }, (err, html) => {
    if(err){
      return console.error(err);
    }

    fs.writeFileSync(path.join(buildDir, "index.html"), htmlMinify(html, {
      html5: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeTagWhitespace: true,
      collapseWhitespace: true
    }));
  });
};

if(watch){
  console.log("watching files for changes...");
  build();
  fs.watch(srcDir, (event, file) => {
    console.log(event, file);
    try{
      build();
    }catch(err){
      console.log(err);
    }
  });
}else{
  build();
}
