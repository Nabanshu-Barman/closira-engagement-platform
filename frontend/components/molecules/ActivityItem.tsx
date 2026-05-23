import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import type { Enquiry } from '../../types';
import { COLORS } from '../../constants/colors';

interface ActivityItemProps {
  enquiry: Enquiry;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ACTION_MAP: Record<string, string> = {
  new: 'sent a new enquiry',
  qualified: 'was qualified',
  escalated: 'was escalated',
  resolved: 'case was resolved',
};

export function ActivityItem({ enquiry }: ActivityItemProps) {
  return (
    <View style={styles.row}>
      <Avatar name={enquiry.customer} size={36} />
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.name}>{enquiry.customer}</Text>
          <Text style={styles.action}>{' '}{ACTION_MAP[enquiry.status] ?? 'sent a message'}</Text>
        </Text>
        <Text style={styles.preview} numberOfLines={1}>{enquiry.message}</Text>
      </View>
      <View style={styles.right}>
        <Badge channel={enquiry.channel} size="sm" />
        <Text style={styles.time}>{formatTimeAgo(enquiry.receivedAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  content: { flex: 1, gap: 3 },
  text: { fontSize: 13, lineHeight: 18 },
  name: { color: COLORS.textPrimary, fontWeight: '600' },
  action: { color: COLORS.textSecondary },
  preview: { fontSize: 12, color: COLORS.textMuted },
  right: { alignItems: 'flex-end', gap: 4 },
  time: { fontSize: 10, color: COLORS.textMuted },
});
