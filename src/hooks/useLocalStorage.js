import React, { useState } from 'react';

// Simple hook to persist state to localStorage.
// Returns [value, setValue] where setValue works like useState but
// also writes the new value to window.localStorage (JSON serialized).
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // setValue supports either a value or an updater function (like useState)
  // and ensures the value is saved to localStorage as JSON.
  const setValue = (value) => {
    setStoredValue(prevValue => {
      try {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      } catch (error) {
        console.error(error);
        return prevValue;
      }
    });
  };


  return [storedValue, setValue];
}

export default useLocalStorage;