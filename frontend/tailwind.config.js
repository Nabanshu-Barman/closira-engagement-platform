/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Background layers
        'bg-deep': '#0A0F1E',
        'bg-surface': '#131929',
        'bg-raised': '#1C2539',
        'bg-elevated': '#232D45',

        // Primary brand
        primary: '#6C63FF',
        'primary-light': '#8B85FF',
        'primary-dark': '#4B44CC',
        'primary-glow': 'rgba(108,99,255,0.2)',

        // Channel colors
        whatsapp: '#25D366',
        'whatsapp-bg': 'rgba(37,211,102,0.15)',
        email: '#4B9EFF',
        'email-bg': 'rgba(75,158,255,0.15)',
        call: '#F59E0B',
        'call-bg': 'rgba(245,158,11,0.15)',

        // Status colors
        'status-new': '#4B9EFF',
        'status-new-bg': 'rgba(75,158,255,0.15)',
        'status-qualified': '#10B981',
        'status-qualified-bg': 'rgba(16,185,129,0.15)',
        'status-escalated': '#EF4444',
        'status-escalated-bg': 'rgba(239,68,68,0.15)',
        'status-resolved': '#6B7280',
        'status-resolved-bg': 'rgba(107,114,128,0.15)',

        // Urgency
        'urgency-high': '#EF4444',
        'urgency-medium': '#F59E0B',
        'urgency-low': '#10B981',

        // Text hierarchy
        'text-primary': '#F1F5F9',
        'text-secondary': '#8B9DC3',
        'text-muted': '#4A5568',
        'text-inverse': '#0A0F1E',

        // Borders and dividers
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-default': 'rgba(255,255,255,0.10)',
        'border-strong': 'rgba(255,255,255,0.18)',

        // Semantic
        success: '#10B981',
        'success-bg': 'rgba(16,185,129,0.15)',
        warning: '#F59E0B',
        'warning-bg': 'rgba(245,158,11,0.15)',
        danger: '#EF4444',
        'danger-bg': 'rgba(239,68,68,0.15)',
        info: '#4B9EFF',
        'info-bg': 'rgba(75,158,255,0.15)',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        'sans-medium': ['Inter_500Medium', 'System'],
        'sans-semibold': ['Inter_600SemiBold', 'System'],
        'sans-bold': ['Inter_700Bold', 'System'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
      },
    },
  },
  plugins: [],
};
