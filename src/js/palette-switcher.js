/* ═══════════════════════════════════════════
   SELECTOR DE PALETA — Solo para revisión interna
   Eliminar antes del lanzamiento público
   Agregar en index.html antes de </body>:
   <script src="src/js/palette-switcher.js"></script>
═══════════════════════════════════════════ */

(function () {
  'use strict';

  const html = `
    <div id="palette-selector">
      <div id="palette-toggle" title="Cambiar paleta de colores">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
          <circle cx="9" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
        </svg>
        <span>Paleta</span>
      </div>
      <div id="palette-panel">
        <p class="palette-label">Elegir paleta de colores</p>
        <button class="palette-btn" data-palette="1">
          <span class="palette-swatch" style="background:#1C3D5A"></span>
          <span class="palette-swatch" style="background:#D1D5DB"></span>
          <span class="palette-swatch" style="background:#F5F2EC"></span>
          <span class="palette-name">Paleta 1<br><small>Navy · Gris Perla</small></span>
        </button>
        <button class="palette-btn" data-palette="2">
          <span class="palette-swatch" style="background:#1C3D5A"></span>
          <span class="palette-swatch" style="background:#6E8B7A"></span>
          <span class="palette-swatch" style="background:#FAFAF8"></span>
          <span class="palette-name">Paleta 2<br><small>Navy · Verde Salvia</small></span>
        </button>
        <button class="palette-btn" data-palette="3">
          <span class="palette-swatch" style="background:#5CA9D6"></span>
          <span class="palette-swatch" style="background:#2BB8B0"></span>
          <span class="palette-swatch" style="background:#F7F9F8"></span>
          <span class="palette-name">Paleta 3<br><small>Celeste · Turquesa</small></span>
        </button>
        <p class="palette-note">⚠ Solo visible durante revisión interna</p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const paletas = {
    1: {
      vars: {
        '--accent-color':                 '#1C3D5A',
        '--heading-color':                '#1C3D5A',
        '--background-color':             '#F5F2EC',
        '--surface-color':                '#ffffff',
        '--default-color':                '#374151',
        '--contrast-color':               '#ffffff',
        '--nav-color':                    '#374151',
        '--nav-hover-color':              '#1C3D5A',
        '--nav-mobile-background-color':  '#ffffff',
        '--nav-dropdown-background-color':'#ffffff',
        '--nav-dropdown-color':           '#374151',
        '--nav-dropdown-hover-color':     '#1C3D5A',
      },
      footer: {
        bg:     '#1C3D5A',
        text:   '#d1d9e0',
        heading:'#ffffff',
        link:   '#a8bfd4',
        hover:  '#ffffff',
        border: 'rgba(255,255,255,0.08)',
        credit: '#7a9ab5',
      }
    },
    2: {
      vars: {
        '--accent-color':                 '#6E8B7A',
        '--heading-color':                '#1C3D5A',
        '--background-color':             '#FAFAF8',
        '--surface-color':                '#ffffff',
        '--default-color':                '#374151',
        '--contrast-color':               '#ffffff',
        '--nav-color':                    '#374151',
        '--nav-hover-color':              '#6E8B7A',
        '--nav-mobile-background-color':  '#ffffff',
        '--nav-dropdown-background-color':'#ffffff',
        '--nav-dropdown-color':           '#374151',
        '--nav-dropdown-hover-color':     '#6E8B7A',
      },
      footer: {
        bg:     '#1C3D5A',
        text:   '#c8d8c8',
        heading:'#ffffff',
        link:   '#a8c4b0',
        hover:  '#ffffff',
        border: 'rgba(255,255,255,0.08)',
        credit: '#7a9a85',
      }
    },
    3: {
      vars: {
        '--accent-color':                 '#2BB8B0',
        '--heading-color':                '#5CA9D6',
        '--background-color':             '#F7F9F8',
        '--surface-color':                '#ffffff',
        '--default-color':                '#374151',
        '--contrast-color':               '#ffffff',
        '--nav-color':                    '#374151',
        '--nav-hover-color':              '#2BB8B0',
        '--nav-mobile-background-color':  '#ffffff',
        '--nav-dropdown-background-color':'#ffffff',
        '--nav-dropdown-color':           '#374151',
        '--nav-dropdown-hover-color':     '#2BB8B0',
      },
      footer: {
        bg:     '#1a4a5c',
        text:   '#a8d4d2',
        heading:'#ffffff',
        link:   '#7ec8c4',
        hover:  '#ffffff',
        border: 'rgba(255,255,255,0.08)',
        credit: '#5aaba8',
      }
    }
  };

  const styleTag = document.createElement('style');
  styleTag.id = 'palette-footer-style';
  document.head.appendChild(styleTag);

  function aplicarFooterStyles(f) {
    styleTag.textContent = `
      .footer {
        background-color: ${f.bg} !important;
        color: ${f.text} !important;
        border-top: none !important;
      }
      .footer .footer-top {
        border-top: 1px solid ${f.border} !important;
      }
      .footer h4 {
        color: ${f.heading} !important;
      }
      .footer p,
      .footer .footer-contact p {
        color: ${f.text} !important;
      }
      .footer .footer-links ul a,
      .footer .footer-about p a {
        color: ${f.link} !important;
      }
      .footer .footer-links ul a:hover,
      .footer .footer-about p a:hover {
        color: ${f.hover} !important;
      }
      .footer .footer-links ul i {
        color: ${f.link} !important;
      }
      .footer .copyright {
        border-top: 1px solid ${f.border} !important;
      }
      .footer .copyright p,
      .footer .credits {
        color: ${f.credit} !important;
      }
      .footer .credits a {
        color: ${f.link} !important;
      }
      .footer .social-links a {
        background: rgba(255,255,255,0.08);
        color: ${f.heading} !important;
        border-color: ${f.border} !important;
      }
      .footer .social-links a:hover {
        background: rgba(255,255,255,0.18);
      }
      .footer .sitename,
      .footer .logo span {
        color: ${f.heading} !important;
      }
    `;
  }

  const root    = document.documentElement;
  const toggle  = document.getElementById('palette-toggle');
  const panel   = document.getElementById('palette-panel');
  const buttons = document.querySelectorAll('.palette-btn');

  function aplicarPaleta(num) {
    const paleta = paletas[num];
    if (!paleta) return;
    Object.entries(paleta.vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
    aplicarFooterStyles(paleta.footer);
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.palette === String(num));
    });
    toggle.style.background = paleta.vars['--accent-color'];
    sessionStorage.setItem('paletaActiva', num);
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    panel.classList.toggle('open');
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      aplicarPaleta(parseInt(this.dataset.palette));
      panel.classList.remove('open');
    });
  });

  document.addEventListener('click', function () {
    panel.classList.remove('open');
  });

  const guardada = sessionStorage.getItem('paletaActiva');
  aplicarPaleta(guardada ? parseInt(guardada) : 1);

})();
