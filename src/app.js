let elements;
let windowHeight;

function init(){
  elements = document.querySelectorAll("#projects > div");
  windowHeight = window.innerHeight;
}

function checkPosition(){
  for(let i = 0; i < elements.length; i++){
    const element = elements[i];
    const positionFromTop = elements[i].getBoundingClientRect().top;

    if(positionFromTop - windowHeight <= -20 && !element.classList.contains("visible")){
      element.classList.add("visible");
    }
  }
}

window.addEventListener("scroll", checkPosition);
window.addEventListener("resize", init);

init();
checkPosition();
