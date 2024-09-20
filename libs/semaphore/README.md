# Semaphore Library

This is a simple semaphore library for managing concurrency in JavaScript/TypeScript applications. It provides two semaphore implementations to limit the number of asynchronous tasks that can run concurrently:

- `SimpleGeneratorSemaphore`: Uses an async generator for more advanced use cases where you may need to yield control.
- `SimpleSemaphore`: A straightforward promise-based semaphore for managing task concurrency.

## Installation

Install the library via npm:

```bash
npm install @lipsquirrel/semaphore --save
```

## Usage

### 1. `SimpleGeneratorSemaphore`

The `SimpleGeneratorSemaphore` class uses an async generator to allow multiple tasks to run concurrently while limiting the number of tasks in execution.

```typescript
import { SimpleGeneratorSemaphore } from 'your-semaphore-library-name';

async function runTasksWithSemaphore() {
  const semaphore = new SimpleGeneratorSemaphore(2); // Allows up to 2 tasks to run at the same time

  async function performTask(taskId: number) {
    for await (const _ of semaphore.acquire()) {
      console.log(`Task ${taskId} is starting`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async work
      console.log(`Task ${taskId} is finished`);
      semaphore.release();
      break;
    }
  }

  const tasks = [1, 2, 3, 4, 5].map((id) => performTask(id));
  await Promise.all(tasks); // Wait for all tasks to complete
}

runTasksWithSemaphore();
```

#### API

- **`constructor(max: number)`**: Creates a new semaphore with a maximum number of concurrent tasks.
- **`acquire(): AsyncGenerator<void, void, unknown>`**: Acquires a slot in the semaphore. If no slot is available, it waits until one is released.
- **`release(): void`**: Releases a slot, allowing another task to proceed.

### 2. `SimpleSemaphore`

The `SimpleSemaphore` class provides a simpler mechanism for controlling concurrency without using an async generator.

```typescript
import { SimpleSemaphore } from 'your-semaphore-library-name';

async function runTasksWithSemaphore() {
  const semaphore = new SimpleSemaphore(3); // Allows up to 3 tasks to run at the same time

  async function performTask(taskId: number) {
    await semaphore.acquire();
    console.log(`Task ${taskId} is starting`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async work
    console.log(`Task ${taskId} is finished`);
    semaphore.release();
  }

  const tasks = [1, 2, 3, 4, 5].map((id) => performTask(id));
  await Promise.all(tasks); // Wait for all tasks to complete
}

runTasksWithSemaphore();
```

#### API

- **`constructor(max: number)`**: Creates a new semaphore with a maximum number of concurrent tasks.
- **`acquire(): Promise<void>`**: Acquires a slot in the semaphore. If no slot is available, the promise waits until one is released.
- **`release(): void`**: Releases a slot, allowing another task to proceed.

## Running Tests

This library includes unit tests using Vitest. To run the tests:

1. Install dependencies:

```bash
npm install
```

2. Run the tests:

```bash
npx nx test semaphore
```

## Use Cases

- **Rate-limiting API calls**: When making requests to external services that have rate limits, you can use the semaphore to limit the number of requests being made in parallel.
- **Controlling parallel execution**: Use this library to limit how many async tasks run concurrently, which can help control resource consumption like CPU, memory, or network bandwidth.
- **Queueing tasks**: Ensure tasks are queued if too many are running at once, and they only proceed when there is capacity to handle them.

## Contributing

Feel free to contribute to this library by submitting a pull request or opening an issue.

To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b <your-branch>`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Add automated unit tests.
5. Push to the branch (`git push origin <your-branch>`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for more details.
