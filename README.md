# Markify

[![CI/CD](https://github.com/tu-usuario/markitdown-web/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-usuario/markitdown-web/actions/workflows/ci.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vitejs.dev/)

**Convert documents to Markdown instantly in your browser**

Markify is a free web tool that converts documents (PDF, DOCX, HTML, images, and more) to Markdown format. All processing is done 100% client-side, ensuring complete privacy - no files are ever sent to external servers.

## ✨ Features

- 🚀 **Local processing**: Everything runs in your browser using WebAssembly
- 🔒 **Complete privacy**: Files never leave your device
- 📄 **Multiple formats**: PDF, DOCX, HTML, CSV, JSON, TXT
- 🖼️ **Built-in OCR**: Text extraction from images with Tesseract.js
- 👀 **Live preview**: View rendered Markdown in real-time
- 📋 **Copy and download**: Export results easily
- 🌙 **Modern design**: Dark interface with glassmorphism
- 📱 **Responsive**: Works on mobile devices
- ⚡ **No installation**: Works directly from the browser

## 🛠️ Technologies

- **Frontend**: Vue 3 + Vite
- **Core**: [MarkItDown](https://github.com/microsoft/markitdown) by Microsoft
- **Python Runtime**: [Pyodide](https://pyodide.org/) (Python in WebAssembly)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Markdown**: [marked](https://marked.js.org/) + [highlight.js](https://highlightjs.org/)
- **Styling**: Custom CSS with CSS variables
- **Containerization**: Docker multi-stage build

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/tu-usuario/markitdown-web.git
cd markitdown-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker

```bash
# Build and start with Docker Compose
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

Access [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview the build
pnpm preview
```

Files will be generated in the `dist/` directory.

## 📁 Project Structure

```
markitdown-web/
├── public/
│   └── wheels/              # Python packages (MarkItDown)
├── src/
│   ├── assets/              # Global styles
│   ├── components/          # Vue components
│   │   ├── AppHeader.vue
│   │   ├── FileDropzone.vue
│   │   ├── LoadingOverlay.vue
│   │   ├── OutputPanel.vue
│   │   └── Toolbar.vue
│   ├── composables/         # Reusable logic
│   │   └── useMarkItDown.js
│   ├── utils/               # Utilities
│   │   └── ocr.js
│   ├── worker/              # Web Worker for Pyodide
│   │   └── markitdown.worker.js
│   ├── App.vue              # Root component
│   └── main.js              # Entry point
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD with GitHub Actions
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Docker configuration
├── nginx.conf               # nginx configuration
└── vite.config.js           # Vite configuration
```

## 📦 Supported Formats

| Format | Extension | Method |
|--------|-----------|--------|
| PDF | `.pdf` | MarkItDown + pdfminer/pdfplumber |
| Word | `.docx` | MarkItDown + mammoth |
| HTML | `.html`, `.htm` | MarkItDown + beautifulsoup4 |
| CSV | `.csv` | MarkItDown |
| JSON | `.json` | MarkItDown |
| Text | `.txt` | MarkItDown |
| Images | `.jpg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp` | Tesseract.js (OCR) |

## 🏗️ Architecture

Markify uses a Web Worker-based architecture to run Python in the browser:

1. **Pyodide**: Python runtime compiled to WebAssembly
2. **MarkItDown**: Microsoft library for document conversion
3. **Web Worker**: Processes conversions without blocking the UI
4. **Tesseract.js**: Native JavaScript OCR for images

The conversion flow:
```
User → Upload file → Web Worker → Pyodide → MarkItDown → Markdown → UI
```

## 🐳 Docker

### Build Image Manually

```bash
# Build image
docker build -t markify:latest .

# Run container
docker run -d -p 3000:80 --name markify markify:latest
```

### Environment Variables

No environment variables are required for basic operation.

## 🤝 Contributing

Contributions are welcome. For major changes:

1. Open an issue to discuss what you want to change
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add: new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
pnpm install

# Run tests (coming soon)
pnpm test

# Linting (coming soon)
pnpm lint
```

## 📄 License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Microsoft MarkItDown](https://github.com/microsoft/markitdown) - Core conversion library
- [Pyodide](https://pyodide.org/) - Python in WebAssembly
- [Tesseract.js](https://tesseract.projectnaptha.com/) - JavaScript OCR
- [Vue.js](https://vuejs.org/) - Reactive framework
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Contact

Have questions or suggestions? Open an [issue](https://github.com/tu-usuario/markitdown-web/issues) on GitHub.

---

**Note**: This project uses MarkItDown, a Microsoft tool, adapted to run entirely in the browser via WebAssembly.
