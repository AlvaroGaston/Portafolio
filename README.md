# Portfolio — Alvaro Gaston

Portfolio personal de **Alvaro Gaston**, estudiante de Ingeniería en Sistemas Informáticos (UAI Rosario). Presenta mi perfil como desarrollador, mis proyectos, skills y datos de contacto.

🔗 Demo pública: _agregar acá el link una vez hecho el deploy (Vercel / Netlify / GitHub Pages / Render)_

## Stack

Sitio estático, sin frameworks de UI ni bundler:

- **HTML5** semántico (`header`, `nav`, `main`, `section`, `footer`)
- **CSS3** (variables, Grid, Flexbox, media queries, `prefers-reduced-motion`)
- **JavaScript vanilla** (ES6+): menú mobile, `IntersectionObserver` para animaciones de entrada y barras de skills, modal de CV con Web Share API
- **TypeScript**: validación y envío del formulario de contacto (`src/contact-form.ts`), compilado a `src/contact-form.js` con `tsc` (sin bundler, sin módulos — se sirve tal cual)

No requiere un servidor backend. El único paso de build es compilar ese archivo TypeScript; el `.js` resultante ya queda commiteado en el repo, así que **no es obligatorio tener Node para ver el sitio**, solo para modificar el formulario.

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

### Si vas a tocar el formulario de contacto (TypeScript)

```bash
npm install        # instala typescript como devDependency
npm run build       # compila src/contact-form.ts -> src/contact-form.js
npm run watch        # (opcional) recompila automáticamente al guardar
```

El formulario valida nombre, email y mensaje en el cliente y los envía con **[Web3Forms](https://web3forms.com)** (`fetch` a su API), que entrega el mail directo a `alvarogastonxar@gmail.com` sin necesitar un backend propio. La "access key" que usa es pública por diseño de Web3Forms (está pensada para ir en el HTML/JS del cliente). Si el envío falla (sin conexión, servicio caído, etc.), el formulario muestra un respaldo para copiar el mensaje o abrirlo como `mailto:`.

## Estructura

```
portfolio-alvaro/
├── index.html              # Markup de todas las secciones
├── style.css               # Estilos y responsive
├── script.js               # Interactividad (menú, animaciones, modal de CV)
├── src/
│   ├── contact-form.ts     # Validación y envío del form de contacto (fuente)
│   └── contact-form.js     # Salida compilada (la que referencia index.html)
├── assets/
│   ├── profile.jpg
│   └── CV-Alvaro-Gaston.pdf
├── package.json            # Script de build de TypeScript
├── tsconfig.json
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
