export function createEditorProxy<T extends object>(
  target: T,
  onCall: (info: {
    method: keyof T;
    args: Array<unknown>;
    timestamp: Date;
    durationMs: number;
  }) => void
): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);

      if (typeof original === "function") {
        return (...args: Array<unknown>) => {
          const start = performance.now();
          const timestamp = new Date();
          const result = (original as (...args: Array<unknown>) => unknown).apply(
            target,
            args
          );
          const durationMs = performance.now() - start;

          onCall({
            method: prop as keyof T,
            args,
            timestamp,
            durationMs,
          });

          return result;
        };
      }

      return original;
    },
  });
}
