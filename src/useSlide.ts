import { useContext } from "react";
import { SlideContext } from 'spectacle';

export const useSlide = () => {
const slideContext = useContext(SlideContext);
  if (slideContext === null) {
    throw new Error(
      '`useSteps` must be called within a SlideContext.Provider. Did you' +
        ' call `useSteps` in a component that was not placed inside a <Slide>?'
    );
  }

  return slideContext;
}