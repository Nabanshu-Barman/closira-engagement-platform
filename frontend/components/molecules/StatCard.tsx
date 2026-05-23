import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { COLORS } from '../../constants/colors';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  accentColor: string;
  trend?: { direction: 'up' | 'down'; percent: number };
  index?: number;
}

export function StatCard({ label, value, icon, accentColor, trend, index = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const tick = () => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (current < value) {
        frameRef.current = setTimeout(tick, duration / steps);
      }
    };

    const timer = setTimeout(tick, index * 120);
    return () => {
      clearTimeout(timer);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [value, index]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16, scale: 0.96 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', delay: index * 100, damping: 18, stiffness: 200 }}
      style={[styles.card, { borderLeftColor: accentColor }]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        {trend && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: trend.direction === 'up' ? COLORS.successBg : COLORS.dangerBg }
          ]}>
            <Text style={[
              styles.trendText,
              { color: trend.direction === 'up' ? COLORS.success : COLORS.danger }
            ]}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.percent}%
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: accentColor }]}>{displayValue}</Text>
      <Text style={styles.label}>{label}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 6,
    minWidth: '45%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: { fontSize: 22 },
  value: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 36,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    lineHeight: 16,
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
