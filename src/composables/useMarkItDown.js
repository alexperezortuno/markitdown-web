import { ref, readonly } from 'vue'

const isReady = ref(false)
const isProcessing = ref(false)
const status = ref('Inicializando...')
const progress = ref(0)
const markdown = ref('')
const error = ref(null)
const fileName = ref(null)

let worker = null
let statusCallbacks = []

function createWorker() {
  worker = new Worker(
    new URL('../worker/markitdown.worker.js', import.meta.url)
  )

  worker.onmessage = (event) => {
    const data = event.data

    switch (data.type) {
      case 'status':
        status.value = data.message
        if (data.progress !== undefined) {
          progress.value = data.progress
        }
        statusCallbacks.forEach(cb => cb(data))
        break

      case 'ready':
        isReady.value = true
        status.value = 'Listo para convertir'
        progress.value = 100
        break

      case 'result':
        markdown.value = data.markdown
        isProcessing.value = false
        status.value = 'Conversion completada'
        progress.value = 100
        break

      case 'error':
        error.value = data.error
        isProcessing.value = false
        status.value = 'Error en la conversion'
        console.error('Worker error:', data.error)
        break
    }
  }

  worker.onerror = (err) => {
    error.value = err.message
    isProcessing.value = false
    status.value = 'Error del worker'
  }
}

function init() {
  createWorker()
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const wheelUrl = new URL(`${base}/wheels/markitdown-0.1.6-py3-none-any.whl`, window.location.href).href
  worker.postMessage({ type: 'init', wheelUrl })
}

async function convertFile(file) {
  if (!file || !isReady.value) return

  isProcessing.value = true
  error.value = null
  fileName.value = file.name
  status.value = `Procesando ${file.name}...`
  progress.value = 0

  const buffer = await file.arrayBuffer()

  worker.postMessage({
    type: 'convert',
    name: file.name,
    buffer
  })
}

function clear() {
  markdown.value = ''
  fileName.value = null
  error.value = null
  status.value = isReady.value ? 'Listo para convertir' : 'Inicializando...'
}

function onStatus(callback) {
  statusCallbacks.push(callback)
  return () => {
    statusCallbacks = statusCallbacks.filter(cb => cb !== callback)
  }
}

export function useMarkItDown() {
  return {
    isReady: readonly(isReady),
    isProcessing: readonly(isProcessing),
    status: readonly(status),
    progress: readonly(progress),
    markdown: readonly(markdown),
    error: readonly(error),
    fileName: readonly(fileName),
    init,
    convertFile,
    clear,
    onStatus
  }
}
