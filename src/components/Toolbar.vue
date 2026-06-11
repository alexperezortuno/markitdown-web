<template>
  <div class="toolbar" v-if="hasContent">
    <div class="toolbar-left">
      <span class="file-label" v-if="fileName">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        {{ fileName }}
      </span>
    </div>
    <div class="toolbar-right">
      <button class="btn btn-ghost" @click="copyMarkdown" :disabled="!hasContent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      </button>
      <button class="btn btn-ghost" @click="downloadMarkdown" :disabled="!hasContent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download .md
      </button>
      <button class="btn btn-danger" @click="$emit('clear')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Clear
      </button>
    </div>

    <Transition name="slide-up">
      <div v-if="toast" class="toast" :class="toast.type">
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  markdown: { type: String, default: '' },
  fileName: { type: String, default: '' }
})

defineEmits(['clear'])

const toast = ref(null)
let toastTimeout = null

const hasContent = computed(() => props.markdown && props.markdown.length > 0)

function showToast(message, type = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { message, type }
  toastTimeout = setTimeout(() => { toast.value = null }, 2500)
}

async function copyMarkdown() {
  if (!hasContent.value) return
  try {
    await navigator.clipboard.writeText(props.markdown)
    showToast('Markdown copied to clipboard')
  } catch {
    showToast('Error copying', 'error')
  }
}

function downloadMarkdown() {
  if (!hasContent.value) return

  const baseName = props.fileName
    ? props.fileName.replace(/\.[^/.]+$/, '')
    : 'documento'

  const blob = new Blob([props.markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${baseName}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showToast(`Downloaded: ${baseName}.md`)
}
</script>

<style scoped>
.toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-accent);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-ghost {
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.btn-danger {
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid transparent;
}

.btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}

.toast {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 16px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-md);
  z-index: 50;
}

.toast.success {
  background: var(--success-bg);
  color: var(--success);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.toast.error {
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }

  .btn span {
    display: none;
  }
}
</style>
