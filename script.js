/* NAV scroll */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

/* Hamburger */
const ham = document.getElementById('ham');
const menu = document.getElementById('navMenu');
ham.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* Reveal */
const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }}),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* Contadores */
function animarContador(el) {
  const suf = el.querySelector('.s-suf');
  const sufChar = suf ? suf.textContent : '';
  const target = parseInt(el.dataset.target);
  const inicio = performance.now();
  const dur = 1600;
  function paso(now) {
    const p = Math.min((now - inicio) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerHTML = Math.floor(ease * target) + `<span class="s-suf">${sufChar}</span>`;
    if (p < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}
const cObs = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) { animarContador(e.target); cObs.unobserve(e.target); }}),
  { threshold: 0.6 }
);
document.querySelectorAll('.s-num[data-target]').forEach(el => cObs.observe(el));

/* Carrusel reseñas */
(function () {
  const track = document.getElementById('revTrack');
  const puntosEl = document.getElementById('revPuntos');
  const cards = track.children;
  let idx = 0;

  const vis = () => window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  const gw = () => cards[0].offsetWidth + 20;
  const maxIdx = () => Math.max(0, cards.length - vis());

  function buildPuntos() {
    puntosEl.innerHTML = '';
    for (let i = 0; i <= maxIdx(); i++) {
      const d = document.createElement('div');
      d.className = 'punto' + (i === idx ? ' activo' : '');
      d.addEventListener('click', () => ir(i));
      puntosEl.appendChild(d);
    }
  }

  function ir(n) {
    idx = Math.max(0, Math.min(n, maxIdx()));
    track.style.transform = `translateX(-${idx * gw()}px)`;
    puntosEl.querySelectorAll('.punto').forEach((d, i) => d.classList.toggle('activo', i === idx));
  }

  document.getElementById('revPrev').addEventListener('click', () => ir(idx - 1));
  document.getElementById('revNext').addEventListener('click', () => ir(idx + 1));

  let auto = setInterval(() => ir(idx >= maxIdx() ? 0 : idx + 1), 4500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => {
    auto = setInterval(() => ir(idx >= maxIdx() ? 0 : idx + 1), 4500);
  });

  buildPuntos();
  window.addEventListener('resize', () => { buildPuntos(); ir(0); });
})();

/* Toast */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function enviarSoporte() {
  const n = document.getElementById('f-nombre').value.trim();
  const e = document.getElementById('f-email').value.trim();
  const s = document.getElementById('f-servicio').value;
  if (!n || !e || !s) { toast('⚠ Por favor completa los campos obligatorios'); return; }
  toast('✓ Solicitud enviada. Te contactamos en menos de 2 horas.');
  ['f-nombre','f-tel','f-email','f-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-servicio').value = '';
}

function enviarContacto() {
  const n = document.getElementById('c-nombre').value.trim();
  const e = document.getElementById('c-email').value.trim();
  const m = document.getElementById('c-msg').value.trim();
  if (!n || !e || !m) { toast('⚠ Por favor completa todos los campos'); return; }
  toast('✓ Mensaje enviado. ¡Gracias por contactarnos!');
  ['c-nombre','c-email','c-asunto','c-msg'].forEach(id => document.getElementById(id).value = '');
}