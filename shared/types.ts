export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'client' | 'guard' | 'admin';
export type GuardTier = 'standard' | 'elite';
export type JobStatus = 'pending' | 'active' | 'emergency' | 'completed' | 'cancelled';
export type ServiceType = 'escort' | 'executive' | 'event';
export type Location = {
  lat: number;
  lng: number;
};
export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}
export interface GuardProfile extends User {
  tier: GuardTier;
  skills: string[];
  rating: number;
  bio: string;
  experienceYears: number;
  location?: Location;
}
export interface Job {
  id: string;
  clientId: string;
  guardId?: string;
  status: JobStatus;
  serviceType: ServiceType;
  pickupLocation: string;
  destination: string;
  riskScore: number;
  createdAt: number;
  updatedAt: number;
  currentLocation?: Location;
}
export interface IncidentLog {
  id: string;
  jobId: string;
  timestamp: number;
  type: 'panic' | 'anomaly' | 'arrival' | 'departure';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface RiskAssessment {
  score: number;
  threats: string[];
  recommendedTier: GuardTier;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}