// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  ignores: ['coverage/**', 'prisma/generated/**'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    // Disable rules that conflict with Prettier
    '@stylistic/operator-linebreak': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
});
