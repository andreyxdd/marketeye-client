import { runWithMaxConcurrency } from '../renderer/lib/prefetchQueue';

describe('runWithMaxConcurrency', () => {
  it('runs tasks with at most maxConcurrent in flight', async () => {
    let inFlight = 0;
    let maxObserved = 0;

    const tasks = [1, 2, 3, 4].map(
      (n) => () =>
        new Promise<number>((resolve) => {
          inFlight += 1;
          maxObserved = Math.max(maxObserved, inFlight);
          setTimeout(() => {
            inFlight -= 1;
            resolve(n);
          }, 10);
        })
    );

    const results = await runWithMaxConcurrency(tasks, 2);
    expect(results).toEqual([1, 2, 3, 4]);
    expect(maxObserved).toBeLessThanOrEqual(2);
  });

  it('continues after partial failures', async () => {
    const tasks = [
      () => Promise.resolve('ok'),
      () => Promise.reject(new Error('fail')),
      () => Promise.resolve('also-ok'),
    ];

    const results = await runWithMaxConcurrency(tasks, 2);
    expect(results).toEqual(['ok', undefined, 'also-ok']);
  });
});
