document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-ready');

  if (!document.querySelector('.site-footer')) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-grid">
          <section class="footer-brand">
            <span class="footer-kicker">Proyecto de investigación</span>
            <h3>Clasificación de suelos con IA y sensórica multinivel</h3>
            <p>Lectura técnica y visual del proyecto: datos, modelos, validación, figuras y testeo en una experiencia web más clara, elegante y útil para presentar resultados.</p>
          </section>
          <section class="footer-col">
            <h4>Navegación</h4>
            <div class="footer-links">
              <a class="footer-link" href="index.html">Inicio</a>
              <a class="footer-link" href="datos.html">Datos y Pipeline</a>
              <a class="footer-link" href="dashboard.html">Dashboard Vivo</a>
              <a class="footer-link" href="figuras.html">Figuras Técnicas</a>
              <a class="footer-link" href="conclusiones.html">Patrones y Roadmap</a>
              <a class="footer-link" href="testeo.html">Testeo</a>
            </div>
          </section>
          <section class="footer-col">
            <h4>Claves del proyecto</h4>
            <div class="footer-tags">
              <span class="footer-tag">WRB</span>
              <span class="footer-tag">USDA</span>
              <span class="footer-tag">Sensores multinivel</span>
              <span class="footer-tag">Modelado predictivo</span>
              <span class="footer-tag">Visualización técnica</span>
            </div>
          </section>
        </div>
        <div class="footer-authors">
          <h4>Equipo investigador</h4>
          <div class="footer-chip-row">
            <a class="chip chip-linkedin" href="https://www.linkedin.com/in/jorgeherraizsoler/" target="_blank" rel="noopener noreferrer">Jorge Herraiz Soler</a>
            <a class="chip chip-linkedin" href="https://www.linkedin.com/in/ralphberrio/" target="_blank" rel="noopener noreferrer">Ralph Berrio Quispe</a>
            <a class="chip chip-linkedin" href="https://www.linkedin.com/in/ignacio-buey-ruiz-a38708314/" target="_blank" rel="noopener noreferrer">Ignacio Buey Ruiz</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Proyecto web de apoyo a la presentación y lectura técnica de resultados.</span>
          <span>Actualizado visualmente para una lectura más clara y profesional.</span>
        </div>
      </div>
    `;

    const scripts = Array.from(document.body.querySelectorAll('script'));
    const anchor = scripts[0] || null;
    document.body.insertBefore(footer, anchor);
  }

  const selectors = [
    'main > section',
    '.home-overview .card',
    '.chart-card',
    '.figure-grid > article',
    '.timeline .milestone',
    '.testeo-fieldset',
    '.testeo-progress',
    '.testeo-results',
    '.testeo-hero',
    '.testeo-toolbar'
  ];

  const targets = [...new Set(
    selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)))
  )].filter((element) => !element.classList.contains('reveal-up'));

  targets.forEach((element, index) => {
    element.classList.add('reveal-up');
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 280)}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach((element) => observer.observe(element));
});
