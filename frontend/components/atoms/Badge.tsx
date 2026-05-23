import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Channel } from '../../types';
import { COLORS } from '../../constants/colors';

interface BadgeProps {
  channel: Channel;
  size?: 'sm' | 'md';
}

const CHANNEL_CONFIG: Record<Channel, { label: string; color: string; bg: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', color: COLORS.whatsapp, bg: COLORS.whatsappBg, icon: '💬' },
  email: { label: 'Email', color: COLORS.email, bg: COLORS.emailBg, icon: '✉️' },
  call: { label: 'Call', color: COLORS.call, bg: COLORS.callBg, icon: '📞' },
};

export function Badge({ channel, size = 'md' }: BadgeProps) {
  const config = CHANNEL_CONFIG[channel];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.color },
        isSmall && styles.containerSm,
      ]}
    >
      <Text style={[styles.icon, isSmall && styles.iconSm]}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.color }, isSmall && styles.labelSm]}>
        {isSmall ? channel.charAt(0).toUpperCase() + channel.slice(1) : config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  icon: { fontSize: 11 },
  iconSm: { fontSize: 9 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelSm: { fontSize: 10 },
});
