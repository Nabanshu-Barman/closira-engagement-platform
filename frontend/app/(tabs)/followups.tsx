import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/shared/ScreenHeader';
import { FollowUpCard } from '../../components/molecules/FollowUpCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { MOCK_FOLLOWUPS } from '../../mock';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../constants/colors';

export default function FollowUpsScreen() {
  const insets = useSafeAreaInsets();
  const completedIds = useAppStore((s) => s.completedFollowUpIds);

  const allFollowUps = MOCK_FOLLOWUPS;
  const pending = useMemo(
    () => allFollowUps.filter((f) => !f.done && !completedIds.includes(f.id)),
    [completedIds]
  );
  const total = allFollowUps.length;
  const done = total - pending.length;
  const progressPercent = total > 0 ? (done / total) * 100 : 0;

  const progressAnim = useSharedValue(0);
  React.useEffect(() => {
    progressAnim.value = withTiming(progressPercent, { duration: 700 });
  }, [progressPercent]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Follow-ups"
        subtitle={`${pending.length} pending today`}
      />

      {/* Progress bar */}
      <MotiView
        from={{ opacity: 0, translateY: -6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        style={styles.progressSection}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {done} of {total} completed
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </MotiView>

      <FlatList
        data={pending}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <FollowUpCard followUp={item} index={index} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🎉"
            title="All caught up!"
            subtitle="You've completed all follow-ups. Great work keeping on top of your customers."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgDeep },
  progressSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  progressPercent: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.bgRaised,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
