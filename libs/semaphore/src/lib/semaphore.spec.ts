import { describe, it, expect } from 'vitest';
import { SimpleGeneratorSemaphore, SimpleSemaphore } from './semaphore';

/**
 * Unit tests for SimpleGeneratorSemaphore
 */
describe('SimpleGeneratorSemaphore', () => {
  it('should allow limited tasks to run in parallel', async () => {
    const semaphore = new SimpleGeneratorSemaphore(2);
    const log: string[] = [];

    async function performTask(taskId: number) {
      for await (const _ of semaphore.acquire()) {
        log.push(`Task ${taskId} is starting`);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async work
        log.push(`Task ${taskId} is finished`);
        semaphore.release();
        break;
      }
    }

    const tasks = [1, 2, 3, 4].map((id) => performTask(id));
    await Promise.all(tasks);

    expect(log).toEqual([
      'Task 1 is starting',
      'Task 2 is starting',
      'Task 1 is finished',
      'Task 3 is starting',
      'Task 2 is finished',
      'Task 4 is starting',
      'Task 3 is finished',
      'Task 4 is finished',
    ]);
  });

  it('should queue tasks when all slots are occupied', async () => {
    const semaphore = new SimpleGeneratorSemaphore(1);
    const log: string[] = [];

    async function performTask(taskId: number) {
      for await (const _ of semaphore.acquire()) {
        log.push(`Task ${taskId} is starting`);
        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async work
        log.push(`Task ${taskId} is finished`);
        semaphore.release();
        break;
      }
    }

    const tasks = [1, 2, 3].map((id) => performTask(id));
    await Promise.all(tasks);

    expect(log).toEqual([
      'Task 1 is starting',
      'Task 1 is finished',
      'Task 2 is starting',
      'Task 2 is finished',
      'Task 3 is starting',
      'Task 3 is finished',
    ]);
  });
});

/**
 * Unit tests for SimpleSemaphore
 */
describe('SimpleSemaphore', () => {
  it('should allow limited tasks to run in parallel', async () => {
    const semaphore = new SimpleSemaphore(2);
    const log: string[] = [];

    async function performTask(taskId: number) {
      await semaphore.acquire();
      log.push(`Task ${taskId} is starting`);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async work
      log.push(`Task ${taskId} is finished`);
      semaphore.release();
    }

    const tasks = [1, 2, 3, 4].map((id) => performTask(id));
    await Promise.all(tasks);

    expect(log).toEqual([
      'Task 1 is starting',
      'Task 2 is starting',
      'Task 1 is finished',
      'Task 3 is starting',
      'Task 2 is finished',
      'Task 4 is starting',
      'Task 3 is finished',
      'Task 4 is finished',
    ]);
  });

  it('should queue tasks when slots are unavailable', async () => {
    const semaphore = new SimpleSemaphore(1);
    const log: string[] = [];

    async function performTask(taskId: number) {
      await semaphore.acquire();
      log.push(`Task ${taskId} is starting`);
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async work
      log.push(`Task ${taskId} is finished`);
      semaphore.release();
    }

    const tasks = [1, 2, 3].map((id) => performTask(id));
    await Promise.all(tasks);

    expect(log).toEqual([
      'Task 1 is starting',
      'Task 1 is finished',
      'Task 2 is starting',
      'Task 2 is finished',
      'Task 3 is starting',
      'Task 3 is finished',
    ]);
  });
});
