import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EnquiryStatus } from '../../types';
import { COLORS } from '../../constants/colors';

interface ChipProps {
  status: EnquiryStatus;
}

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: COLORS.statusNew, bg: COLORS.statusNewBg },
  qualified: { label: 'Qualified', color: COLORS.statusQualified, bg: COLORS.statusQualifiedBg },
  escalated: { label: 'Escalated', color: COLORS.statusEscalated, bg: COLORS.statusEscalatedBg },
  resolved: { label: 'Resolved', color: COLORS.statusResolved, bg: COLORS.statusResolvedBg },
};

export function Chip({ status }: ChipProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.color }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
