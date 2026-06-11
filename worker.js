importScripts(
    "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js"
);

let pyodide;

async function init() {

    postMessage({
        type: "status",
        message: "Loading Pyodide..."
    });

    pyodide =
        await loadPyodide();

    await pyodide.loadPackage(
        "micropip"
    );

    const micropip =
        pyodide.pyimport(
            "micropip"
        );

    postMessage({
        type: "status",
        message:
            "Installing MarkItDown..."
    });

    const wheelUrl =
        new URL(
            "wheels/markitdown-0.1.6-py3-none-any.whl",
            self.location.href
        ).href;

    await micropip.install(
        wheelUrl
    );

    try {

        postMessage({
            type: "status",
            message: "Installing PDF dependencies..."
        });

        await micropip.install("pdfminer.six");
        postMessage({
            type: "status",
            message: "PDF dependencies OK"
        })
    } catch (e) {
        postMessage({
            type: "status",
            message: "PDF dependencies FAIL: " + e
        })
    }

    try {
        postMessage({
            type: "status",
            message: "Installing pdfplumber..."
        });

        await micropip.install("pdfplumber");

        postMessage({
            type: "status",
            message: "pdfplumber OK"
        });
    } catch (e) {
        postMessage({
            type: "status",
            message: "pdfplumber FAIL: " + e
        })
    }

    try {
        postMessage({
            type: "status",
            message: "Installing mammoth..."
        });
        await micropip.install("mammoth");
        postMessage({
            type: "status",
            message: "mammoth OK"
        });
    } catch (e) {
        postMessage({
            type: "status",
            message: "mammoth FAIL: " + e
        });
    }

    try {
        postMessage({
            type: "status",
            message: "Installing pdfminer..."
        });
        await micropip.install("pdfminer.six");
        postMessage({
            type: "status",
            message: "pdfminer OK"
        });
    } catch (e) {
        postMessage({
            type: "status",
            message: "pdfminer FAIL: " + e
        });
    }

    postMessage({
        type: "ready",
        message: "Worker is ready"
    });
}

onmessage = async (e) => {

    const data = e.data;

    if (data.type === "init") {

        try {
            await init();
        } catch (err) {

            postMessage({
                type: "error",
                error: String(err)
            });
        }
    }

    if (data.type === "convert") {

        try {

            postMessage({
                type: "status",
                message:
                    "Processing..."
            });

            pyodide.FS.writeFile(
                data.name,
                new Uint8Array(
                    data.buffer
                )
            );

            pyodide.globals.set(
                "filename",
                data.name
            );

            const debug = await pyodide.runPythonAsync(`
import importlib.util

{
    "pdfminer": importlib.util.find_spec("pdfminer") is not None,
    "pdfplumber": importlib.util.find_spec("pdfplumber") is not None,
}
`);

            console.log(debug);

            const markdown =
                await pyodide.runPythonAsync(`
from markitdown import MarkItDown

md = MarkItDown()

result = md.convert(filename)

result.text_content
`);

            postMessage({
                type: "result",
                markdown
            });

        } catch (err) {

            postMessage({
                type: "error",
                error:
                    String(err)
            });
        }
    }
};