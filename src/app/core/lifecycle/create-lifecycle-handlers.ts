import type { LifecycleLogFn, LifecyclePhase } from './lifecycle.types';

export function formatLifecycleDetail(detail: unknown): string | undefined {
  if (detail === undefined) return undefined;
  if (
    typeof detail === 'string' ||
    typeof detail === 'number' ||
    typeof detail === 'boolean'
  ) {
    return String(detail);
  }
  try {
    return JSON.stringify(detail);
  } catch {
    return String(detail);
  }
}

export function createLifecycleHandlers(
  prefix: string,
  onLog?: LifecycleLogFn,
) {
  const emit = (phase: LifecyclePhase, detail?: string) => {
    const label = `[${prefix}] ${phase}`;
    if (detail !== undefined) {
      console.log(label, detail);
    } else {
      console.log(label);
    }
    onLog?.(phase, detail);
  };

  return {
    onReady: () => emit('onReady'),
    onFocus: () => emit('onFocus'),
    onBlur: () => emit('onBlur'),
    onChange: (html: string) =>
      emit(
        'onChange',
        html.length > 120 ? `${html.slice(0, 120)}…` : html,
      ),
    onAuthSuccess: () => emit('onAuthSuccess'),
    onAuthError: (error: string) => emit('onAuthError', error),
  };
}
