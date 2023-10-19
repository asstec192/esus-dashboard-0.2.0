import { useState } from "react";

export const useToogle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const open = () => setState(true);
  const close = () => setState(false);
  const toogle = ()=> setState((prev) => !prev);
  return { close, open, toogle, state };
};
