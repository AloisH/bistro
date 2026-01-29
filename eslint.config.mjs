// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default withNuxt(
  {
    ignores: ['coverage/**', 'prisma/generated/**'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      'vuejs-accessibility/label-has-for': ['error', {
        controlComponents: ['UInput', 'UTextarea', 'UCheckbox', 'USelect', 'URadio', 'URadioGroup', 'USelectMenu'],
        required: { some: ['nesting', 'id'] },
      }],
    },
  },
);
