## Mug with React Hooks

The following example demonstrates how to use a `Mug` hook for managing global state across your React application without the need for `Context` or `Providers`. This approach simplifies the state management for cases where React Context is overkill, providing a clean and straightforward alternative.

### Why Use Mug Instead of Context?

Using React Context and Providers often leads to complex nested structures and can add unnecessary boilerplate. In contrast, `Mug` offers a simpler approach by using a **singleton** pattern that allows global state management with hooks while avoiding context providers altogether.

### Example: Mug Hook for Managing Theme

In this example, we manage a global `theme` state without the need for Context Providers.

```tsx
import { useState, useEffect } from 'react';
import { Mug } from '@lipsquirrel/mug'; // Assuming this is where your Mug class is

// Define your app state interface
interface AppState {
  theme: string;
}

// Create a singleton instance of Mug
const mug = new Mug<AppState>({ theme: 'dark' });

// useMug hook to manage the global state
export function useMug<K extends keyof AppState>(key: K, initialValue: AppState[K]): [AppState[K], (value: AppState[K]) => void] {
  // Use state hook to manage the local state
  const [state, setState] = useState<AppState[K]>(() => {
    const currentState = mug.getState(key);
    return currentState !== undefined ? currentState : initialValue;
  });

  // Use effect hook to subscribe to state changes
  useEffect(() => {
    const unsubscribe = mug.subscribe(key, setState);

    // Cleanup function to unsubscribe on unmount
    return () => unsubscribe();
  }, [key]);

  // Function to update global state
  const updateGlobalState = (value: AppState[K]) => {
    mug.setState(key, value);
  };

  return [state, updateGlobalState];
}
```

### How It Works

1. **State Initialization**: The `mug` singleton is initialized with an initial state (`{ theme: 'dark' }`). This state is globally shared across all components that use the `useMug` hook.
2. **useMug Hook**: The `useMug` hook takes two arguments: the key for the global state and an initial value. It:

   - Retrieves the current value from the global `mug` state.
   - Subscribes to updates of the global state.
   - Returns the current state and a setter function to update the global state.

3. **Automatic Subscription/Unsubscription**: The `useEffect` hook automatically subscribes to changes to the global state when the component mounts and cleans up the subscription when the component unmounts.

4. **Global State Updates**: The `updateGlobalState` function updates both the global state in the `Mug` singleton and the local state within the component.

### Usage Example

```tsx
import React from 'react';
import { useMug } from './useMug';

const ThemeComponent: React.FC = () => {
  // Use the global 'theme' state with useMug
  const [theme, setTheme] = useMug('theme', 'light');

  return (
    <div>
      <h1>Current Theme: {theme}</h1>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={() => setTheme('light')}>Set Light Theme</button>
    </div>
  );
};

export default ThemeComponent;
```

### Benefits of Using Mug with Hooks

- **Simplified Global State Management**: You don’t need to pass props or wrap components with Context Providers. `Mug` provides a global state that's easily accessible through the `useMug` hook.
- **Cleaner Code**: Avoiding the use of `Context` and `Providers` removes boilerplate and nested component structures, leading to cleaner and more maintainable code.

- **Reactivity**: The `useMug` hook automatically subscribes to changes in the global state and updates components when the global state changes.

- **Efficient and Lightweight**: This approach is simpler and more efficient for smaller applications or specific use cases where a full context/provider solution is overkill.

### Conclusion

`Mug` provides a simple alternative to `React Context` by simplifying global state management through a singleton and hooks. It avoids the common pitfalls of overusing providers and context while maintaining a clean, reactive system for managing global application state.
