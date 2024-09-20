## Mug with Vue

The following example demonstrates how to use a `Mug`-based store for managing global state in Vue, without the need for Vue's `provide`/`inject` or `Pinia`. This approach simplifies state management by leveraging Vue's reactivity system in combination with a **singleton** pattern, providing a clean and straightforward alternative for global state management.

### Example: Mug Store for Managing Global State

In this example, we manage both `theme` and `user` state dynamically, allowing you to access and modify these properties from the `Mug` global store without needing manual subscriptions or complex state management libraries like Pinia.

```typescript
// mugStore.ts - Mug-based store for Vue

import { reactive, watch, onUnmounted } from 'vue';
import { Mug } from './Mug';

// Define your app state interface
interface GlobalState {
  theme: string;
  user: { name: string; loggedIn: boolean };
  // You can easily add more properties here
}

// Create a singleton instance of Mug for global state management
const mug = new Mug<GlobalState>({ theme: 'dark', user: { name: 'Guest', loggedIn: false } }); // Add more initial values if needed

// Create a generic function to get/set multiple properties dynamically
export function useMugStore<K extends keyof GlobalState>(...keys: K[]) {
  // Create a reactive object that mirrors the global Mug state for each key
  const state = reactive(
    keys.reduce((acc, key) => {
      acc[key] = mug.getState(key) || ''; // Initialize with the current Mug state value
      return acc;
    }, {} as { [P in K]: GlobalState[P] })
  );

  // Track unsubscriptions for all keys
  const unwatchers: (() => void)[] = [];

  // Watch for changes in the reactive state and update the global Mug state
  keys.forEach((key) => {
    const unwatch = watch(
      () => state[key], // Watch the dynamic property
      (newValue) => {
        mug.setState(key, newValue); // Update Mug's global state when the reactive state changes
      }
    );

    // Store the unwatch function for later cleanup
    unwatchers.push(unwatch);
  });

  // Clean up watchers on component unmount to prevent memory leaks
  onUnmounted(() => {
    unwatchers.forEach((unwatch) => unwatch()); // Unsubscribe all watchers
  });

  // Return the reactive values and setter functions for each key
  return {
    ...state,
    setValue: (key: K, newValue: GlobalState[K]) => {
      state[key] = newValue; // This will trigger the watcher and update Mug
    },
  };
}
```

### How It Works

1. **Global State**: The `Mug` singleton holds the global state. In this example, the state contains a `theme` property initialized to `'dark'` and a `user` object with a default value of `{ name: 'Guest', loggedIn: false }`.
2. **Dynamic Getter/Setter**: The `useMugStore` function dynamically accesses any property in the `GlobalState` interface. It returns both the reactive `state` object and a `setValue` function to update the state.
3. **Reactivity with Watch**: Vue’s `watch` function monitors changes in the reactive state. When the state is updated in the component, it automatically syncs with the global `Mug` state.
4. **Memory Management**: The `onUnmounted` hook ensures that all watchers are properly cleaned up when the component is unmounted, preventing memory leaks.

---

### Component Usage Example

Here’s an example of how to use `useMugStore` in a Vue component to manage multiple global state properties dynamically:

```html
<template>
  <div>
    <h1>Current Theme: {{ store.theme }}</h1>
    <h2>User: {{ store.user.name }} ({{ store.user.loggedIn ? 'Logged In' : 'Logged Out' }})</h2>
    <button @click="toggleTheme">Toggle Theme</button>
    <button @click="toggleLogin">Toggle Login</button>
  </div>
</template>

<script setup>
  import { useMugStore } from './mugStore';

  // Dynamically access the 'theme' and 'user' properties from the global state
  const store = useMugStore('theme', 'user');

  // Function to toggle the theme between 'dark' and 'light'
  const toggleTheme = () => {
    store.setValue('theme', store.theme === 'dark' ? 'light' : 'dark');
  };

  // Function to toggle the login status
  const toggleLogin = () => {
    store.setValue('user', { ...store.user, loggedIn: !store.user.loggedIn });
  };
</script>
```

### Explanation of the Template

1. **Dynamic State Access**: The `useMugStore('theme', 'user')` call dynamically gives you access to both the `theme` and `user` properties from the global `Mug` state.
2. **State Reactivity**: Vue automatically tracks changes to `store.theme` and `store.user`, so any updates to these properties will reflect in the UI.
3. **Toggle Functions**:
   - The `toggleTheme` function switches the `theme` between `'dark'` and `'light'`.
   - The `toggleLogin` function toggles the `loggedIn` status of the `user` between `true` and `false`.

---

### Benefits of Using Mug with Vue

- **Dynamic State Management**: You can easily add new properties to the global state by expanding the `GlobalState` interface and using `useMugStore` to access them dynamically.
- **Effortless Reactivity**: Vue’s `reactive` and `watch` functions ensure that changes to the state are automatically reflected in the UI, without the need for manual subscriptions or complex setup.
- **Scalable and Clean Code**: The API is simple and scalable. By using a global `Mug` singleton, you avoid the complexity of `provide`/`inject` or Vuex/Pinia, keeping the code clean and straightforward.
- **Memory Efficiency**: The `onUnmounted` hook ensures that all watchers are cleaned up when the component is destroyed, preventing memory leaks.

---

This pattern allows you to manage global state dynamically using Vue’s reactivity and `Mug`, making it easy to maintain and scale as your application grows. By leveraging a single global state object, you can efficiently manage multiple properties with minimal boilerplate.
