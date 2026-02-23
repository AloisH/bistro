<script setup lang="ts">
import type { CreateTodoInput } from '#shared/todo';
import { createTodoSchema } from '#shared/todo';

interface Emits {
  (e: 'created'): void;
}

const emit = defineEmits<Emits>();

const { t } = useI18n();

const { createTodo } = useTodos();

const state = reactive<CreateTodoInput>({
  title: '',
  description: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    await createTodo(state);
    emit('created');
    state.title = '';
    state.description = '';
  }
  catch {
    error.value = t('todo.toast.createFormError');
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm
    :state="state"
    :schema="createTodoSchema"
    :aria-label="t('todo.createNewTodo')"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-3">
      <UFormField
        name="title"
        :label="t('todo.titleLabel')"
        required
      >
        <UInput
          v-model="state.title"
          :placeholder="t('todo.titlePlaceholder')"
          autocomplete="off"
          @keyup.enter="onSubmit"
        />
      </UFormField>

      <UFormField
        name="description"
        :label="t('todo.descriptionLabel')"
      >
        <UTextarea
          v-model="state.description"
          :placeholder="t('todo.descriptionPlaceholder')"
          autocomplete="off"
          :rows="2"
        />
      </UFormField>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
        class="animate-in fade-in slide-in-from-top duration-300"
      />

      <UButton
        type="submit"
        icon="i-lucide-plus"
        :loading="loading"
        block
      >
        {{ $t('todo.addButton') }}
      </UButton>
    </div>
  </UForm>
</template>
