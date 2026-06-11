<template>
  <Transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-card">
        <div class="spinner">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border-default)" stroke-width="3"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="url(#spinner-gradient)" stroke-width="3"
              stroke-dasharray="80" stroke-dashoffset="60" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite"/>
            </circle>
            <defs>
              <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p class="loading-title">{{ title }}</p>
        <p class="loading-message">{{ message }}</p>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <div v-if="mode === 'init'" class="progress-steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step"
            :class="{ active: currentStep >= i, done: currentStep > i }"
          >
            <div class="step-dot">
              <svg v-if="currentStep > i" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  progress: { type: Number, default: 0 },
  message: { type: String, default: '' },
  title: { type: String, default: 'Preparando el entorno' },
  mode: { type: String, default: 'init' }
})

const steps = ['Pyodide', 'MarkItDown', 'Dependencias', 'Listo']

const currentStep = computed(() => {
  const p = props.progress
  if (p >= 95) return 4
  if (p >= 50) return 3
  if (p >= 25) return 2
  if (p >= 10) return 1
  return 0
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(12px);
}

.loading-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: 40px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.spinner {
  margin: 0 auto 24px;
  width: 48px;
  height: 48px;
}

.loading-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.loading-message {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.progress-bar {
  height: 4px;
  background: var(--border-subtle);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 24px;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 2px;
  transition: width var(--transition-slow);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.step-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  color: transparent;
}

.step.active .step-dot {
  border-color: var(--accent);
  background: var(--accent-glow);
}

.step.done .step-dot {
  border-color: var(--success);
  background: var(--success);
  color: white;
}

.step-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: color var(--transition-base);
}

.step.active .step-label {
  color: var(--text-secondary);
}

.step.done .step-label {
  color: var(--success);
}

@media (max-width: 400px) {
  .loading-card {
    padding: 28px 20px;
  }

  .step-label {
    font-size: 0.6rem;
  }
}
</style>
