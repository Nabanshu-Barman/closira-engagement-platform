import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatCard } from '../../components/molecules/StatCard';
import { ActivityItem } from '../../components/molecules/ActivityItem';
import { MOCK_ENQUIRIES } from '../../mock';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../constants/colors';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeEscalationCount = useAppStore((s) => s.activeEscalationCount);
  const pendingFollowUpCount = useAppStore((s) => s.pendingFollowUpCount);

  const today = MOCK_ENQUIRIES.filter((e) => {
    const diff = Date.now() - new Date(e.receivedAt).getTime();
    return diff < 86400000;
  });
  const totalLeads = today.length;
  const missed = today.filter((e) => e.status === 'escalated' && !e.sopMatch).length;
  const escalations = activeEscalationCount();
  const followUps = pendingFollowUpCount();

  const recentActivity = [...MOCK_ENQUIRIES]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  const QUICK_ACTIONS = [
    { label: '⚡ Escalations', route: '/(tabs)/escalations', color: COLORS.danger },
    { label: '👥 All Leads', route: '/(tabs)/leads', color: COLORS.primary },
    { label: '🕐 Follow-ups', route: '/(tabs)/followups', color: COLORS.warning },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.businessName}>Closira Dashboard</Text>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>AI</Text>
        </View>
      </MotiView>

      {/* Stats Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
      </View>
      <View style={styles.statsGrid}>
        <StatCard
          label="Total Leads Today"
          value={totalLeads}
          icon="📥"
          accentColor={COLORS.info}
          trend={{ direction: 'up', percent: 14 }}
          index={0}
        />
        <StatCard
          label="Missed Enquiries"
          value={missed}
          icon="❌"
          accentColor={COLORS.danger}
          index={1}
        />
        <StatCard
          label="Open Escalations"
          value={escalations}
          icon="⚡"
          accentColor={COLORS.warning}
          trend={{ direction: 'down', percent: 5 }}
          index={2}
        />
        <StatCard
          label="Follow-ups Due"
          value={followUps}
          icon="🕐"
          accentColor={COLORS.primary}
          index={3}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 400, damping: 18, stiffness: 200 }}
        style={styles.quickActions}
      >
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            style={[styles.quickActionBtn, { borderColor: action.color }]}
            onPress={() => router.push(action.route as any)}
          >
            <Text style={[styles.quickActionText, { color: action.color }]}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </MotiView>

      {/* Activity Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Pressable onPress={() => router.push('/(tabs)/leads')}>
          <Text style={styles.viewAll}>View all →</Text>
        </Pressable>
      </View>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', delay: 300, duration: 400 }}
        style={styles.activityCard}
      >
        {recentActivity.map((enquiry) => (
          <ActivityItem key={enquiry.id} enquiry={enquiry} />
        ))}
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bgDeep },
  content: { paddingHorizontal: 20, gap: 6 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  businessName: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  dateLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  viewAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: COLORS.bgSurface,
  },
  quickActionText: { fontSize: 13, fontWeight: '600' },
  activityCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
});
