import React, { useState } from 'react';

function reduce<S>(state: S, action: Partial<S>): S {
  if (action === null) {
    return state;
  } else {
    return { ...state, ...action };
  }
}

type IAction<S> = Partial<S> | ((prevState: S) => Partial<S>);

type Dispatch<S> = (action: IAction<S>) => void;

function useReducer<S extends object>(initialState: S | (() => S)): [state: S, setState: Dispatch<S>] {
  const [ state, setState ] = useState<S>(initialState);

  function dispatch(action: IAction<S>) {
    if (typeof action === 'function') {
      setState((prevState) => reduce(prevState, action(prevState)));
    } else {
      setState((prevState) => reduce(prevState, action));
    }
  }

  return [state, dispatch];
}

export default useReducer;
