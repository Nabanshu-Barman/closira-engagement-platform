export const COLORS = {
  bgDeep: '#0A0F1E',
  bgSurface: '#131929',
  bgRaised: '#1C2539',
  bgElevated: '#232D45',

  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4B44CC',
  primaryGlow: 'rgba(108,99,255,0.20)',

  whatsapp: '#25D366',
  whatsappBg: 'rgba(37,211,102,0.15)',
  email: '#4B9EFF',
  emailBg: 'rgba(75,158,255,0.15)',
  call: '#F59E0B',
  callBg: 'rgba(245,158,11,0.15)',

  statusNew: '#4B9EFF',
  statusNewBg: 'rgba(75,158,255,0.15)',
  statusQualified: '#10B981',
  statusQualifiedBg: 'rgba(16,185,129,0.15)',
  statusEscalated: '#EF4444',
  statusEscalatedBg: 'rgba(239,68,68,0.15)',
  statusResolved: '#6B7280',
  statusResolvedBg: 'rgba(107,114,128,0.15)',

  urgencyHigh: '#EF4444',
  urgencyMedium: '#F59E0B',
  urgencyLow: '#10B981',

  textPrimary: '#F1F5F9',
  textSecondary: '#8B9DC3',
  textMuted: '#4A5568',

  borderSubtle: 'rgba(255,255,255,0.06)',
  borderDefault: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',

  success: '#10B981',
  successBg: 'rgba(16,185,129,0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.15)',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.15)',
  info: '#4B9EFF',
  infoBg: 'rgba(75,158,255,0.15)',
} as const;

export type ColorKey = keyof typeof COLORS;
