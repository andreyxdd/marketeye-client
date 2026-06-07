/* eslint-disable import/prefer-default-export, no-await-in-loop */
export async function runWithMaxConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  maxConcurrent: number
): Promise<Array<T | undefined>> {
  const results: Array<T | undefined> = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      try {
        results[currentIndex] = await tasks[currentIndex]();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        results[currentIndex] = undefined;
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(maxConcurrent, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}
