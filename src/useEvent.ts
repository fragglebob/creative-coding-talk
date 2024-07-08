import { useCallback, useLayoutEffect, useRef } from "react";


export default function useEvent<Args extends unknown[], Return>(
    fn: (...args: Args) => Return,
  ): (...args: Args) => Return {
    const ref = useRef<(typeof fn)>(fn);
  
    useLayoutEffect(() => {
      ref.current = fn;
    });
  
    return useCallback(
      (...args: Args) => ref.current(...args),
      [],
    );
  }