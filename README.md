# Portfolio — Alvaro Gaston

Portfolio personal de **Alvaro Gaston**, estudiante de Ingeniería en Sistemas Informáticos (UAI Rosario). Presenta mi perfil como desarrollador, mis proyectos, skills y datos de contacto.

🔗 Demo pública: _agregar acá el link una vez hecho el deploy (Vercel / Netlify / GitHub Pages / Render)_

## Stack

Sitio estático, sin frameworks ni build step:

- **HTML5** semántico (`header`, `nav`, `main`, `section`, `footer`)
- **CSS3** (variables, Grid, Flexbox, media queries, `prefers-reduced-motion`)
- **JavaScript vanilla** (ES6+): menú mobile, `IntersectionObserver` para animaciones de entrada y barras de skills, modal de CV con Web Share API

No requiere Node, ni dependencias, ni proceso de build.

## Cómo correrlo localmente

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/AlvaroGaston/portfolio-alvaro.git
   cd portfolio-alvaro
   ```
2. Abrí `index.html` directamente en el navegador, **o** levantá un servidor local (recomendado para que las rutas relativas y el fetch del CV funcionen igual que en producción):
   ```bash
   # con la extensión Live Server de VS Code, o:
   npx serve .
   # o
   python -m http.server 5500
   ```
3. Entrá a `http://localhost:5500` (o el puerto que indique tu servidor).

## Estructura

```
portfolio-alvaro/
├── index.html          # Markup de todas las secciones
├── style.css           # Estilos y responsive
├── script.js           # Interactividad (menú, animaciones, modal de CV)
├── assets/
│   ├── profile.jpg
│   └── CV-Alvaro-Gaston.pdf
└── README.md
```

## Secciones

- **Hero**: nombre, rol, frase de presentación, botones de acción y foto.
- **Sobre mí**: biografía breve y skills agrupadas por categoría (Frontend, Backend, Herramientas).
- **Proyectos**: proyectos reales de facultad y personales, con tecnologías y link a cada repositorio.
- **Experiencia y formación**: timeline con la pasantía y la carrera.
- **Contacto**: email, GitHub y LinkedIn.

## Accesibilidad y responsive

- Un solo `h1` por página, HTML semántico.
- `alt` en imágenes, estados de foco visibles para navegación por teclado y animaciones que respetan `prefers-reduced-motion`.
- Probado sin scroll horizontal en 360px (mobile), 768px (tablet) y 1280px (desktop).

## Deploy

Pensado para deployar como sitio estático en **Vercel**, **Netlify**, **GitHub Pages** o **Render** (no necesita configuración de build: el root del repo es el root del sitio).
