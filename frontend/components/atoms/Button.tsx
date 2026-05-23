import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'success';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; border: string; text: string }> = {
  primary: { bg: COLORS.primary, border: COLORS.primary, text: '#FFFFFF' },
  ghost: { bg: 'transparent', border: COLORS.borderDefault, text: COLORS.textPrimary },
  danger: { bg: COLORS.dangerBg, border: COLORS.danger, text: COLORS.danger },
  success: { bg: COLORS.successBg, border: COLORS.success, text: COLORS.success },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const config = VARIANT_STYLES[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const padV = size === 'sm' ? 6 : size === 'lg' ? 14 : 10;
  const padH = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <AnimatedPressable
      style={[
        styles.base,
        animatedStyle,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: padV,
          paddingHorizontal: padH,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={config.text} />
      ) : (
        <>
          {icon && <Text style={[styles.icon, { fontSize }]}>{icon}</Text>}
          <Text style={[styles.label, { color: config.text, fontSize }]}>{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  icon: { fontWeight: '500' },
  label: { fontWeight: '600', letterSpacing: 0.1 },
});
