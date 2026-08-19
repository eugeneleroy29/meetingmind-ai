export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  completed?: boolean;
}

export interface KeyTopic {
  topic: string;
  summary: string;
}

export interface MeetingAnalysis {
  title: string;
  executiveSummary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  keyTopics: KeyTopic[];
  sentimentAndTone: string;
  followUpEmail: string;
}

export interface PresetMeeting {
  id: string;
  title: string;
  duration: string;
  participants: string[];
  transcript: string;
}