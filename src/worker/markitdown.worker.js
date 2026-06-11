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

  postMessage({ type: "status", message: "Instalando dependencias PDF...", progress: 50 });

  const deps = [
    { name: "pdfminer.six", label: "pdfminer" },
    { name: "pdfplumber", label: "pdfplumber" },
    { name: "mammoth", label: "mammoth" }
  ];

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i];
    try {
      postMessage({ type: "status", message: `Instalando ${dep.label}...`, progress: 50 + (i + 1) * 15 });
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
