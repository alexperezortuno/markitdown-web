<template>
  <div class="output-panel" v-if="markdown">
    <div class="panel-tabs">
      <button
        class="tab"
        :class="{ active: activeTab === 'split' }"
        @click="activeTab = 'split'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
        </svg>
        Split
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'raw' }"
        @click="activeTab = 'raw'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        Raw
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'preview' }"
        @click="activeTab = 'preview'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Preview
      </button>
    </div>

    <div class="panels" :class="activeTab">
      <div class="panel raw-panel" v-show="activeTab === 'split' || activeTab === 'raw'">
        <div class="panel-header">
          <span>Markdown</span>
        </div>
        <div class="panel-body">
          <pre class="raw-content"><code>{{ markdown }}</code></pre>
        </div>
      </div>

      <div class="panel-divider" v-show="activeTab === 'split'"></div>

      <div class="panel preview-panel" v-show="activeTab === 'split' || activeTab === 'preview'">
        <div class="panel-header">
          <span>Vista previa</span>
        </div>
        <div class="panel-body">
          <div class="preview-content markdown-body" v-html="renderedHtml"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="empty-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    </div>
    <p class="empty-title">Results will appear here</p>
    <p class="empty-subtitle">Select or drop a document to get started</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  markdown: { type: String, default: '' }
})

const activeTab = ref('split')

marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true
})

const renderedHtml = computed(() => {
  if (!props.markdown) return ''
  return marked(props.markdown)
})
</script>

<style scoped>
.output-panel {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface);
}

.panel-tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  transition: all var(--transition-fast);
}

.tab:hover {
  color: var(--text-secondary);
  background: var(--bg-surface-hover);
}

.tab.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.panels {
  display: flex;
  height: 500px;
}

.panels.raw {
  flex-direction: column;
}

.panels.preview {
  flex-direction: column;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.panel-divider {
  width: 1px;
  background: var(--border-default);
  flex-shrink: 0;
}

.panel-header {
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.panel-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.raw-content {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.preview-content {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: var(--text-primary);
}

.preview-content :deep(h1) { font-size: 1.6em; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.3em; }
.preview-content :deep(h2) { font-size: 1.3em; }
.preview-content :deep(h3) { font-size: 1.1em; }

.preview-content :deep(p) {
  margin-bottom: 1em;
}

.preview-content :deep(a) {
  color: var(--accent-hover);
}

.preview-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  padding: 2px 6px;
  background: var(--bg-elevated);
  border-radius: 4px;
  color: var(--text-accent);
}

.preview-content :deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.preview-content :deep(pre code) {
  padding: 0;
  background: none;
}

.preview-content :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 16px;
  margin: 1em 0;
  color: var(--text-secondary);
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 1em;
}

.preview-content :deep(li) {
  margin-bottom: 0.3em;
}

.preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid var(--border-default);
  padding: 8px 12px;
  text-align: left;
}

.preview-content :deep(th) {
  background: var(--bg-elevated);
  font-weight: 600;
}

.preview-content :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

.preview-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 1.5em 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.empty-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .panels.split {
    flex-direction: column;
  }

  .panel-divider {
    width: 100%;
    height: 1px;
  }

  .panels {
    height: 400px;
  }

  .tab span {
    display: none;
  }

  .tab svg {
    margin: 0;
  }
}
</style>
