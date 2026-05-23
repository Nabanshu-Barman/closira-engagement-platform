import React, { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../constants/colors';
import { useAppStore } from '../../store/useAppStore';

const TABS = [
  { name: 'index', icon: '⊞', label: 'Home' },
  { name: 'leads', icon: '👥', label: 'Leads' },
  { name: 'escalations', icon: '⚡', label: 'Escalations' },
  { name: 'followups', icon: '🕐', label: 'Follow-ups' },
];

const TAB_WIDTH_PCT = 100 / TABS.length;

// Individual tab item to comply with Rules of Hooks
function TabItem({
  tab,
  index,
  isFocused,
  onPress,
  badgeCount,
}: {
  tab: { name: string; icon: string; label: string };
  index: number;
  isFocused: boolean;
  onPress: () => void;
  badgeCount?: number;
}) {
  const scale = useSharedValue(isFocused ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.1 : 1, { damping: 15, stiffness: 280 });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <View style={styles.tabInner}>
        <Animated.Text
          style={[styles.icon, { opacity: isFocused ? 1 : 0.45 }, iconStyle]}
        >
          {tab.icon}
        </Animated.Text>
        <Text
          style={[
            styles.label,
            { color: isFocused ? COLORS.primary : COLORS.textMuted },
          ]}
        >
          {tab.label}
        </Text>
        {(badgeCount ?? 0) > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeEscalationCount = useAppStore((s) => s.activeEscalationCount);

  const indicatorLeft = useSharedValue(state.index * TAB_WIDTH_PCT);

  useEffect(() => {
    indicatorLeft.value = withSpring(state.index * TAB_WIDTH_PCT, {
      damping: 18,
      stiffness: 220,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorLeft.value}%`,
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 6 }]}>
      <Animated.View
        style={[styles.indicator, { width: `${TAB_WIDTH_PCT}%` }, indicatorStyle]}
      />
      {TABS.map((tab, i) => {
        const isFocused = state.index === i;
        const escalationCount = tab.name === 'escalations' ? activeEscalationCount() : 0;

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[i].key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[i].name);
          }
        };

        return (
          <TabItem
            key={tab.name}
            tab={tab}
            index={i}
            isFocused={isFocused}
            onPress={handlePress}
            badgeCount={escalationCount}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
    position: 'relative',
    paddingTop: 10,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: 3,
    position: 'relative',
  },
  icon: { fontSize: 20 },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
