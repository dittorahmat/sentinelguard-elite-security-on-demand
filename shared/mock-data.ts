import type { User, GuardProfile, Job, Chat, ChatMessage } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Sterling', role: 'client', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'u2', name: 'Commander Vane', role: 'admin', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' }
];
export const MOCK_GUARDS: GuardProfile[] = [
  {
    id: 'g1',
    name: 'Marcus Thorne',
    role: 'guard',
    tier: 'elite',
    skills: ['Tactical Driving', 'First Aid', 'Close Combat'],
    rating: 4.9,
    bio: 'Former Special Forces with 12 years of executive protection experience.',
    experienceYears: 12,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  {
    id: 'g2',
    name: 'Sarah Jenkins',
    role: 'guard',
    tier: 'standard',
    skills: ['Crowd Control', 'Surveillance'],
    rating: 4.7,
    bio: 'Dedicated security professional specializing in residential and event safety.',
    experienceYears: 5,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'g3',
    name: 'Victor Kross',
    role: 'guard',
    tier: 'elite',
    skills: ['Cyber Security', 'Threat Assessment', 'Medical Response'],
    rating: 5.0,
    bio: 'Elite-tier specialist focusing on high-risk transport and tactical planning.',
    experienceYears: 15,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victor'
  }
];
export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'u1',
    guardId: 'g1',
    status: 'active',
    serviceType: 'escort',
    pickupLocation: 'Downtown Financial Hub',
    destination: 'Private Airport Terminal',
    riskScore: 65,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
    currentLocation: { lat: 40.7128, lng: -74.0060 }
  }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Mission Channel: J1' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'En route to extraction point.', ts: Date.now() },
];