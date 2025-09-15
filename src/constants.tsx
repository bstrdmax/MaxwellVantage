

import React from 'react';
import type { Project, Prospect, Content, RecentActivity, RevenueData, Email, EmailSummary, SuggestedResponse, COOInsight, StrategicGoal, ContentIdea, GeneratedContent, Notification, DriveIdea, StrategicAdvice, KnowledgeItem, SystemContext, ContentContext } from './types';
import { ProjectStatus, ProspectSource, ContentType, GeneratedContentStatus, KnowledgeType } from './types';

// Mock Data
export const MOCK_PROJECTS: Project[] = [
  { id: 'proj7', name: 'New Partnership Integration', client: 'Connectify Ltd', status: ProjectStatus.Onboarding, healthScore: 100, deadline: '2024-11-20', driveFolderUrl: '#', origin: 'Airtable' },
  { id: 'proj0', name: 'New Client Onboarding', client: 'Nexus Enterprises', status: ProjectStatus.OnTrack, healthScore: 95, deadline: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], driveFolderUrl: '#', origin: 'Airtable' },
  { id: 'proj1', name: 'Q3 Marketing Campaign', client: 'Innovate Inc.', status: ProjectStatus.OnTrack, healthScore: 92, deadline: '2024-09-30', driveFolderUrl: '#', origin: 'Manual' },
  { id: 'proj2', name: 'Website Redesign', client: 'Future Solutions', status: ProjectStatus.AtRisk, healthScore: 75, deadline: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0], driveFolderUrl: '#', origin: 'Manual' },
  { id: 'proj3', name: 'Mobile App Launch', client: 'Tech Giants LLC', status: ProjectStatus.OnTrack, healthScore: 88, deadline: '2024-10-20', driveFolderUrl: '#', origin: 'Manual' },
  { id: 'proj4', name: 'Annual Report 2024', client: 'Global Corp', status: ProjectStatus.OnHold, healthScore: 60, deadline: '2024-11-01', driveFolderUrl: '#', origin: 'Manual' },
  { id: 'proj5', name: 'Data Migration', client: 'Data Driven Co.', status: ProjectStatus.OffTrack, healthScore: 45, deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], driveFolderUrl: '#', origin: 'Manual' },
  { id: 'proj6', name: 'Onboarding Automation', client: 'Innovate Inc.', status: ProjectStatus.Completed, healthScore: 100, deadline: '2024-07-20', driveFolderUrl: '#', origin: 'Manual' },
];

export const MOCK_PROSPECTS: Prospect[] = [
  { 
    id: 'prosp1', 
    companyName: 'Synergy Systems', 
    contact: 'jane.doe@synergy.com', 
    leadScore: 85, 
    source: ProspectSource.LinkedIn, 
    lastActivity: '2024-07-28', 
    nextFollowUp: '2024-08-05',
    analysis: 'Mid-sized B2B SaaS company that recently secured Series B funding. Their hiring for "process automation" roles indicates a clear need for operational efficiency tools. They are scaling fast and likely experiencing growing pains with manual workflows.',
    strategy: 'Lead with a case study on how we helped a similar SaaS company scale. Focus on ROI and speed of implementation. Propose a targeted demo that solves a specific pain point mentioned in their job descriptions, like client onboarding.',
    talkingPoints: [
        'Congrats on the recent Series B funding!',
        'Noticed you\'re scaling your client success team; how are you handling the increased onboarding workload?',
        'We helped [Similar Company] reduce their onboarding time by 50%.'
    ],
    whyFit: 'Their rapid growth, recent funding, and focus on automation make them a perfect fit for our core value proposition. They have the budget and the immediate need.',
    syncedToAirtable: true,
  },
  { id: 'prosp2', companyName: 'Quantum Leap Inc.', contact: 'john.smith@quantum.com', leadScore: 72, source: ProspectSource.WebScraping, lastActivity: '2024-07-25', nextFollowUp: '2024-08-02', syncedToAirtable: true },
  { id: 'prosp3', companyName: 'Creative Minds', contact: 'sara.jones@creative.com', leadScore: 91, source: ProspectSource.Referral, lastActivity: '2024-07-29', nextFollowUp: '2024-08-01', syncedToAirtable: false },
  { id: 'prosp4', companyName: 'NextGen Solutions', contact: 'mark.wilson@nextgen.com', leadScore: 65, source: ProspectSource.Manual, lastActivity: '2024-07-22', nextFollowUp: '2024-08-10', syncedToAirtable: false },
];

export const MOCK_SYSTEM_CONTEXT: SystemContext = {
    persona: 'Our ideal client is a B2B service-based business with 50-500 employees, typically in the tech, consulting, or creative agency space. They are experiencing rapid growth and are bottlenecked by manual administrative tasks, especially client onboarding and project management. The key decision-maker is often a COO, Head of Operations, or a technically-minded CEO who values efficiency and scalability.',
    missionValues: 'Our mission is to empower businesses to scale without chaos by automating their core operational workflows. We value clarity, efficiency, and partnership. We believe in building robust, intuitive systems that let our clients focus on their core business, not on paperwork.',
    strategy: 'Our sales strategy is consultative. We identify specific pain points through research and discovery calls, then present a tailored automation solution. We focus on demonstrating clear ROI and a fast time-to-value. We leverage case studies and data-driven insights to build trust and credibility.'
};

export const MOCK_CONTENT_CALENDAR: Content[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const date = new Date(2024, 7, day); // August 2024
    if (day % 5 === 0) {
        return { id: `content${day}`, title: `Blog Post Idea ${day / 5}`, type: ContentType.BlogPost, status: 'Draft', publishDate: date };
    }
    if (day % 3 === 0) {
        return { id: `content${day}`, title: `Social Media Update ${day}`, type: ContentType.SocialMedia, status: 'Scheduled', publishDate: date };
    }
    if (day === 15) {
        return { id: `content${day}`, title: 'August Newsletter', type: ContentType.Newsletter, status: 'Published', publishDate: date };
    }
    return null;
}).filter(Boolean) as Content[];


export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { id: 'act1', description: 'New prospect "Synergy Systems" added from LinkedIn.', timestamp: '2 hours ago', type: 'success' },
  { id: 'act2', description: 'Project "Website Redesign" status changed to At Risk.', timestamp: '5 hours ago', type: 'alert' },
  { id: 'act3', description: 'Contract for "Innovate Inc." automatically generated.', timestamp: '1 day ago', type: 'info' },
  { id: 'act4', description: 'Email response sent to "john.smith@quantum.com".', timestamp: '2 days ago', type: 'info' },
];

export const MOCK_REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', forecast: 4000, actual: 2400 },
  { month: 'Feb', forecast: 3000, actual: 1398 },
  { month: 'Mar', forecast: 5000, actual: 6800 },
  { month: 'Apr', forecast: 4780, actual: 3908 },
  { month: 'May', forecast: 5890, actual: 4800 },
  { month: 'Jun', forecast: 4390, actual: 3800 },
  { month: 'Jul', forecast: 5490, actual: 4300 },
];

export const MOCK_EMAILS: Email[] = [
  { id: 'email1', from: 'jane.doe@synergy.com', subject: 'Re: Project Proposal', snippet: 'Thanks for sending that over. I have a few questions about the timeline...', timestamp: '8:05 AM', priority: 'high', status: 'needs-review' },
  { id: 'email2', from: 'newsletter@techcrunch.com', subject: 'This Week in AI', snippet: 'OpenAI announces new model, Google releases new features...', timestamp: '8:02 AM', priority: 'normal', status: 'needs-review' },
  { id: 'email3', from: 'john.smith@quantum.com', subject: 'Quick Question', snippet: 'Hey, just wanted to check in on the status of the report. Any updates?', timestamp: '7:55 AM', priority: 'high', status: 'needs-review' },
  { id: 'email4', from: 'support@figma.com', subject: 'Your Figma invoice is ready', snippet: 'Your invoice for your recent Figma purchase is attached...', timestamp: '7:30 AM', priority: 'normal', status: 'needs-review' },
  { id: 'email5', from: 'sara.jones@creative.com', subject: 'Following up', snippet: 'Hi, just wanted to follow up on our conversation from last week...', timestamp: 'Yesterday', priority: 'normal', status: 'needs-review' },
];

export const MOCK_MORNING_SUMMARY: EmailSummary = {
    totalEmails: 18,
    needsResponse: 5,
    keyInsights: [
        'High priority follow-up required for "Synergy Systems".',
        'Meeting request from "Quantum Leap Inc." for next week.',
        '3 new inquiries about Q4 service packages.',
    ],
};

export const MOCK_AFTERNOON_SUMMARY: EmailSummary = {
    totalEmails: 12,
    needsResponse: 2,
    keyInsights: [
        'Confirmation received for "Innovate Inc." project milestone.',
        'Positive feedback from "Creative Minds" on the latest draft.',
    ],
};

export const MOCK_SUGGESTED_RESPONSES: SuggestedResponse[] = [
    { emailId: 'email1', response: 'Hi Jane,\n\nHappy to clarify. The proposed timeline is flexible in phase 2, and we can adjust based on your team\'s feedback. I\'ve attached a more detailed breakdown.\n\nCould you let me know if Thursday works for a quick 15-minute call to discuss?\n\nBest,\nAdmin' },
    { emailId: 'email3', response: 'Hi John,\n\nThanks for checking in. The report is in its final review stage, and I expect to have it over to you by EOD today.\n\nI\'ll let you know the moment it\'s sent.\n\nBest,\nAdmin' },
    { emailId: 'email5', response: 'Hi Sara,\n\nGreat to hear from you. I was just about to reach out. I\'ve completed the preliminary analysis and have some exciting insights to share.\n\nAre you free for a call sometime tomorrow afternoon?\n\nBest,\nAdmin' },
];

export const MOCK_TOP_PRIORITY = {
    title: 'Stabilize "Website Redesign" Project',
    description: 'The "Website Redesign" project for Future Solutions is now At Risk (75% health). Immediate action is required to address timeline slippage and client concerns. Your primary focus should be on realigning with the client and creating a recovery plan.',
    action: 'Schedule a meeting with Future Solutions stakeholders.',
};

export const MOCK_COO_INSIGHTS: COOInsight[] = [
    { id: 'coo1', category: 'Sales & Growth', priority: 'High', insight: 'The prospect "Creative Minds" from a referral has a lead score of 91, the highest in the pipeline.', action: 'Prioritize immediate, personalized outreach to this prospect.' },
    { id: 'coo2', category: 'Client Management', priority: 'High', insight: 'The "Data Migration" project is Off Track with a health score of 45%. This poses a significant client relationship and delivery risk.', action: 'Initiate an internal audit of the project to identify blockers.' },
    { id: 'coo3', category: 'Operational Efficiency', priority: 'Medium', insight: 'Email VA data shows an average response time reduction of 60% during digests.', action: 'Consider implementing a third daily digest to handle late-day inquiries.' },
];

export const MOCK_STRATEGIC_GOALS: StrategicGoal[] = [
    { id: 'goal1', title: 'Increase Qualified Prospects by 20%', progress: 65, target: 'End of Q3' },
    { id: 'goal2', title: 'Maintain Average Project Health >85%', progress: 90, target: 'This Month' },
    { id: 'goal3', title: 'Automate 80% of Client Onboarding Tasks', progress: 50, target: 'End of Q4' },
];

export const MOCK_CONTENT_IDEAS: ContentIdea[] = [
  {
    id: 'idea1',
    topic: 'Q3 report shows a 25% increase in user engagement due to the new dashboard feature.',
    timestamp: '2024-08-01T10:00:00Z',
  },
  {
    id: 'idea2',
    topic: 'Case study on how Innovate Inc. reduced project risk by 40% using our platform.',
    timestamp: '2024-07-30T14:20:00Z',
  },
  {
    id: 'idea3',
    topic: 'Top 5 automation tips for small businesses in the creative sector.',
    timestamp: '2024-07-28T09:00:00Z',
  },
];

export const MOCK_GENERATED_CONTENT: GeneratedContent[] = [
    {
        id: 'gen_blog1',
        ideaId: 'idea1',
        type: ContentType.BlogPost,
        title: "How Our New Dashboard Drove a 25% Surge in User Engagement",
        body: "The results are in, and they're spectacular. Our recently released Q3 report highlights a massive 25% increase in user engagement across the platform. The driving force behind this growth? The new intuitive dashboard we launched last quarter. In this post, we'll break down the key metrics, explore the design decisions that made a difference, and share what this means for the future of our platform...",
        status: GeneratedContentStatus.Draft,
        syncedToAirtable: false,
    },
    {
        id: 'gen_social1',
        ideaId: 'idea1',
        type: ContentType.SocialMedia,
        title: "LinkedIn Post",
        body: "Thrilled to share a key insight from our Q3 report: user engagement is up by 25%! This incredible growth is a direct result of our new dashboard, designed for a more intuitive and powerful user experience. A huge thank you to our product and engineering teams for their outstanding work. #UserEngagement #ProductManagement #SaaS #Growth",
        status: GeneratedContentStatus.Draft,
        syncedToAirtable: false,
    },
     {
        id: 'gen_social2',
        ideaId: 'idea1',
        type: ContentType.SocialMedia,
        title: "Twitter Thread (1/3)",
        body: "🚀 BIG NEWS from our Q3 report! User engagement has skyrocketed by 25% since we launched our new dashboard. We're diving deep into the data, but one thing is clear: intuitive design wins.",
        status: GeneratedContentStatus.Draft,
        syncedToAirtable: false,
    },
    {
        id: 'gen_newsletter1',
        ideaId: 'idea1',
        type: ContentType.Newsletter,
        title: "Subject: You're More Engaged Than Ever - Here's Why",
        body: "Hi [FirstName],\n\nWe noticed you've been exploring the platform more, and you're not alone! Our Q3 data shows that users like you have boosted our engagement by 25% since the launch of our new dashboard. We're committed to building tools that help you succeed, and this is just the beginning. Check out our latest blog post to learn more about our journey and what's next...",
        status: GeneratedContentStatus.Draft,
        syncedToAirtable: false,
    },
    {
        id: 'gen_blog2',
        ideaId: 'idea2',
        type: ContentType.BlogPost,
        title: "Innovate Inc.'s Success Story: Slashing Project Risk by 40%",
        body: "Discover how Innovate Inc. leveraged our platform to gain unprecedented control over their project lifecycle, resulting in a 40% reduction in at-risk projects. This case study breaks down their strategy...",
        status: GeneratedContentStatus.Approved,
        syncedToAirtable: true,
    },
    {
        id: 'gen_social3',
        ideaId: 'idea2',
        type: ContentType.SocialMedia,
        title: "LinkedIn Post",
        body: "Client success is what drives us. We're proud to feature Innovate Inc., who cut their project risk by an incredible 40% using our automation and health monitoring tools. #CaseStudy #ProjectManagement #ClientSuccess",
        status: GeneratedContentStatus.InDrive,
        syncedToAirtable: false,
    },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif1', message: 'Project "Website Redesign" is now At Risk.', timestamp: '5 hours ago', read: false },
];

export const MOCK_DRIVE_IDEAS: DriveIdea[] = [
    { id: 'drive1', fileName: 'Q4_Strategy_Meeting_Notes.gdoc', snippet: 'Key takeaway from Q4 strategy: focus on AI-driven personalization for SMBs. This could be a major differentiator.', detectedAt: '1 hour ago' },
    { id: 'drive2', fileName: 'Client_Feedback_Summary_July.gdoc', snippet: 'Multiple clients mentioned wanting more granular reporting features. This is a recurring theme.', detectedAt: '3 hours ago' },
];

export const MOCK_STRATEGIC_ADVICE: StrategicAdvice[] = [
    {
        id: 'adv1',
        source: 'Airtable',
        finding: 'Prospect data shows a 30% drop-off after the "Initial Proposal Sent" stage.',
        recommendation: 'Implement an automated follow-up sequence with a case study tailored to the prospect\'s industry to re-engage these leads.'
    },
    {
        id: 'adv2',
        source: 'Website',
        finding: 'The homepage call-to-action "Learn More" is generating a low click-through rate (1.2%).',
        recommendation: 'A/B test a more benefit-driven CTA like "Start Automating Your Business in 5 Minutes" to improve conversions.'
    },
    {
        id: 'adv3',
        source: 'Landing Page',
        finding: 'The "Q3 Marketing Campaign" landing page has a 75% bounce rate for mobile traffic.',
        recommendation: 'Optimize the landing page for mobile by simplifying the form and ensuring the headline is visible without scrolling.'
    }
];

export const MOCK_COO_KNOWLEDGE: KnowledgeItem[] = [
    { id: 'coo-k1', type: KnowledgeType.Document, content: 'Q3 Financial Projections.pdf' },
    { id: 'coo-k2', type: KnowledgeType.Context, content: 'Primary strategic focus is expansion into the APAC market.' },
    { id: 'coo-k3', type: KnowledgeType.Document, content: 'Competitor Analysis - "Innovate Inc.".docx' },
];

export const MOCK_CONTENT_CONTEXT: ContentContext = {
    writingVoice: 'Professional, yet approachable and slightly witty. We are experts, but not elitist. The tone should be confident, clear, and concise. Use simple language and avoid jargon. The goal is to educate and empower our audience, making complex topics feel accessible.',
    guidance: 'Focus on the "why" before the "how". Every piece of content should address a specific pain point for our target audience (B2B SaaS founders, product managers). Start with the problem, then introduce our solution. Use data and real-world examples whenever possible. Always end with a clear call-to-action.',
    examples: [
        'Blog Title: "Stop Drowning in Spreadsheets: How Automation Reclaimed 10 Hours a Week for Our Client"',
        'LinkedIn Post Snippet: "Scaling your team? Don\'t let manual onboarding slow you down. Here are 3 signs your process is broken..."',
        'Newsletter Subject: "Your Weekend Reading: The 5-Minute Guide to Effortless Project Tracking"',
    ]
};


// SVG Icons as React Components
export const DashboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

export const ProjectsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const ProspectsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const ContentIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

export const FolderIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
    </svg>
);

export const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

export const MailIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

export const BrainCircuitIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5a3 3 0 1 0-5.993.129 3 3 0 0 0 5.993-.13Z" /><path d="M12 19a3 3 0 0 0-5.993-.129A3 3 0 1 0 12 19Z" /><path d="M19 12a3 3 0 0 1-.129-5.993A3 3 0 1 1 19 12Z" /><path d="M5 12a3 3 0 0 0 .129 5.993A3 3 0 1 0 5 12Z" /><path d="M9 12a3 3 0 0 0 0 6" /><path d="M15 12a3 3 0 0 1 0-6" /><path d="M12 9V6" /><path d="M12 18v-3" /><path d="M15.536 15.536 18 18" /><path d="M18 6l-2.464 2.464" /><path d="M8.464 8.464 6 6" /><path d="M6 18l2.464-2.464" />
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.9 1.9-1.4-1.4-1.9 1.9-1.4-1.4L3 6l1.4 1.4L2.5 9l1.9 1.9 1.4 1.4L6 15l1.4 1.4L9 18.3l1.9 1.9 1.4-1.4 1.9 1.9 1.4-1.4L21 18l-1.4-1.4L21.5 15l-1.9-1.9-1.4-1.4L18 9l-1.4-1.4L15 5.7l-1.9-1.9Z"/>
    </svg>
);

export const ZapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export const FileTextIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
    </svg>
);

export const GoogleDriveIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
    </svg>
);

export const AirtableIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
);

export const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

export const LayoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export const Trash2Icon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
);

export const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export const PlusCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

export const ClipboardListIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <path d="M12 11h4"/>
        <path d="M12 16h4"/>
        <path d="M8 11h.01"/>
        <path d="M8 16h.01"/>
    </svg>
);

export const AlertTriangleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const HeartIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);

export const FlagIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
);

export const LightbulbIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

export const MessageSquareQuoteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 12h.01"/>
        <path d="M12 12h.01"/>
        <path d="M16 12h.01"/>
    </svg>
);

export const TargetIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export const PenToolIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><path d="m11 13 2.5 2.5"/></svg>
);

export const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export const ClipboardCopyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
);

export const LinkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
    </svg>
);
