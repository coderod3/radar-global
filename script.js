/* ═══════════════════════════════════════════════════════════════
   RADAR GLOBAL — script.js
   Estudos Contemporâneos · UNAERP 2026/01
   ═══════════════════════════════════════════════════════════════ */

// ─── TEMA (dark / light) ──────────────────────────────────────
const html = document.documentElement;
const savedTheme = localStorage.getItem('rg-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('rg-theme', next);
});

// ─── NAV SHRINK + BOTÃO VOLTAR AO TOPO ───────────────────────
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('shrunk', y > 60);
  backTop.classList.toggle('visible', y > 400);
}, { passive: true });

// ─── SIDE NAV — destaque da seção ativa ──────────────────────
const snavLinks = document.querySelectorAll('.snav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      snavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.snav-link[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

// ─── CARROSSEL ────────────────────────────────────────────────
const slides        = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('dots');
let current = 0;
let timer   = null;

// Cria os dots dinamicamente
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  slides[current].classList.remove('active');
  dotsContainer.children[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dotsContainer.children[current].classList.add('active');
}

function nextSlide() { goTo((current + 1) % slides.length); }
function startTimer() { timer = setInterval(nextSlide, 5000); }
function stopTimer()  { clearInterval(timer); }

startTimer();
document.querySelector('.hero').addEventListener('mouseenter', stopTimer);
document.querySelector('.hero').addEventListener('mouseleave', startTimer);

// ─── PARALLAX SUAVE NO HERO ───────────────────────────────────
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelector('.carousel').style.transform = `translateY(${y * 0.3}px)`;
}, { passive: true });

// ─── SCROLL REVEAL (IntersectionObserver) ─────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── ACCORDION — Conceitos Fundamentais ───────────────────────
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const item  = btn.closest('.accordion-item');
    const body  = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    // Fecha os outros itens abertos
    document.querySelectorAll('.accordion-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      }
    });

    // Abre ou fecha o item clicado
    if (isOpen) {
      item.classList.remove('open');
      body.style.maxHeight = null;
    } else {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ─── MODAL — Referências Bibliográficas ──────────────────────
const refModal        = document.getElementById('ref-modal');
const refTrigger      = document.getElementById('ref-trigger');
const refModalClose   = document.getElementById('ref-modal-close');
const refModalBackdrop = document.getElementById('ref-modal-backdrop');

function openRefModal()  {
  refModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeRefModal() {
  refModal.classList.remove('open');
  document.body.style.overflow = '';
}

refTrigger.addEventListener('click', openRefModal);
refModalClose.addEventListener('click', closeRefModal);
refModalBackdrop.addEventListener('click', closeRefModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeRefModal(); });

// ─── HOVER SUTIL NOS PICKS ───────────────────────────────────
// (Mídia agora é lista editorial numerada — sem tabs)
document.querySelectorAll('.pick-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.querySelector('.pick-num').style.opacity = '.7';
  });
  item.addEventListener('mouseleave', () => {
    item.querySelector('.pick-num').style.opacity = '.2';
  });
});
