import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateState = useCallback((newState: T) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    // Limit history to 50 items to avoid memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
      setCurrentIndex(49);
    } else {
      setCurrentIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
    setState(newState);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { state, setState: updateState, undo, redo, canUndo, canRedo };
}
