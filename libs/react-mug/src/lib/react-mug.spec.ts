import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Mug } from '@lipsquirrel/mug'; // Assume this is where Mug is located
import { useMug } from './react-mug'; // The hook you're testing

interface TestState {
  count: number;
  user: { name: string; loggedIn: boolean };
}

describe('useMug hook', () => {
  let mug: Mug<TestState>;

  beforeEach(() => {
    // Create a mock Mug instance with initial state
    mug = new Mug<TestState>({
      count: 0,
      user: { name: 'John', loggedIn: false },
    });
  });

  it('should initialize with the provided initial value when no state exists', () => {
    // Create Mug without setting an initial state for 'count'
    mug = new Mug<TestState>({ user: { name: 'John', loggedIn: false } });

    const { result } = renderHook(() => useMug(mug, 'count', 10));

    // Verify that the initial state is set to the initialValue (10)
    expect(result.current[0]).toBe(10);
  });

  it('should initialize with the Mug state when state exists', () => {
    // Set a value in the Mug instance before rendering the hook
    mug.setState('count', 20);

    const { result } = renderHook(() => useMug(mug, 'count', 10));

    // Verify that the state is set to Mug's state (20) rather than the initialValue
    expect(result.current[0]).toBe(20);
  });

  it('should update the global state and local state', () => {
    const { result } = renderHook(() => useMug(mug, 'count', 10));

    // Act to update the state
    act(() => {
      result.current[1](30); // Call the setter function to update state to 30
    });

    // Verify that both local and global state are updated
    expect(result.current[0]).toBe(30);
    expect(mug.getState('count')).toBe(30);
  });

  it('should notify listener when the Mug state changes externally', () => {
    const { result } = renderHook(() => useMug(mug, 'count', 10));

    // Simulate external change in Mug's state (outside of the hook)
    act(() => {
      mug.setState('count', 40);
    });

    // Verify that the hook updated its local state when the global state changed
    expect(result.current[0]).toBe(40);
  });

  it('should clean up the listener on unmount', () => {
    const subscribeSpy = vi.spyOn(mug, 'subscribe');
    const unsubscribeSpy = vi.fn();

    // Mock subscribe to return the unsubscribe function
    subscribeSpy.mockImplementation(() => unsubscribeSpy);

    const { unmount } = renderHook(() => useMug(mug, 'count', 10));

    // Ensure subscribe was called
    expect(subscribeSpy).toHaveBeenCalledWith('count', expect.any(Function));

    // Unmount the component and verify unsubscribe was called
    unmount();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
