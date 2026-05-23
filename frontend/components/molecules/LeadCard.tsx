import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { Badge } from '../atoms/Badge';
import { Chip } from '../atoms/Chip';
import { Avatar } from '../atoms/Avatar';
import type { Enquiry } from '../../types';
import { COLORS } from '../../constants/colors';

interface LeadCardProps {
  enquiry: Enquiry;
  index?: number;
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LeadCard({ enquiry, index = 0 }: LeadCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  };

  const handlePress = () => {
    router.push(`/conversation/${enquiry.id}`);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -12 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 80, damping: 20, stiffness: 220 }}
    >
      <AnimatedPressable
        style={[styles.card, animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.row}>
          <Avatar name={enquiry.customer} size={42} />
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.customerName} numberOfLines={1}>
                {enquiry.customer}
              </Text>
              <Text style={styles.time}>{formatTimeAgo(enquiry.receivedAt)}</Text>
            </View>
            <Text style={styles.message} numberOfLines={2}>
              {enquiry.message}
            </Text>
            <View style={styles.badgeRow}>
              <Badge channel={enquiry.channel} size="sm" />
              <Chip status={enquiry.status} />
              {enquiry.sopMatch && (
                <View style={styles.sopBadge}>
                  <Text style={styles.sopText}>📋 {enquiry.sopMatch}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  content: { flex: 1, gap: 6 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  sopBadge: {
    backgroundColor: COLORS.primaryGlow,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
  },
  sopText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
