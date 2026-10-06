// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Navbar con sombra al scrollear
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 20px #00000040' : 'none';
});

// Animación de aparición de secciones + barras de skills al entrar en viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(section => observer.observe(section));

// Las barras de skill ya tienen su ancho inline (style="width:XX%"),
// pero arrancan en 0 por CSS y se animan cuando la sección entra en vista.
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

// Modal de CV: abrir, cerrar y compartir (la descarga es un link nativo al PDF)
const cvOverlay = document.getElementById('cvOverlay');
const openCvBtn = document.getElementById('openCvBtn');
const openCvBtnHero = document.getElementById('openCvBtnHero');
const closeCvBtn = document.getElementById('closeCvBtn');
const shareCvBtn = document.getElementById('shareCvBtn');
const CV_PATH = 'assets/CV-Alvaro-Gaston.pdf';

function openCv() {
  cvOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCv() {
  cvOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

[openCvBtn, openCvBtnHero].forEach(btn => btn && btn.addEventListener('click', openCv));
closeCvBtn.addEventListener('click', closeCv);
cvOverlay.addEventListener('click', (e) => {
  if (e.target === cvOverlay) closeCv();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cvOverlay.classList.contains('open')) closeCv();
});

shareCvBtn.addEventListener('click', async () => {
  const cvUrl = new URL(CV_PATH, window.location.href).href;
  const original = shareCvBtn.querySelector('span').textContent;

  const showFeedback = (msg) => {
    shareCvBtn.querySelector('span').textContent = msg;
    setTimeout(() => { shareCvBtn.querySelector('span').textContent = original; }, 2000);
  };

  try {
    // Si el navegador soporta compartir archivos, se comparte el PDF real.
    if (navigator.canShare) {
      const response = await fetch(CV_PATH);
      const blob = await response.blob();
      const file = new File([blob], 'CV-Alvaro-Gaston.pdf', { type: 'application/pdf' });
      const fileShareData = {
        files: [file],
        title: 'CV — Alvaro Gaston',
        text: 'Mirá el CV de Alvaro Gaston, estudiante de Ingeniería en Sistemas Informáticos.'
      };
      if (navigator.canShare(fileShareData)) {
        await navigator.share(fileShareData);
        return;
      }
    }
    if (navigator.share) {
      await navigator.share({
        title: 'CV — Alvaro Gaston',
        text: 'Mirá el CV de Alvaro Gaston, estudiante de Ingeniería en Sistemas Informáticos.',
        url: cvUrl
      });
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(cvUrl);
      showFeedback('¡Enlace copiado!');
    }
  } catch (err) {
    // El usuario canceló el share o el navegador lo bloqueó; no hacer nada.
  }
});
