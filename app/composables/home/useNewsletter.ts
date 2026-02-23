export function useNewsletter() {
  const toast = useToast();
  const { t } = useI18n();

  const email = ref('');
  const subscribing = ref(false);

  async function subscribe() {
    if (!email.value)
      return;

    subscribing.value = true;
    try {
      // TODO: Implement actual subscription API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.add({
        title: t('newsletter.toast.success'),
        description: t('newsletter.toast.successDescription'),
        color: 'success',
        icon: 'i-lucide-check',
      });
      email.value = '';
    }
    catch {
      toast.add({
        title: t('common.error'),
        description: t('newsletter.toast.error'),
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
    finally {
      subscribing.value = false;
    }
  }

  return { email, subscribing, subscribe };
}
