
export enum ProjectStatus {
  Onboarding = 'Onboarding',
  OnTrack = 'On Track',
  AtRisk = 'At Risk',
  OffTrack = 'Off Track',
  OnHold = 'On Hold',
  Completed = 'Completed'
}

export enum ProspectSource {
  LinkedIn = 'LinkedIn',
  WebScraping = 'Web Scraping',
  Referral = 'Referral',
  Manual = 'Manual',
  AI = 'AI Prospector',
}

export enum ContentType {
  BlogPost = 'Blog Post',
  SocialMedia = 'Social Media',
  Newsletter = 'Newsletter',
  Video = 'Video'
}

export enum GeneratedContentStatus {
  Draft = 'Draft',
  InDrive = 'In Drive',
  Approved = 'Approved',
  Scheduled = 'Scheduled'
}

export enum KnowledgeType {
    Document = 'document',
    Voice = 'voice',
    Context = 'context',
}

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  content: string;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
  priority: 'high' | 'normal';
  status: 'needs-review' | 'responded' | 'archived';
}

export interface EmailSummary {
    totalEmails: number;
    needsResponse: number;
    keyInsights: string[];
}

export interface SuggestedResponse {
    emailId: string;
    response: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  healthScore: number;
  deadline: string;
  driveFolderUrl: string;
  origin?: 'Airtable' | 'Manual';
}

export interface Prospect {
  id: string;
  companyName: string;
  contact: string;
  leadScore: number;
  source: ProspectSource;
  lastActivity: string;
  nextFollowUp: string;
  analysis?: string;
  strategy?: string;
  talkingPoints?: string[];
  whyFit?: string;
  syncedToAirtable?: boolean;
}

export interface SystemContext {
    persona: string;
    missionValues: string;
    strategy: string;
}

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  status: 'Draft' | 'Review' | 'Scheduled' | 'Published';
  publishDate: Date;
}

export interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success';
}

export interface RevenueData {
  month: string;
  forecast: number;
  actual: number;
}

export interface COOInsight {
    id:string;
    category: 'Client Management' | 'Sales & Growth' | 'Operational Efficiency';
    insight: string;
    action: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface StrategicGoal {
    id: string;
    title: string;
    progress: number; // Percentage
    target: string;
}

export interface ContentIdea {
    id: string;
    topic: string;
    timestamp: string;
}

export interface GeneratedContent {
    id: string;
    ideaId: string;
    type: ContentType;
    title: string;
    body: string;
    status: GeneratedContentStatus;
    syncedToAirtable?: boolean;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface DriveIdea {
    id: string;
    fileName: string;
    snippet: string;
    detectedAt: string;
}

export interface StrategicAdvice {
    id: string;
    source: 'Airtable' | 'Website' | 'Landing Page';
    finding: string;
    recommendation: string;
}

export interface UXAnalysisResult {
    area: string;
    finding: string;
    recommendation: string;
}

export interface ContentContext {
    writingVoice: string;
    guidance: string;
    examples: string[];
}
