<script setup lang="ts">
interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'label'
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'muted'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  mono?: boolean
}

withDefaults(defineProps<Props>(), {
  as: 'p',
  variant: 'body',
  weight: 'normal',
  mono: false,
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'text',
      `text--${variant}`,
      `text--weight-${weight}`,
      { 'text--mono': mono }
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.text {
  margin: 0;
  color: var(--color-text-primary);
}

/* ── Variants ── */
.text--hero {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: var(--line-height-tight);
  letter-spacing: -0.03em;
}

.text--h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.text--h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.text--h3 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--line-height-tight);
}

.text--h4 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--line-height-tight);
}

.text--body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);
}

.text--body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--line-height-normal);
}

.text--caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: var(--line-height-normal);
  letter-spacing: 0.02em;
}

.text--muted {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

/* ── Weights ── */
.text--weight-normal { font-weight: var(--font-weight-normal); }
.text--weight-medium { font-weight: var(--font-weight-medium); }
.text--weight-semibold { font-weight: var(--font-weight-semibold); }
.text--weight-bold { font-weight: var(--font-weight-bold); }
.text--weight-extrabold { font-weight: var(--font-weight-extrabold); }

/* ── Mono ── */
.text--mono {
  font-family: var(--font-mono);
  font-feature-settings: 'liga' 1, 'calt' 1;
}
</style>
