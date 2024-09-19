import { useState, useEffect } from 'react';
import { Mug } from '@lipsquirrel/mug';

export function useMug<T extends object, K extends keyof T>(
  mug: Mug<T>,
  key: K,
  initialValue: T[K]
): [T[K], (value: T[K]) => void] {
  // Initialize the local state with the current state from Mug or the provided initial value
  const [state, setState] = useState<T[K]>(() => {
    const currentState = mug.getState(key);
    return currentState !== undefined ? currentState : initialValue;
  });

  // Subscribe to changes in the global state for the given key
  useEffect(() => {
    const unsubscribe = mug.subscribe(key, setState);

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [key, mug]);

  // Update the global state and the local state when the value changes
  const updateGlobalState = (value: T[K]) => {
    mug.setState(key, value);
  };

  return [state, updateGlobalState];
}

export default useMug;
