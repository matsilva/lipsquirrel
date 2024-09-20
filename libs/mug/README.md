## Imagine a World: One Global State API to Rule Them All

Welcome to the **Mug-iverse**, where state management becomes so simple, it’s borderline offensive. Forget the days of complex **React Context** hierarchies, countless **Vue Pinia** stores, or reinventing state management in **Vanilla JS** like you’re still stuck in 2005 _where undefined is not an object_.

Picture a world where **one state manager** can unite them all: **React**, **Vue**, and even plain old **Vanilla JavaScript**. This isn’t some dystopian nightmare where Pinia and Redux have been outlawed. No, no, no—**Mug** is here to remind you that sometimes, you really don’t need all that _"overhead."_

- **React developers**: Who needs Context or Providers when you’ve got Mug?
- **Vue developers**: Why inject anything at all? Mug’s already injected… everywhere.
- **Vanilla JS developers**: You didn’t really enjoy hand-crafting your own state solution anyway, right?

Let’s explore how **Mug** solves all your problems (well, state management problems, at least). Is it overkill? No. Is it underkill? Almost definitely.

---

## 1. **React Example: Managing Global State with Mug**

Forget `Context`. Forget `Providers`. All you need is Mug. Yes, Mug! The solution so simple, it might just make you question every state management decision you’ve ever made.

### React Component Example

```tsx
import React from 'react';
import { useMug } from './mugStore'; // Yes, Mug for React. Revolutionary.

const ThemeComponent: React.FC = () => {
  const [theme, setTheme] = useMug('theme', 'light'); // Dynamic global theme state

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

- `useMug('theme', 'light')` dynamically accesses the `theme` state, pulling it from the **Mug** singleton.
- **No Context. No Provider.** Just Mug. Your React app has never been so… well, simple.

Forget the **Context API**. You don’t need it here. Mug’s already taking care of everything. Does this mean you’ll abandon Context for life? Maybe not. But let’s just pretend for a moment that you could.

[See actual react example](./docs/mug-with-react.md)

---

## 2. **Vue Example: Managing Global State with Mug**

Now, I know what you’re thinking: “I’m a Vue developer. I like my `provide/inject` pattern. I like Pinia.” Well, dear developer, let me introduce you to **Mug**, which, with one sweep of its singleton magic, makes you question why you ever needed Pinia in the first place.

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
  import { useMugStore } from './mugStore'; // Mug for Vue. Who would’ve thought?

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

- **No Pinia?** You’re already doubting everything you know.
- **useMugStore** lets you access **multiple properties** in one fell swoop, without having to worry about inject or provide.

Do you _need_ Mug? Probably not. But could Mug make your life easier? Yes, because it’s just that simple. If you want to bypass all that ceremony for **simple global state** updates, Mug’s got you covered.

[See actual vue example](./docs/mug-with-vue.md)

---

## 3. **Vanilla JavaScript Example: Managing Global State with Mug**

For the brave souls still out there doing things with plain old **vanilla JavaScript**, I know you enjoy rolling your own state management. But hey, let’s shake things up a bit. With **Mug**, even Vanilla JS apps can enjoy the luxury of a **global state API** without all the hassle of writing your own from scratch.

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
      import { Mug } from './Mug.js'; // Importing Mug. Yes, even in Vanilla JS.

      // Create a Mug instance for managing global state
      const mug = new Mug({ theme: 'dark' });

      const themeElement = document.getElementById('theme');
      const toggleButton = document.getElementById('toggleTheme');

      // Subscribe to update UI when theme changes
      mug.subscribe('theme', (theme) => {
        themeElement.textContent = `Current Theme: ${theme}`;
      };

      // Set up event listener to toggle the theme
      toggleButton.addEventListener('click', () => {
        const currentTheme = mug.getState('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        mug.setState('theme', newTheme);
      });

      // Initialize UI with the current theme
      updateTheme();
    </script>
  </body>
</html>
```

### How It Works:

- **No frameworks, no problem.** Mug’s global state powers the mighty Vanilla JS app without needing any hand-rolled complexity.
- `mug.getState('theme')` retrieves the state, and `mug.setState('theme', newTheme)` updates it.

Sure, it’s **vanilla** JavaScript, but with **Mug**, it feels like a warm cup of cocoa on a cold winter day.

---

### The Power of a Single Global State API

Let’s pause for a moment to appreciate the **sheer brilliance** of what’s happening here. **Mug** isn’t here to make you throw out your tried-and-true state management tools like Redux, Pinia, or whatever homegrown magic you’ve conjured up. **Mug** exists to prove that **sometimes simple is better**.

1. **Unified State Management**: Mug can handle global state across React, Vue, and Vanilla JS. One API, no unnecessary complexity.
2. **Minimal Boilerplate**: No need for wrapping components with Context providers, setting up Pinia stores, or maintaining complicated state trees.
3. **Cross-Framework Harmony**: In this dreamland, Vue and React can share the same state. I mean, it’s practically a miracle.

---

### My closing thoughts.. for now

Look, **Mug** isn’t here to topple the state management giants, but it is here to remind you that **you don’t need to reach for the heavy tools** just to solve simple problems. Whether you’re using **React**, **Vue**, or **Vanilla JS**, Mug keeps your global state simple, clean, and framework-agnostic.

So go ahead and use Mug. Don’t worry—we won’t tell Redux or Pinia. But who knows? Maybe after using Mug, you’ll never want to go back.

After all, do you _really_ need all that extra complexity for something as simple as state? **Mug** doesn’t think so.

**<UnexpectedPlotTwist>** Chances are you probably dont even need to install Mug, peep the source code and me amazed at how small and mighty it is, then just copy/paste into your source code. **</UnexpectedPlotTwist>**

I also want to thank the folks at openai, I personally hate writing articles, but with chatjeepeetea, I'm lovin it like a quarter pounder with cheese, medium fries and a slurp of cokie coke.
