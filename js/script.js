// Inicializar AOS
AOS.init({
  duration: 800,
  once: true,
  offset: 100
});

// Toggle Theme con mejoras
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  const isDark = html.getAttribute("data-theme") === "dark";

  html.setAttribute("data-theme", isDark ? "light" : "dark");
  icon.className = isDark ? "bi bi-moon-fill" : "bi bi-sun-fill";
  themeText.textContent = isDark ? "Modo Claro" : "Modo Oscuro";
  
  // Guardar preferencia en localStorage
  localStorage.setItem("theme", isDark ? "light" : "dark");
  
  // Efecto de transición suave
  document.body.style.opacity = '0.8';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 200);
}

// Cargar tema guardado
document.addEventListener("DOMContentLoaded", function() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const html = document.documentElement;
  const icon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  
  html.setAttribute("data-theme", savedTheme);
  icon.className = savedTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
  themeText.textContent = savedTheme === "dark" ? "Modo Oscuro" : "Modo Claro";
  
  // Animación de barras de habilidades
  setTimeout(() => {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 300);
    });
  }, 800);
  
  // Animación de scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Efecto de desvanecimiento al hacer scroll
  const fadeElements = document.querySelectorAll('.card, .section-title, .contact-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Añadir funcionalidad al botón de descarga de CV
  const cvButton = document.querySelector('a[href="#"] .contact-icon-circle');
  if (cvButton) {
    cvButton.closest('.contact-icon').addEventListener('click', function(e) {
      e.preventDefault();
      alert('Por el momento, el CV PDF no está disponible. Por favor, contacta por email para solicitar una copia.');
    });
  }

  // Control de navbar al hacer scroll
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.padding = '0.8rem 0';
      navbar.style.boxShadow = '0 4px 20px var(--shadow-dark)';
    } else {
      navbar.style.padding = '1.2rem 0';
      navbar.style.boxShadow = '0 4px 20px var(--shadow)';
    }
  });
});