const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.intersectionRatio >= 0.12) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: [0, 0.12] },
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// Contact form: send to Formspree in the background and thank the visitor on
// this page. Without JavaScript the form still posts normally.
const form = document.querySelector('form[action*="formspree.io"]');
if (form) {
  const done = document.querySelector(".form-done");
  const error = form.querySelector(".form-error");
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;
    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Formspree answered ${res.status}`);
      form.reset();
      form.hidden = true;
      done.hidden = false;
      done.querySelector("h3").focus();
    } catch {
      error.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = "Send message";
    }
  });
  done.querySelector("button").addEventListener("click", () => {
    done.hidden = true;
    form.hidden = false;
    form.querySelector("input").focus();
  });
}
