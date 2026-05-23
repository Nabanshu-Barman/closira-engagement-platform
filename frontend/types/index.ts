export type Channel = 'whatsapp' | 'email' | 'call';
export type EnquiryStatus = 'new' | 'qualified' | 'escalated' | 'resolved';
export type UrgencyLevel = 'high' | 'medium' | 'low';
export type EventType =
  | 'enquiry_created'
  | 'sop_matched'
  | 'followup_scheduled'
  | 'escalated'
  | 'resolved'
  | 'message_sent'
  | 'agent_replied';

export interface Enquiry {
  id: string;
  customer: string;
  channel: Channel;
  status: EnquiryStatus;
  message: string;
  summary: string;
  sopMatch: string | null;
  suggestedResponse: string | null;
  receivedAt: string;
  reason?: string;
}

export interface EscalationAlert {
  id: string;
  enquiryId: string;
  customer: string;
  channel: Channel;
  reason: string;
  urgency: UrgencyLevel;
  createdAt: string;
  resolved: boolean;
}

export interface FollowUp {
  id: string;
  enquiryId: string;
  customer: string;
  channel: Channel;
  dueAt: string;
  messagePreview: string;
  done: boolean;
}

export interface TimelineEvent {
  id: string;
  enquiryId: string;
  type: EventType;
  description: string;
  timestamp: string;
}

export interface Message {
  id: string;
  enquiryId: string;
  sender: 'customer' | 'ai' | 'agent';
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalLeadsToday: number;
  missedEnquiries: number;
  openEscalations: number;
  followUpsDue: number;
}
