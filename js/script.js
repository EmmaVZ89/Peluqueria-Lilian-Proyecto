//Carrousel
$('.carousel').carousel({
  interval: 5000
})

//Animate Scroll up
let animateY = document.querySelectorAll(".animated-scroll-up");
function seeScrollY() {
  let scrollTop = document.documentElement.scrollTop;
  for (let i = 0; i < animateY.length; i++) {
    let heightAnimate = animateY[i].offsetTop;
    if (heightAnimate - 550 < scrollTop) {
      animateY[i].style.opacity = 1;
      animateY[i].classList.add("view-from-above");
    }
  }
}
window.addEventListener('scroll', seeScrollY);

// Animate Scroll right
let animateX = document.querySelectorAll(".animated-scroll-right");
function seeScrollX() {
  let scrollRight = document.documentElement.scrollTop;
  for (let i = 0; i < animateX.length; i++) {
    let rightAnimate = animateX[i].offsetTop;
    if (rightAnimate - 550 < scrollRight) {
      animateX[i].style.opacity = 1;
      animateX[i].classList.add("view-from-right");
    }
  }
}
window.addEventListener('scroll', seeScrollX);
