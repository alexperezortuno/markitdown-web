<template>
  <div class="app">
    <LoadingOverlay
      :visible="!isReady || isProcessing"
      :progress="progress"
      :message="status"
      :title="isProcessing ? 'Converting document' : 'Setting up environment'"
      :mode="isProcessing ? 'processing' : 'init'"
    />

    <AppHeader
      :is-ready="isReady"
      :is-processing="isProcessing"
      :status="status"
    />

    <main class="main">
      <FileDropzone
        :is-ready="isReady"
        :is-processing="isProcessing"
        :file-name="fileName"
        @file-selected="convertFile"
      />

      <Toolbar
        :markdown="markdown"
        :file-name="fileName"
        @clear="clear"
        v-if="markdown"
      />

      <Transition name="slide-up">
        <div v-if="error" class="error-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <strong>Conversion error</strong>
            <p>{{ error }}</p>
          </div>
        </div>
      </Transition>

      <OutputPanel :markdown="markdown" />
    </main>

    <footer class="footer">
      <p>
        100% local processing in your browser. No files are sent to external servers.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMarkItDown } from './composables/useMarkItDown.js'
import AppHeader from './components/AppHeader.vue'
import FileDropzone from './components/FileDropzone.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import OutputPanel from './components/OutputPanel.vue'
import Toolbar from './components/Toolbar.vue'

const {
  isReady,
  isProcessing,
  status,
  progress,
  markdown,
  error,
  fileName,
  init,
  convertFile,
  clear
} = useMarkItDown()

onMounted(() => {
  init()
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}

.error-banner {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 16px 0;
  background: var(--error-bg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: var(--error);
}

.error-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.error-banner strong {
  display: block;
  margin-bottom: 4px;
}

.error-banner p {
  font-size: 0.85rem;
  opacity: 0.8;
  word-break: break-word;
}

.footer {
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid var(--border-subtle);
  text-align: center;
}

.footer p {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
