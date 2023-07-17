import { onCleanup } from "solid-js";

export function useEvent<K extends keyof WindowEventMap>(
  event: K,
  fn: (e: WindowEventMap[K]) => void
) {
  window.addEventListener(event, fn);
  onCleanup(() => window.removeEventListener(event, fn));
}
