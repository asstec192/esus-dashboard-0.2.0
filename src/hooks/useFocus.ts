import { useRef, useEffect } from "react";

export function useFocus() {
  const targetRef = useRef<HTMLInputElement>(null);

  const setFocus = () => {
    if (targetRef.current) {
      targetRef.current.focus();
    }
  };

  useEffect(() => {
    // Chama a função para focar quando o componente for montado
    setFocus();
  }, []);

  return { setFocus, targetRef };
}
