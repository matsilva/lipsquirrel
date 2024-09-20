/**
 * SimpleGeneratorSemaphore is a class that controls concurrency for asynchronous tasks,
 * limiting how many tasks can run simultaneously. It uses an async generator to acquire
 * the semaphore, allowing the caller to yield until a slot becomes available.
 *
 * This is useful when you want to ensure that only a certain number of tasks
 * run in parallel, and the rest wait for a slot to free up.
 *
 * Example Usage:
 *
 * async function runTasksWithSemaphore() {
 *   const semaphore = new SimpleGeneratorSemaphore(2); // Maximum 2 tasks can run in parallel
 *
 *   async function performTask(taskId: number) {
 *     for await (const _ of semaphore.acquire()) {
 *       console.log(`Task ${taskId} is starting`);
 *       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async work
 *       console.log(`Task ${taskId} is finished`);
 *       semaphore.release(); // Release the semaphore to allow another task to proceed
 *       break; // Exit after acquiring and releasing the semaphore once
 *     }
 *   }
 *
 *   const tasks = [1, 2, 3, 4, 5].map((id) => performTask(id));
 *   await Promise.all(tasks); // Wait for all tasks to complete
 * }
 *
 * runTasksWithSemaphore();
 */
export class SimpleGeneratorSemaphore {
  private tasks: (() => void)[] = [];
  private count: number;

  constructor(max: number) {
    this.count = max;
  }

  async *acquire(): AsyncGenerator<void, void, unknown> {
    while (true) {
      if (this.count > 0) {
        this.count -= 1;
        yield; // Allows the task to proceed
      } else {
        await new Promise<void>((resolve) => this.tasks.push(resolve));
        yield; // Allows the task to proceed
      }
    }
  }

  release(): void {
    if (this.tasks.length > 0) {
      const nextTask = this.tasks.shift();
      if (nextTask) nextTask(); // Wake up the next task waiting in the queue
    } else {
      this.count += 1;
    }
  }
}

/**
 * SimpleSemaphore is a class that manages concurrency for asynchronous tasks.
 * It limits the number of tasks that can run simultaneously by using acquire and release methods.
 *
 * This version of the semaphore does not use a generator, and tasks simply await on acquire
 * until a slot is available.
 *
 * Example Usage:
 *
 * const semaphore = new SimpleSemaphore(3); // Allow up to 3 tasks in parallel
 *
 * await semaphore.acquire(); // Acquire a slot
 * // Perform some asynchronous work here
 * semaphore.release(); // Release the slot after work is done
 */
export class SimpleSemaphore {
  private tasks: (() => void)[] = []; // Queue of tasks waiting for a slot
  private count: number; // Number of available slots for concurrent tasks

  constructor(max: number) {
    this.count = max; // Initialize with the maximum number of concurrent tasks
  }

  /**
   * Acquires a slot in the semaphore.
   * If a slot is available, the task proceeds immediately.
   * Otherwise, it waits until a slot becomes available.
   *
   * @returns {Promise<void>} A promise that resolves when a slot is available.
   */
  acquire(): Promise<void> {
    if (this.count > 0) {
      this.count -= 1; // Decrement the available slots
      return Promise.resolve(); // Task can proceed immediately
    }

    // If no slots are available, push the task to the queue and resolve when a slot is freed
    return new Promise((resolve) => this.tasks.push(resolve));
  }

  /**
   * Releases a slot in the semaphore, allowing the next task in the queue to proceed.
   * If no tasks are waiting, the count of available slots is incremented.
   */
  release(): void {
    if (this.tasks.length > 0) {
      const nextTask = this.tasks.shift();
      if (nextTask) nextTask(); // Resume the next waiting task
    } else {
      this.count += 1; // Increment the available slots if no tasks are waiting
    }
  }
}
