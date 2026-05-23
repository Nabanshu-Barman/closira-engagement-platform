import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/shared/ScreenHeader';
import { LeadCard } from '../../components/molecules/LeadCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { MOCK_ENQUIRIES } from '../../mock';
import type { Channel, EnquiryStatus } from '../../types';
import { COLORS } from '../../constants/colors';

type FilterType = 'all' | EnquiryStatus | Channel;

const STATUS_FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: '🔵 New' },
  { key: 'qualified', label: '🟢 Qualified' },
  { key: 'escalated', label: '🔴 Escalated' },
  { key: 'resolved', label: '⚫ Resolved' },
];

const CHANNEL_FILTERS: { key: FilterType; label: string }[] = [
  { key: 'whatsapp', label: '💬 WhatsApp' },
  { key: 'email', label: '✉️ Email' },
  { key: 'call', label: '📞 Call' },
];

export default function LeadsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredLeads = useMemo(() => {
    if (activeFilter === 'all') return MOCK_ENQUIRIES;
    const statuses: string[] = ['new', 'qualified', 'escalated', 'resolved'];
    const channels: string[] = ['whatsapp', 'email', 'call'];
    if (statuses.includes(activeFilter)) {
      return MOCK_ENQUIRIES.filter((e) => e.status === activeFilter);
    }
    if (channels.includes(activeFilter)) {
      return MOCK_ENQUIRIES.filter((e) => e.channel === activeFilter);
    }
    return MOCK_ENQUIRIES;
  }, [activeFilter]);

  const allFilters = [...STATUS_FILTERS, ...CHANNEL_FILTERS];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Leads"
        subtitle={`${filteredLeads.length} enquiries`}
      />

      {/* Filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
        style={styles.filterScroll}
      >
        {allFilters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}
            >
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Leads list */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <LeadCard enquiry={item} index={index} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No leads found"
            subtitle="No enquiries match the selected filter. Try a different category."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgDeep },
  filterScroll: { flexGrow: 0 },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.bgSurface,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterLabelActive: { color: COLORS.primary },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
