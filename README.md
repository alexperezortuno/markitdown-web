# Markify

[![CI/CD](https://github.com/tu-usuario/markitdown-web/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-usuario/markitdown-web/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vitejs.dev/)

**Convierte documentos a Markdown instantáneamente en tu navegador**

Markify es una herramienta web gratuita que convierte documentos (PDF, DOCX, HTML, imágenes y más) a formato Markdown. Todo el procesamiento se realiza 100% en el cliente, garantizando privacidad total - ningún archivo se envía a servidores externos.

## ✨ Características

- 🚀 **Procesamiento local**: Todo se ejecuta en tu navegador usando WebAssembly
- 🔒 **Privacidad total**: Los archivos nunca salen de tu dispositivo
- 📄 **Múltiples formatos**: PDF, DOCX, HTML, CSV, JSON, TXT
- 🖼️ **OCR integrado**: Extracción de texto de imágenes con Tesseract.js
- 👀 **Vista previa en vivo**: Visualiza el Markdown renderizado en tiempo real
- 📋 **Copiar y descargar**: Exporta resultados fácilmente
- 🌙 **Diseño moderno**: Interfaz oscura con glassmorphism
- 📱 **Responsive**: Funciona en dispositivos móviles
- ⚡ **Sin instalación**: Funciona directamente desde el navegador

## 🛠️ Tecnologías

- **Frontend**: Vue 3 + Vite
- **Core**: [MarkItDown](https://github.com/microsoft/markitdown) de Microsoft
- **Runtime Python**: [Pyodide](https://pyodide.org/) (Python en WebAssembly)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Markdown**: [marked](https://marked.js.org/) + [highlight.js](https://highlightjs.org/)
- **Styling**: CSS personalizado con variables CSS
- **Containerización**: Docker multi-stage build

## 🚀 Inicio rápido

### Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/markitdown-web.git
cd markitdown-web

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Usando Docker

```bash
# Construir y levantar con Docker Compose
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

Accede a [http://localhost:3000](http://localhost:3000)

### Build para producción

```bash
# Instalar dependencias
pnpm install

# Construir para producción
pnpm build

# Preview del build
pnpm preview
```

Los archivos se generarán en el directorio `dist/`.

## 📁 Estructura del proyecto

```
markitdown-web/
├── public/
│   └── wheels/              # Paquetes Python (MarkItDown)
├── src/
│   ├── assets/              # Estilos globales
│   ├── components/          # Componentes Vue
│   │   ├── AppHeader.vue
│   │   ├── FileDropzone.vue
│   │   ├── LoadingOverlay.vue
│   │   ├── OutputPanel.vue
│   │   └── Toolbar.vue
│   ├── composables/         # Lógica reutilizable
│   │   └── useMarkItDown.js
│   ├── utils/               # Utilidades
│   │   └── ocr.js
│   ├── worker/              # Web Worker para Pyodide
│   │   └── markitdown.worker.js
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD con GitHub Actions
├── Dockerfile               # Build multi-stage
├── docker-compose.yml       # Configuración Docker
├── nginx.conf               # Configuración nginx
└── vite.config.js           # Configuración Vite
```

## 📦 Formatos soportados

| Formato | Extensión | Método |
|---------|-----------|--------|
| PDF | `.pdf` | MarkItDown + pdfminer/pdfplumber |
| Word | `.docx` | MarkItDown + mammoth |
| HTML | `.html`, `.htm` | MarkItDown + beautifulsoup4 |
| CSV | `.csv` | MarkItDown |
| JSON | `.json` | MarkItDown |
| Texto | `.txt` | MarkItDown |
| Imágenes | `.jpg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp` | Tesseract.js (OCR) |

## 🏗️ Arquitectura

Markify utiliza una arquitectura basada en Web Workers para ejecutar Python en el navegador:

1. **Pyodide**: Runtime de Python compilado a WebAssembly
2. **MarkItDown**: Librería de Microsoft para conversión de documentos
3. **Web Worker**: Procesa las conversiones sin bloquear la UI
4. **Tesseract.js**: OCR nativo en JavaScript para imágenes

El flujo de conversión:
```
Usuario → Carga archivo → Web Worker → Pyodide → MarkItDown → Markdown → UI
```

## 🐳 Docker

### Construir imagen manualmente

```bash
# Construir imagen
docker build -t markify:latest .

# Ejecutar contenedor
docker run -d -p 3000:80 --name markify markify:latest
```

### Variables de entorno

No se requieren variables de entorno para el funcionamiento básico.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue para discutir lo que quieres cambiar
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar tests (próximamente)
pnpm test

# Linting (próximamente)
pnpm lint
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia GPL v3 - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Microsoft MarkItDown](https://github.com/microsoft/markitdown) - Librería core de conversión
- [Pyodide](https://pyodide.org/) - Python en WebAssembly
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR en JavaScript
- [Vue.js](https://vuejs.org/) - Framework reactivo
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Contacto

¿Tienes preguntas o sugerencias? Abre un [issue](https://github.com/tu-usuario/markitdown-web/issues) en GitHub.

---

**Nota**: Este proyecto usa MarkItDown, una herramienta de Microsoft, adaptada para funcionar completamente en el navegador mediante WebAssembly.
