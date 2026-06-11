<template>
  <div
    class="dropzone"
    :class="{ dragover, disabled: isProcessing }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @click="openFilePicker"
    role="button"
    tabindex="0"
    @keydown.enter="openFilePicker"
    @keydown.space.prevent="openFilePicker"
  >
    <input
      ref="fileInputRef"
      type="file"
      class="file-input"
      :accept="acceptedTypes"
      @change="onFileChange"
    />

    <div class="dropzone-content">
      <div class="icon-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>

      <p class="dropzone-title">
        <span v-if="isProcessing">Procesando archivo...</span>
        <span v-else>Arrastra tu archivo aqui o <span class="link">seleccionalo</span></span>
      </p>

      <div v-if="fileName" class="file-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span>{{ fileName }}</span>
      </div>

      <div class="formats">
        <span class="format-tag" v-for="fmt in formats" :key="fmt">{{ fmt }}</span>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="fileError" class="file-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {{ fileError }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isReady: Boolean,
  isProcessing: Boolean,
  fileName: String
})

const emit = defineEmits(['file-selected'])

const fileInputRef = ref(null)
const dragover = ref(false)
const fileError = ref(null)

const formats = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'HTML', 'IMG (OCR)', 'CSV', 'JSON', 'ZIP']

const acceptedExtensions = [
  '.pdf', '.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls',
  '.html', '.htm', '.csv', '.json', '.xml', '.zip', '.txt',
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp',
  '.mp3', '.wav', '.ogg', '.mp4', '.avi', '.mov'
]

const acceptedTypes = acceptedExtensions.join(',')

function onDragOver() {
  if (props.isProcessing) return
  dragover.value = true
}

function onDragLeave() {
  dragover.value = false
}

function onDrop(e) {
  dragover.value = false
  if (props.isProcessing) return

  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function openFilePicker() {
  if (props.isProcessing) return
  fileInputRef.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) handleFile(file)
  e.target.value = ''
}

function handleFile(file) {
  fileError.value = null

  const ext = '.' + file.name.split('.').pop().toLowerCase()
  const isAccepted = acceptedExtensions.includes(ext)

  if (!isAccepted) {
    fileError.value = `Formato no soportado. Formatos aceptados: ${formats.join(', ')}`
    setTimeout(() => { fileError.value = null }, 4000)
    return
  }

  emit('file-selected', file)
}
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-lg);
  padding: 48px 32px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  background: var(--bg-surface);
  overflow: hidden;
}

.dropzone:hover:not(.disabled) {
  border-color: var(--accent);
  background: var(--bg-surface-hover);
  box-shadow: var(--shadow-glow);
}

.dropzone.dragover {
  border-color: var(--accent);
  background: rgba(99, 102, 241, 0.08);
  box-shadow: var(--shadow-glow);
  transform: scale(1.01);
}

.dropzone.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  color: var(--text-secondary);
  transition: all var(--transition-base);
}

.dropzone:hover:not(.disabled) .icon-wrapper {
  color: var(--accent-hover);
  background: var(--accent-glow);
}

.dropzone.dragover .icon-wrapper {
  color: var(--accent-hover);
  transform: translateY(-4px);
}

.dropzone-title {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.link {
  color: var(--accent-hover);
  font-weight: 500;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-accent);
}

.formats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.format-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.dropzone:hover:not(.disabled) .format-tag {
  border-color: var(--border-default);
  color: var(--text-secondary);
}

.file-error {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: var(--error-bg);
  color: var(--error);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  backdrop-filter: blur(8px);
}

@media (max-width: 600px) {
  .dropzone {
    padding: 32px 20px;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .icon-wrapper svg {
    width: 36px;
    height: 36px;
  }
}
</style>
