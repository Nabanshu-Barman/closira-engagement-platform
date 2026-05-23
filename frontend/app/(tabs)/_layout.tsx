import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/navigation/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="leads" options={{ title: 'Leads' }} />
      <Tabs.Screen name="escalations" options={{ title: 'Escalations' }} />
      <Tabs.Screen name="followups" options={{ title: 'Follow-ups' }} />
    </Tabs>
  );
}
