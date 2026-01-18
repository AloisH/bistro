export function useScrollAnimation() {
  const animatedElements = ref<Set<Element>>(new Set());

  function observe(el: Ref<HTMLElement | null> | HTMLElement | null) {
    const target = isRef(el) ? el.value : el;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedElements.value.has(entry.target)) {
            entry.target.classList.add('animate-in');
            animatedElements.value.add(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    onUnmounted(() => {
      observer.disconnect();
    });
  }

  return { observe };
}
