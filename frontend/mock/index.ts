import type { Enquiry, EscalationAlert, FollowUp, TimelineEvent, Message } from '../types';

import enquiriesData from './enquiries.json';
import escalationsData from './escalations.json';
import followupsData from './followups.json';
import eventsData from './events.json';
import messagesData from './messages.json';

export const MOCK_ENQUIRIES: Enquiry[] = enquiriesData as Enquiry[];
export const MOCK_ESCALATIONS: EscalationAlert[] = escalationsData as EscalationAlert[];
export const MOCK_FOLLOWUPS: FollowUp[] = followupsData as FollowUp[];
export const MOCK_EVENTS: TimelineEvent[] = eventsData as TimelineEvent[];
export const MOCK_MESSAGES: Message[] = messagesData as Message[];

export function getEnquiryById(id: string): Enquiry | undefined {
  return MOCK_ENQUIRIES.find((e) => e.id === id);
}

export function getEventsForEnquiry(enquiryId: string): TimelineEvent[] {
  return MOCK_EVENTS.filter((e) => e.enquiryId === enquiryId);
}

export function getMessagesForEnquiry(enquiryId: string): Message[] {
  return MOCK_MESSAGES.filter((m) => m.enquiryId === enquiryId);
}

export function getEscalationForEnquiry(enquiryId: string): EscalationAlert | undefined {
  return MOCK_ESCALATIONS.find((e) => e.enquiryId === enquiryId);
}
