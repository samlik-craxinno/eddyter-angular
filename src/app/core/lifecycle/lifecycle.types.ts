export type LifecyclePhase =
  | 'onReady'
  | 'onFocus'
  | 'onBlur'
  | 'onChange'
  | 'onAuthSuccess'
  | 'onAuthError';

export type LifecycleLogFn = (phase: LifecyclePhase, detail?: string) => void;
