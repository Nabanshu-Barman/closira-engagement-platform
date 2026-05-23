import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import type { TimelineEvent, EventType } from '../../types';
import { COLORS } from '../../constants/colors';

interface TimelineEventProps {
  event: TimelineEvent;
  index?: number;
  isLast?: boolean;
}

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; label: string }> = {
  enquiry_created: { icon: '📥', color: COLORS.info, label: 'Received' },
  sop_matched: { icon: '📋', color: COLORS.primary, label: 'SOP Matched' },
  followup_scheduled: { icon: '🕐', color: COLORS.warning, label: 'Follow-up Scheduled' },
  escalated: { icon: '⚡', color: COLORS.danger, label: 'Escalated' },
  resolved: { icon: '✅', color: COLORS.success, label: 'Resolved' },
  message_sent: { icon: '💬', color: COLORS.statusQualified, label: 'Message Sent' },
  agent_replied: { icon: '👤', color: COLORS.call, label: 'Agent Replied' },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function TimelineEventItem({ event, index = 0, isLast = false }: TimelineEventProps) {
  const config = EVENT_CONFIG[event.type];

  return (
    <MotiView
      from={{ opacity: 0, translateX: -8 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 80, damping: 20, stiffness: 240 }}
      style={styles.row}
    >
      {/* Left column: dot + line */}
      <View style={styles.leftCol}>
        <View style={[styles.dot, { backgroundColor: config.color }]}>
          <Text style={styles.dotIcon}>{config.icon}</Text>
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: config.color }]} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
          <Text style={styles.time}>{formatTime(event.timestamp)}</Text>
        </View>
        <Text style={styles.description}>{event.description}</Text>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
  },
  leftCol: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIcon: { fontSize: 14 },
  line: {
    flex: 1,
    width: 1.5,
    marginTop: 4,
    opacity: 0.3,
    marginBottom: -4,
  },
  content: {
    flex: 1,
    paddingBottom: 14,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 12, fontWeight: '700' },
  time: { fontSize: 11, color: COLORS.textMuted },
  description: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});
