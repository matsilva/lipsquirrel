### Imagine a World: One Global State API for Everything

In this world, whether you’re building a complex app in **React**, a highly dynamic UI in **Vue**, or a lightweight **vanilla JS** app, you can rely on a **single global state management system** to keep your app in sync.

- **React developers** don’t need `Context` or `Providers`.
- **Vue developers** can say goodbye to `provide/inject` or Pinia.
- **Vanilla JS developers** can forget about rolling their own state management.

All you need is **Mug** to handle the global state for all three. Let’s see what this looks like in each scenario.

---

## 1. **React Example: Managing Global State with Mug**

In React, we use the **`useMug`** hook to dynamically access and update global state, all powered by the same global `Mug` instance.

### React Component Example

```tsx
import React from 'react';
import { useMug } from './mugStore'; // Import your Mug-based hook for React

const ThemeComponent: React.FC = () => {
  const [theme, setTheme] = useMug('theme', 'light'); // Access global theme state

  return (
    <div>
      <h1>Current Theme: {theme}</h1>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
    </div>
  );
};

export default ThemeComponent;
```

### How It Works:

- `useMug('theme', 'light')` dynamically accesses the `theme` state from the global `Mug` instance.
- The component can both read the current `theme` and update it with `setTheme`.

Dive a bit deeper into the implementation details in the [React example](./docs/mug-with-react.md).

---

## 2. **Vue Example: Managing Global State with Mug**

In Vue, we use **`useMugStore`** to dynamically access multiple global state properties, again using the same `Mug` instance.

### Vue Component Example

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
  import { useMugStore } from './mugStore'; // Import your Mug-based store for Vue

  // Dynamically access the 'theme' and 'user' properties from the global state
  const store = useMugStore('theme', 'user');

  const toggleTheme = () => {
    store.setValue('theme', store.theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLogin = () => {
    store.setValue('user', { ...store.user, loggedIn: !store.user.loggedIn });
  };
</script>
```

### How It Works:

- `useMugStore('theme', 'user')` dynamically accesses both the `theme` and `user` state from the global `Mug` instance.
- The UI automatically updates when the global state changes, thanks to Vue’s reactivity system.

Dive a bit deeper into the implementation details in the [Vue example](./docs/mug-with-vue.md).

---

## 3. **Vanilla JavaScript Example: Managing Global State with Mug**

For **vanilla JavaScript**, we directly use the **`Mug` API** to get and set the state.

### Vanilla JS Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mug with Vanilla JS</title>
  </head>
  <body>
    <h1 id="theme">Current Theme: dark</h1>
    <button id="toggleTheme">Toggle Theme</button>

    <script type="module">
      import { Mug } from './Mug.js'; // Import Mug class

      // Create a Mug instance for managing global state
      const mug = new Mug({ theme: 'dark' });

      const themeElement = document.getElementById('theme');
      const toggleButton = document.getElementById('toggleTheme');

      // Function to update UI when theme changes
      const updateTheme = () => {
        const theme = mug.getState('theme');
        themeElement.textContent = `Current Theme: ${theme}`;
      };

      // Set up event listener to toggle the theme
      toggleButton.addEventListener('click', () => {
        const currentTheme = mug.getState('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        mug.setState('theme', newTheme);
        updateTheme(); // Update UI after state change
      });

      // Initialize UI with the current theme
      updateTheme();
    </script>
  </body>
</html>
```

### How It Works:

- `mug.getState('theme')` retrieves the current `theme` state, and `mug.setState('theme', newTheme)` updates it.
- The vanilla JS application directly interacts with the `Mug` instance to update both the state and the DOM.

---

### The Power of a Single Global State API

With **Mug**, you get:

1. **Unified State Management**: The same global state API (`Mug`) can be used across React, Vue, and Vanilla JavaScript, making it easier to manage state across different frameworks.
2. **Minimal Boilerplate**: No need for complex context providers or state management libraries. All frameworks use the same global singleton for accessing and updating state.
3. **Cross-Framework Compatibility**: Because Mug is framework-agnostic, you can share state between different parts of an application, even if they are built with different frameworks (e.g., React components sharing state with Vue components).

---

### Conclusion

With **Mug**, you're no longer tied to a specific framework for state management. Whether you're using **React**, **Vue**, or **Vanilla JS**, you can manage your global state seamlessly with a single API, ensuring simplicity, flexibility, and reactivity across all parts of your application.

Imagine building a hybrid app that mixes Vue components with React and plain JavaScript, all seamlessly sharing the same global state—Mug makes that possible!
