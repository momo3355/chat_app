import { useState, useEffect, useRef, useCallback } from 'react';
import { PanResponder } from 'react-native';

const SLIDER_MAX = 80;
const THUMB_SIZE = 22;

export const useDistanceSlider = (
  filterDistance: number | null,
  onConfirm: (val: number) => void,
) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderWidthRef = useRef(0);
  const [sliderTempValue, setSliderTempValue] = useState(filterDistance ?? 10);

  useEffect(() => {
    setSliderTempValue(filterDistance ?? 10);
  }, [filterDistance]);

  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  const distanceSliderPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const val = Math.max(1, Math.min(SLIDER_MAX,
          Math.round(1 + (evt.nativeEvent.locationX / sliderWidthRef.current) * (SLIDER_MAX - 1))));
        setSliderTempValue(val);
      },
      onPanResponderMove: evt => {
        const val = Math.max(1, Math.min(SLIDER_MAX,
          Math.round(1 + (evt.nativeEvent.locationX / sliderWidthRef.current) * (SLIDER_MAX - 1))));
        setSliderTempValue(val);
      },
      onPanResponderRelease: evt => {
        const val = Math.max(1, Math.min(SLIDER_MAX,
          Math.round(1 + (evt.nativeEvent.locationX / sliderWidthRef.current) * (SLIDER_MAX - 1))));
        setSliderTempValue(val);
      },
    })
  ).current;

  const onLayout = useCallback((width: number) => {
    const w = Math.round(width);
    sliderWidthRef.current = w;
    setSliderWidth(prev => Math.abs(prev - w) > 1 ? w : prev);
  }, []);

  const confirmDistance = useCallback(() => {
    onConfirmRef.current(sliderTempValue);
  }, [sliderTempValue]);

  const thumbLeft = sliderWidth > 0
    ? Math.max(0, Math.min(sliderWidth - THUMB_SIZE,
        ((sliderTempValue - 1) / (SLIDER_MAX - 1)) * (sliderWidth - THUMB_SIZE)))
    : 0;
  const fillWidth = thumbLeft + THUMB_SIZE / 2;

  return { sliderTempValue, distanceSliderPR, thumbLeft, fillWidth, onLayout, confirmDistance };
};
