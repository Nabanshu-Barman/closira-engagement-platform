import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Animates a number from 0 to `targetValue` over `duration` ms.
 * Returns an animated props object suitable for an AnimatedText component.
 */
export function useAnimatedCounter(targetValue: number, duration = 1200) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(targetValue, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetValue]);

  const animatedProps = useAnimatedProps(() => ({
    text: String(Math.round(animatedValue.value)),
  }));

  return { animatedValue, animatedProps };
}
