let timer: ReturnType<typeof setTimeout>;
export const debounce = (f: () => void, ms: number) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    f();
  }, ms);
};

export function debounceAsync<T>(func: () => Promise<T>, delay: number): () => Promise<T> {
  let timeout: NodeJS.Timeout;
  let resolvePromise: (value: T) => void;
  let rejectPromise: (reason?: any) => void;

  return () => {
    return new Promise<T>((resolve, reject) => {
      clearTimeout(timeout);
      resolvePromise = resolve;
      rejectPromise = reject;

      timeout = setTimeout(async () => {
        try {
          const result = await func();
          resolvePromise(result);
        } catch (error) {
          rejectPromise(error);
        }
      }, delay);
    });
  };
}
