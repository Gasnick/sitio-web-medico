---
applyTo: '**'
---
# Instrucciones para el sistema médico
Proyecto: sitio-web-medico: sitio web que en primera instancia es un MVP estático basado en Bootstrap (tema MediNest).
Propósito
- Este repositorio es un sitio web estático basado en Bootstrap (tema MediNest) compuesto por páginas HTML en `src/pages/`, activos en `src/assets/` y pequeñas mejoras en JS vanilla en `src/js/`.
Arquitectura general
- Sitio estático de múltiples páginas: cada página es un archivo HTML independiente (por ejemplo, `src/pages/inicio.html`, `src/pages/detalle_servicios.html`).
- Activos compartidos: estilos globales en `src/assets/css/`, imágenes en `src/assets/img/` y scripts compartidos en `src/js/` (`main.js`, `menu.js`).
- Lógica mínima del lado del cliente: el comportamiento de la interfaz de usuario (alternar la navegación, AOS, GLightbox, Swiper, PureCounter, Isotope) se inicializa desde `src/js/main.js` y el marcado por página impulsa la configuración a través de atributos de datos y JSON en línea para Swiper.
- La funcionalidad del formulario de contacto, busqueda de doctoores, citas con cada doctor, y otros formularios, se manejan mediante scripts de javascript, pronto a desarrollar un backend en Node.js.
Este proyecto debe ser tratado como un sitio estático, pero se planea agregar un backend en Node.js para manejar formularios y otras funcionalidades dinámicas. La idea principal, por el momento es poder vender la idea a profesionales médicos, tanto individuales como clínicas, y una vez que se valide el producto, se procederá a desarrollar el backend completo, pero antes necesito los scripts de javascript que manejen los formularios y otras funcionalidades dinámicas básicas.