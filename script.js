let exploded = false;

window.addEventListener("scroll", () => {
  if (!exploded && window.scrollY > 50) {
    exploded = true;
    explode();
  }
});

function explode() {
  document.body.classList.add("chaos");

  const elements = document.querySelectorAll(".error-box *");

  elements.forEach(el => {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const r = Math.random() * 720;

    el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
  });

  // 계속 흔들리게
  setInterval(() => {
    elements.forEach(el => {
      el.style.transform += ` scale(${0.5 + Math.random()})`;
    });
  }, 300);
}
