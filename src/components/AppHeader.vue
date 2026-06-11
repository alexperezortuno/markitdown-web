<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
          <path d="M8 22V10l4 6 4-6v12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 16h4m-2-2v4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="header-text">
        <h1 class="title">MarkItDown</h1>
        <p class="subtitle">Convert documents to Markdown in your browser</p>
      </div>
    </div>
    <div class="header-right">
      <div class="status-badge" :class="badgeClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ label }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isReady: Boolean,
  isProcessing: Boolean,
  status: String
})

const badgeClass = computed(() => {
  if (props.isProcessing) return 'processing'
  if (props.isReady) return 'ready'
  return 'loading'
})

const label = computed(() => {
  if (props.isProcessing) return 'Processing...'
  if (props.isReady) return 'Ready'
  return 'Loading...'
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  flex-shrink: 0;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all var(--transition-base);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge.loading {
  background: var(--warning-bg);
  color: var(--warning);
}

.status-badge.loading .status-dot {
  background: var(--warning);
  animation: pulse 1.5s infinite;
}

.status-badge.ready {
  background: var(--success-bg);
  color: var(--success);
}

.status-badge.ready .status-dot {
  background: var(--success);
}

.status-badge.processing {
  background: var(--accent-glow);
  color: var(--accent-hover);
}

.status-badge.processing .status-dot {
  background: var(--accent-hover);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .subtitle {
    display: none;
  }
}
</style>
