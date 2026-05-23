# Closira Mobile Dashboard

A premium React Native mobile dashboard designed for business owners to monitor customer communication activity, act on escalations, and track follow-ups. Built with **Expo SDK 56**, **React Native Reanimated**, and **Zustand**.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app (SDK version 56) on your physical device, or an iOS Simulator / Android Emulator
- NOTE: Please install Expo Go app from the browser, not play store, as the play store app is not updated.

### Installation & Running

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Metro Bundler:**
   ```bash
   npx expo start --clear
   ```

4. **View the App:**
   - Scan the QR code shown in your terminal using the **Expo Go** app (Android) or the default **Camera** app (iOS).
   - Or press `a` to open in Android Emulator, or `i` to open in iOS Simulator.

---

## 🏗 Architecture & Code Structure

The project strictly follows a scalable, component-based architecture to avoid monolithic files and ensure high reusability.

```text
frontend/
├── app/                  # Expo Router file-based navigation (Screens)
│   ├── (tabs)/           # Bottom tab navigator screens (Home, Leads, Escalations, Follow-ups)
│   └── conversation/     # Dynamic conversation detail screen stack
├── components/           # Reusable UI components (Atomic Design)
│   ├── atoms/            # Base elements (Avatar, Badge, Button, Chip)
│   ├── molecules/        # Composite elements (LeadCard, StatCard, ActivityItem)
│   ├── navigation/       # Custom animated bottom tab bar
│   └── shared/           # Cross-screen shared layouts (EmptyState, ScreenHeader)
├── constants/            # Global design tokens (Colors, spacing)
├── mock/                 # Realistic JSON API-like mock data
├── store/                # Global state management using Zustand
└── types/                # Strict TypeScript interfaces
```

---

## 🎨 Styling Choice: StyleSheet over NativeWind

This application uses strictly typed **Vanilla React Native `StyleSheet`** combined with a centralized design token system (`constants/colors.ts`) instead of NativeWind. 

**Reasoning:**
1. **Performance & Predictability:** `StyleSheet` parses styles over the bridge once and avoids the runtime overhead of string-matching class names, which is critical for smooth scrolling on long lists (like Leads/Activity).
2. **Animation Synergy:** We rely heavily on **Reanimated 4** and **Moti** for highly fluid 60FPS micro-animations (like the custom tab bar and card mount springs). Reanimated maps natively to `StyleSheet` style objects, whereas utility class interpolations often require complex workarounds or wrappers.
3. **Design System Rigidity:** By abstracting all colors to `COLORS.ts`, we enforced a strict, non-generic dark-mode theme (`#0A0F1E` backgrounds, subtle glowing borders). `StyleSheet` prevents the accidental usage of off-brand colors that often leak in when using generic utility classes.

---

## ✨ Features & UX Highlights

- **Custom Animated Tab Bar:** A completely bespoke, Reanimated-powered bottom tab bar with spring physics and active-state indicators, providing a premium feel over the default iOS/Android UI.
- **Micro-Animations:** Fluid mount animations on the dashboard using `Moti`, giving the app a snappy, "alive" feel when navigating.
- **Consistent Visual Hierarchy:** Clear status indicators (New, Qualified, Escalated), Channel Badges (WhatsApp, Email, Call), and structured typography.
- **Graceful Empty States:** Empty lists aren't blank screens—they provide meaningful illustrations and context.
- **Global State Management:** Simulated local persistence using `Zustand` to actually "Resolve" escalations and "Complete" follow-ups in the UI state without a real backend.

---

## 📌 Mock Data Implementation

All data simulates real API payloads structured as proper JSON arrays of objects. You can find these in the `mock/` folder. The app uses `Zustand` state to read from these mock arrays, allowing actual state mutation (resolving an escalation removes it from the list dynamically).

---

## ⚠️ Known Limitations & Trade-offs

1. **Local State Only:** Since no actual backend integration was requested for the frontend, state mutations (e.g., resolving an escalation) are stored in local memory via Zustand. They will reset upon an app reload.
2. **Missing Real Fonts:** To ensure stability and remove external dependency bugs during the Expo 56 configuration, we opted for native system fonts instead of pulling `@expo-google-fonts/inter`. The system fonts (San Francisco/Roboto) map perfectly to our typography scale.
3. **Pagination:** The mock data lists load entirely into the ScrollViews. For production, these would be converted to `FlatList` with `onEndReached` handlers to paginate large datasets.

---

## 📸 Screenshots & Walkthrough

*(Candidate note: Please attach screenshots of the Dashboard, Leads, Escalations, Follow-ups, and Conversation views here, along with a link to the 2-5 minute video walkthrough)*

- **Walkthrough Video:** `[Insert Link Here]`
- **Screenshots:** `[Add Images Here]`
