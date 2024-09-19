import { describe, it, expect, vi } from 'vitest';
import { Mug } from './Mug';

interface TestState {
  count: number;
  user: { name: string; loggedIn: boolean };
}

describe('Mug state management', () => {
  it('should initialize state with default values', () => {
    const mug = new Mug<TestState>({
      count: 0,
      user: { name: 'John', loggedIn: false },
    });

    expect(mug.getState('count')).toBe(0);
    expect(mug.getState('user')).toEqual({ name: 'John', loggedIn: false });
  });

  it('should return undefined for unset state properties', () => {
    const mug = new Mug<TestState>();

    expect(mug.getState('count')).toBeUndefined();
    expect(mug.getState('user')).toBeUndefined();
  });

  it('should allow updating the state and retrieve the new value', () => {
    const mug = new Mug<TestState>();

    // Set new state
    mug.setState('count', 5);
    mug.setState('user', { name: 'Alice', loggedIn: true });

    // Verify the state was updated
    expect(mug.getState('count')).toBe(5);
    expect(mug.getState('user')).toEqual({ name: 'Alice', loggedIn: true });
  });

  it('should notify listeners when the state changes', () => {
    const mug = new Mug<TestState>();
    const listener = vi.fn(); // Vitest mock function

    // Subscribe to state changes for the 'count' key
    mug.subscribe('count', listener);

    // Update the 'count' state
    mug.setState('count', 10);

    // Verify the listener was called with the new state value
    expect(listener).toHaveBeenCalledWith(10);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should notify all subscribed listeners when the state changes', () => {
    const mug = new Mug<TestState>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    // Subscribe multiple listeners to the same key
    mug.subscribe('count', listener1);
    mug.subscribe('count', listener2);

    // Update the 'count' state
    mug.setState('count', 20);

    // Verify both listeners were called with the new state value
    expect(listener1).toHaveBeenCalledWith(20);
    expect(listener2).toHaveBeenCalledWith(20);
  });

  it('should allow unsubscribing from state changes', () => {
    const mug = new Mug<TestState>();
    const listener = vi.fn();

    // Subscribe to state changes and get the unsubscribe function
    const unsubscribe = mug.subscribe('count', listener);

    // Unsubscribe the listener
    unsubscribe();

    // Update the 'count' state
    mug.setState('count', 30);

    // Verify the listener was not called after unsubscribing
    expect(listener).not.toHaveBeenCalled();
  });
});
