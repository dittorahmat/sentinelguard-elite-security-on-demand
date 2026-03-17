import { IndexedEntity } from "./core-utils";
import type { User, GuardProfile, Job, Chat, ChatMessage, IncidentLog, JobStatus } from "@shared/types";
import { MOCK_GUARDS, MOCK_JOBS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: "client" };
  static seedData = MOCK_USERS;
}
export class GuardEntity extends IndexedEntity<GuardProfile> {
  static readonly entityName = "guard";
  static readonly indexName = "guards";
  static readonly initialState: GuardProfile = { 
    id: "", name: "", role: "guard", tier: "standard", skills: [], rating: 0, bio: "", experienceYears: 0 
  };
  static seedData = MOCK_GUARDS;
}
export class JobEntity extends IndexedEntity<Job> {
  static readonly entityName = "job";
  static readonly indexName = "jobs";
  static readonly initialState: Job = { 
    id: "", clientId: "", status: "pending", serviceType: "escort", 
    pickupLocation: "", destination: "", riskScore: 0, createdAt: 0, updatedAt: 0 
  };
  static seedData = MOCK_JOBS;
  async updateLocation(lat: number, lng: number): Promise<Job> {
    return this.mutate(s => ({ ...s, currentLocation: { lat, lng }, updatedAt: Date.now() }));
  }
  async setStatus(status: JobStatus): Promise<Job> {
    return this.mutate(s => ({ ...s, status, updatedAt: Date.now() }));
  }
}
export class IncidentEntity extends IndexedEntity<IncidentLog> {
  static readonly entityName = "incident";
  static readonly indexName = "incidents";
  static readonly initialState: IncidentLog = { 
    id: "", jobId: "", timestamp: 0, type: "anomaly", description: "", severity: "low" 
  };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}