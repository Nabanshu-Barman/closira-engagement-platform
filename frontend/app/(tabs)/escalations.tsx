import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/shared/ScreenHeader';
import { EscalationCard } from '../../components/molecules/EscalationCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { MOCK_ESCALATIONS } from '../../mock';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../constants/colors';

export default function EscalationsScreen() {
  const insets = useSafeAreaInsets();
  const resolvedIds = useAppStore((s) => s.resolvedEscalationIds);

  const activeEscalations = useMemo(
    () => MOCK_ESCALATIONS.filter((e) => !e.resolved && !resolvedIds.includes(e.id)),
    [resolvedIds]
  );

  const highUrgencyCount = activeEscalations.filter((e) => e.urgency === 'high').length;

  const sortedEscalations = useMemo(
    () => [...activeEscalations].sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }),
    [activeEscalations]
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Escalations"
        subtitle={`${activeEscalations.length} active`}
      />

      {/* Alert banner */}
      {highUrgencyCount > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          style={styles.alertBanner}
        >
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>
            {highUrgencyCount} high-urgency {highUrgencyCount === 1 ? 'case needs' : 'cases need'} immediate attention
          </Text>
        </MotiView>
      )}

      <FlatList
        data={sortedEscalations}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <EscalationCard escalation={item} index={index} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="✅"
            title="All clear!"
            subtitle="No active escalations right now. Your AI is handling everything smoothly."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgDeep },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    marginBottom: 4,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  alertIcon: { fontSize: 16 },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger,
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
