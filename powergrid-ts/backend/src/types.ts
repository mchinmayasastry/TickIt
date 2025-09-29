export type TicketSource = 'web' | 'chatbot' | 'email' | 'glpi' | 'solman';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  source: TicketSource;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string; // NLP assigned category
  assigneeTeam?: string; // routed team
  status: TicketStatus;
  requester: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
  };
  metadata?: Record<string, any>;
}

export interface ClassificationResult {
  category: string;
  confidence: number; // 0..1
  suggestedArticles?: KnowledgeArticle[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  url?: string;
}
