/* eslint-disable no-undef */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js");

let pyodide;

async function init(wheelUrl) {
  postMessage({ type: "status", message: "Cargando Pyodide...", progress: 10 });

  pyodide = await loadPyodide();

  await pyodide.loadPackage("micropip");

  const micropip = pyodide.pyimport("micropip");

  postMessage({ type: "status", message: "Instalando MarkItDown...", progress: 25 });

  await micropip.install(wheelUrl);

  postMessage({ type: "status", message: "Instalando dependencias...", progress: 40 });

  const deps = [
    { name: "beautifulsoup4", label: "beautifulsoup4" },
    { name: "markdownify", label: "markdownify" },
    { name: "charset-normalizer", label: "charset-normalizer" },
    { name: "defusedxml", label: "defusedxml" },
    { name: "requests", label: "requests" },
    { name: "Pillow", label: "Pillow" },
    { name: "pdfminer.six", label: "pdfminer" },
    { name: "pdfplumber", label: "pdfplumber" },
    { name: "mammoth", label: "mammoth" }
  ];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    try {
      const progress = 40 + Math.round((i + 1) / deps.length * 50);
      postMessage({ type: "status", message: `Instalando ${dep.label}...`, progress });
      await micropip.install(dep.name);
    } catch (e) {
      // dependency optional, continue
    }
  }

  postMessage({ type: "status", message: "Finalizando...", progress: 95 });
  postMessage({ type: "ready", message: "Worker listo" });
}

onmessage = async (e) => {
  const data = e.data;

  if (data.type === "init") {
    try {
      await init(data.wheelUrl);
    } catch (err) {
      postMessage({ type: "error", error: String(err) });
    }
  }

  if (data.type === "convert") {
    try {
      postMessage({ type: "status", message: "Convirtiendo documento...", progress: 50 });

      pyodide.FS.writeFile(data.name, new Uint8Array(data.buffer));
      pyodide.globals.set("filename", data.name);

      const markdown = await pyodide.runPythonAsync(`
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert(filename)
result.text_content
`);

      postMessage({ type: "result", markdown });
    } catch (err) {
      postMessage({ type: "error", error: String(err) });
    }
  }
};
