//Carrousel
$('.carousel').carousel({
  interval: 5000
})

//Animate Scroll
let animate = document.querySelectorAll(".animated-scroll-up");
function seeScroll() {
  let scrollTop = document.documentElement.scrollTop;
  for (let i = 0; i < animate.length; i++) {
    let heightAnimate = animate[i].offsetTop;
    if (heightAnimate - 500 < scrollTop) {
      animate[i].style.opacity = 1;
      animate[i].classList.add("view-from-above");
    }
  }
}
window.addEventListener('scroll', seeScroll);
