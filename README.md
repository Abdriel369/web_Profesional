# Portafolio Profesional · Abdriel Mendiola Aragon

Sitio estático de una sola página (sin build, sin dependencias locales) que presenta el perfil,
los proyectos, las habilidades, la formación y las participaciones de Abdriel Mendiola Aragon,
con el objetivo de conseguir una **residencia profesional**.

Los cinco proyectos tienen el mismo peso visual (numerados del 01 al 05) para que ninguno tape
al resto, y la página no menciona la ubicación actual: en su lugar declara
**disponibilidad total y apertura a reubicación**.

## Estructura

```text
web_Profesional/
├─ index.html                         Página completa (hero, perfil, proyectos, habilidades,
│                                     formación, experiencia, contacto)
├─ css/style.css                      Estilos: tokens de tema, componentes y responsive
├─ js/script.js                       Tema claro/oscuro, navegación activa, progreso,
│                                     copiar correo y animaciones de aparición
└─ assets/
   ├─ Abdriel-Mendiola-Aragon-CV.pdf  CV descargable desde la página
   ├─ favicon.svg                     Icono del sitio
   └─ avatar-fallback.svg             Imagen de respaldo si el avatar de GitHub no carga
```

## Tecnologías

- **HTML5 semántico** + **CSS3** (custom properties, grid/flex, `clamp()`, `svh`)
- **JavaScript** sin frameworks ni transpiladores
- **Bootstrap 5.3.3** (grid y collapse de la barra de navegación)
- **Bootstrap Icons 1.11.1**
- **AOS 2.3.1** (animaciones al hacer scroll)
- **Google Fonts**: Inter, Poppins y JetBrains Mono

Las librerías se cargan por CDN. La página sigue siendo usable si un CDN falla: si AOS no está
disponible el contenido se muestra sin animación, y si Bootstrap JS no carga el menú móvil
funciona con una alternativa propia.

## Ejecutar en local

No requiere instalación de dependencias. Desde la carpeta `web_Profesional`:

```powershell
# Opción 1 · Python (ya instalado en el equipo)
python -m http.server 8080
# Abrir http://127.0.0.1:8080

# Opción 2 · Node.js
npx serve .
```

También puede abrirse `index.html` con doble clic, aunque se recomienda usar un servidor local
para que el portapapeles (`Copiar correo`) y las rutas relativas se comporten igual que en
producción.

## Desplegar

El sitio no necesita compilación: cualquier hosting estático funciona.

### GitHub Pages (el repositorio ya está configurado)

```powershell
git add .
git commit -m "Rediseño del portafolio"
git push origin main
```

Después, en GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Quedará publicado en `https://abdriel369.github.io/web_Profesional/`.

> El `index.html` está en la raíz del repositorio, así que no hace falta carpeta `/docs`.

### Netlify o Vercel

- **Netlify**: arrastrar la carpeta `web_Profesional` en el panel, o conectar el repositorio con
  *Build command* vacío y *Publish directory* `.`
- **Vercel**: importar el repositorio y elegir *Framework preset*: **Other**, sin build.

## Cómo actualizar el contenido

| Qué cambiar | Dónde |
|---|---|
| Cifras del perfil (proyectos, participaciones, certificaciones, titulación) | `index.html` → `section.stats-band` (atributo `data-count` en los números animados) |
| Texto del perfil, objetivo y datos rápidos | `index.html` → sección `#perfil` |
| Proyectos, enlaces y etiquetas de tecnologías | `index.html` → sección `#proyectos` |
| Habilidades por categoría | `index.html` → sección `#habilidades` |
| Estudios, certificaciones e idiomas | `index.html` → sección `#formacion` |
| Experiencia y participaciones | `index.html` → sección `#experiencia` |
| Correo, GitHub y LinkedIn | `index.html` → sección `#contacto` y bloque JSON-LD del `<head>` |
| Colores, tipografías y radios | `css/style.css` → bloque `1. Tokens` |
| CV descargable | Reemplazar `assets/Abdriel-Mendiola-Aragon-CV.pdf` conservando el nombre |

## Accesibilidad y rendimiento

- Enlace «Saltar al contenido», `aria-label` en los controles y `aria-current` en la navegación.
- Foco visible en todos los elementos interactivos.
- Paleta «aurora» (violeta + cian + verde azulado) con **contraste WCAG AA verificado en tema
  claro y oscuro**: todos los pares texto/fondo entre 4.98:1 y 18.5:1 (mínimo exigido 4.5:1).
- Respeta `prefers-reduced-motion` (desactiva animaciones y desplazamiento suave).
- Imágenes con `width`/`height` declarados y texto alternativo; fuentes con `preconnect`.
- Sin JavaScript de terceros más allá de Bootstrap y AOS.

## Nota

Los cambios de este repositorio **no se han subido a GitHub ni se han publicado**. El comando
`git push` del apartado de despliegue queda a tu decisión.
