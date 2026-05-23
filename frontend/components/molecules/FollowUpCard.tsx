import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MotiView } from 'moti';
import { Badge } from '../atoms/Badge';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import type { FollowUp } from '../../types';
import { COLORS } from '../../constants/colors';
import { useAppStore } from '../../store/useAppStore';

interface FollowUpCardProps {
  followUp: FollowUp;
  index?: number;
}

function getDueStatus(dueAt: string): { label: string; color: string; bg: string } {
  const diff = new Date(dueAt).getTime() - Date.now();
  const mins = diff / 60000;
  if (mins < 0) return { label: 'Overdue', color: COLORS.danger, bg: COLORS.dangerBg };
  if (mins < 60) return { label: 'Due soon', color: COLORS.warning, bg: COLORS.warningBg };
  const hrs = Math.floor(mins / 60);
  return { label: `Due in ${hrs}h`, color: COLORS.success, bg: COLORS.successBg };
}

function formatDueTime(dueAt: string): string {
  return new Date(dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function FollowUpCard({ followUp, index = 0 }: FollowUpCardProps) {
  const completeFollowUp = useAppStore((s) => s.completeFollowUp);
  const completedIds = useAppStore((s) => s.completedFollowUpIds);
  const isDone = followUp.done || completedIds.includes(followUp.id);

  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const greenOpacity = useSharedValue(0);

  const dueStatus = getDueStatus(followUp.dueAt);

  function markDone() {
    completeFollowUp(followUp.id);
  }

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([20, Infinity])
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
      greenOpacity.value = Math.min(translateX.value / 80, 1);
    })
    .onEnd((e) => {
      if (e.translationX > 80) {
        translateX.value = withTiming(400, { duration: 300 });
        cardOpacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(markDone)();
        });
      } else {
        translateX.value = withTiming(0);
        greenOpacity.value = withTiming(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: cardOpacity.value,
  }));

  const greenStyle = useAnimatedStyle(() => ({
    opacity: greenOpacity.value,
  }));

  if (isDone) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 80, damping: 18, stiffness: 200 }}
      style={styles.wrapper}
    >
      {/* Green background on swipe */}
      <Animated.View style={[styles.greenBg, greenStyle]}>
        <Text style={styles.checkmark}>✓ Done</Text>
      </Animated.View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.topRow}>
            <View style={[styles.dueBadge, { backgroundColor: dueStatus.bg }]}>
              <Text style={[styles.dueLabel, { color: dueStatus.color }]}>
                {dueStatus.label}
              </Text>
            </View>
            <Text style={styles.dueTime}>{formatDueTime(followUp.dueAt)}</Text>
          </View>

          <View style={styles.customerRow}>
            <Avatar name={followUp.customer} size={36} />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{followUp.customer}</Text>
              <Badge channel={followUp.channel} size="sm" />
            </View>
          </View>

          <Text style={styles.preview} numberOfLines={2}>
            {followUp.messagePreview}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.swipeHint}>← Swipe to complete</Text>
            <Button label="Mark Done" onPress={markDone} variant="success" size="sm" icon="✓" />
          </View>
        </Animated.View>
      </GestureDetector>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 14,
  },
  greenBg: {
    position: 'absolute',
    inset: 0,
    backgroundColor: COLORS.successBg,
    borderRadius: 14,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  dueLabel: { fontSize: 11, fontWeight: '700' },
  dueTime: { fontSize: 12, color: COLORS.textMuted },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerInfo: { gap: 4 },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  preview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swipeHint: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
