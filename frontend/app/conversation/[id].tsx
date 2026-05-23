import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/atoms/Badge';
import { Chip } from '../../components/atoms/Chip';
import { Avatar } from '../../components/atoms/Avatar';
import { TimelineEventItem } from '../../components/molecules/TimelineEvent';
import {
  getEnquiryById,
  getEventsForEnquiry,
  getMessagesForEnquiry,
} from '../../mock';
import type { Message } from '../../types';
import { COLORS } from '../../constants/colors';

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isCustomer = message.sender === 'customer';
  const isAI = message.sender === 'ai';

  const bubbleColor = isCustomer
    ? COLORS.bgRaised
    : isAI
    ? COLORS.primaryGlow
    : COLORS.successBg;

  const borderColor = isCustomer
    ? COLORS.borderDefault
    : isAI
    ? COLORS.primary
    : COLORS.success;

  const senderLabel = isCustomer ? null : isAI ? '🤖 AI' : '👤 Agent';
  const senderColor = isAI ? COLORS.primary : COLORS.success;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 60, damping: 20, stiffness: 220 }}
      style={[
        styles.bubbleWrapper,
        isCustomer ? styles.bubbleLeft : styles.bubbleRight,
      ]}
    >
      {isCustomer && <Avatar name={message.sender === 'customer' ? 'C' : 'A'} size={28} />}
      <View
        style={[
          styles.bubble,
          { backgroundColor: bubbleColor, borderColor },
          isCustomer ? styles.bubbleTailLeft : styles.bubbleTailRight,
        ]}
      >
        {senderLabel && (
          <Text style={[styles.senderLabel, { color: senderColor }]}>{senderLabel}</Text>
        )}
        <Text style={styles.bubbleText}>{message.text}</Text>
        <Text style={styles.bubbleTime}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </MotiView>
  );
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const enquiry = getEnquiryById(id);
  const events = getEventsForEnquiry(id);
  const messages = getMessagesForEnquiry(id);

  useLayoutEffect(() => {
    if (enquiry) {
      navigation.setOptions({ title: enquiry.customer });
    }
  }, [enquiry]);

  if (!enquiry) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>Enquiry not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Customer info bar */}
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        style={styles.infoBar}
      >
        <Avatar name={enquiry.customer} size={48} />
        <View style={styles.infoText}>
          <Text style={styles.customerName}>{enquiry.customer}</Text>
          <View style={styles.badgeRow}>
            <Badge channel={enquiry.channel} size="sm" />
            <Chip status={enquiry.status} />
          </View>
        </View>
      </MotiView>

      {/* SOP Match */}
      {enquiry.sopMatch && (
        <MotiView
          from={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 80, damping: 18, stiffness: 200 }}
          style={styles.sopCard}
        >
          <Text style={styles.sopLabel}>📋 SOP MATCHED</Text>
          <Text style={styles.sopName}>{enquiry.sopMatch}</Text>
          {enquiry.suggestedResponse && (
            <>
              <Text style={styles.responseLabel}>Suggested Response</Text>
              <Text style={styles.responseText}>{enquiry.suggestedResponse}</Text>
            </>
          )}
        </MotiView>
      )}

      {/* AI Summary */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 120, damping: 18, stiffness: 200 }}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryLabel}>🤖 AI SUMMARY</Text>
        <Text style={styles.summaryText}>{enquiry.summary}</Text>
      </MotiView>

      {/* Status Timeline */}
      {events.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            {events.map((event, index) => (
              <TimelineEventItem
                key={event.id}
                event={event}
                index={index}
                isLast={index === events.length - 1}
              />
            ))}
          </View>
        </View>
      )}

      {/* Message Thread */}
      {messages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation</Text>
          <View style={styles.thread}>
            {messages.map((msg, index) => (
              <MessageBubble key={msg.id} message={msg} index={index} />
            ))}
          </View>
        </View>
      )}

      {/* Status footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>
          Received:{' '}
          {new Date(enquiry.receivedAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgDeep },
  content: { padding: 16, gap: 12 },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: { color: COLORS.textSecondary, fontSize: 16 },

  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  infoText: { gap: 6 },
  customerName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },

  sopCard: {
    backgroundColor: COLORS.primaryGlow,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  sopLabel: { fontSize: 9, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.8 },
  sopName: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  responseLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  responseText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },

  summaryCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 6,
  },
  summaryLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8 },
  summaryText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  section: { gap: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timelineCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  thread: { gap: 10 },

  bubbleWrapper: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '90%',
  },
  bubbleLeft: { alignSelf: 'flex-start' },
  bubbleRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubble: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    gap: 4,
  },
  bubbleTailLeft: { borderTopLeftRadius: 4 },
  bubbleTailRight: { borderTopRightRadius: 4 },
  senderLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  bubbleText: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 19 },
  bubbleTime: { fontSize: 10, color: COLORS.textMuted, alignSelf: 'flex-end' },

  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerLabel: { fontSize: 11, color: COLORS.textMuted },
});
