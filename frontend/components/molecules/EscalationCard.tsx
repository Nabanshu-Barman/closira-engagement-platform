import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import type { EscalationAlert } from '../../types';
import { COLORS } from '../../constants/colors';
import { useAppStore } from '../../store/useAppStore';

interface EscalationCardProps {
  escalation: EscalationAlert;
  index?: number;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function EscalationCard({ escalation, index = 0 }: EscalationCardProps) {
  const resolveEscalation = useAppStore((s) => s.resolveEscalation);
  const resolvedIds = useAppStore((s) => s.resolvedEscalationIds);
  const isResolved = resolvedIds.includes(escalation.id);

  const glowOpacity = useSharedValue(0.3);
  const glowScale = useSharedValue(1);

  const isHigh = escalation.urgency === 'high';
  const glowColor = isHigh ? COLORS.danger : COLORS.warning;

  useEffect(() => {
    const speed = isHigh ? 900 : 1600;
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: speed, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: speed, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: speed }),
        withTiming(1, { duration: speed })
      ),
      -1,
      false
    );
  }, [isHigh]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  if (isResolved) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 100, damping: 18, stiffness: 200 }}
      style={styles.wrapper}
    >
      {/* Glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          { borderColor: glowColor },
          glowStyle,
        ]}
      />

      <View style={[styles.card, { borderColor: isHigh ? COLORS.danger : COLORS.warning }]}>
        {/* Urgency label */}
        <View style={styles.urgencyRow}>
          <View style={[
            styles.urgencyBadge,
            { backgroundColor: isHigh ? COLORS.dangerBg : COLORS.warningBg }
          ]}>
            <Text style={[styles.urgencyDot, { color: glowColor }]}>●</Text>
            <Text style={[styles.urgencyText, { color: glowColor }]}>
              {escalation.urgency.toUpperCase()} URGENCY
            </Text>
          </View>
          <Text style={styles.time}>{formatTime(escalation.createdAt)}</Text>
        </View>

        <View style={styles.customerRow}>
          <Avatar name={escalation.customer} size={38} />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{escalation.customer}</Text>
            <Badge channel={escalation.channel} size="sm" />
          </View>
        </View>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>REASON</Text>
          <Text style={styles.reasonText}>{escalation.reason}</Text>
        </View>

        <Button
          label="Resolve"
          onPress={() => resolveEscalation(escalation.id)}
          variant="danger"
          icon="✓"
          fullWidth
        />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    inset: -4,
    borderRadius: 18,
    borderWidth: 1.5,
    zIndex: -1,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  urgencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  urgencyDot: { fontSize: 8 },
  urgencyText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  time: { fontSize: 11, color: COLORS.textMuted },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerInfo: { gap: 4 },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  reasonBox: {
    backgroundColor: COLORS.bgRaised,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  reasonLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
