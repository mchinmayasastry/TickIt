import natural from 'natural';
import { ClassificationResult, KnowledgeArticle } from '../types';
import { searchKnowledge } from './knowledge';

const classifier = new natural.BayesClassifier();
let trained = false;

function train() {
  if (trained) return;
  // Basic training examples; extend as needed
  classifier.addDocument('password reset forgot password account locked', 'Access & Identity');
  classifier.addDocument('vpn access not connecting ssl vpn anyconnect', 'Network');
  classifier.addDocument('email not working outlook mailbox quota', 'Email');
  classifier.addDocument('laptop issue hardware keyboard broken', 'Hardware');
  classifier.addDocument('software installation request install app', 'Software');
  classifier.addDocument('sap solman incident', 'SAP');
  classifier.addDocument('glpi ticket helpdesk', 'Helpdesk');
  classifier.addDocument('printer not printing paper jam', 'Hardware');
  classifier.addDocument('wifi slow internet not working', 'Network');
  classifier.addDocument('account creation onboarding user setup', 'Access & Identity');
  classifier.train();
  trained = true;
}

export async function classifyText(text: string): Promise<ClassificationResult> {
  train();
  const classifications = classifier.getClassifications(text.toLowerCase());
  const top = classifications[0];
  const category = top ? top.label : 'General';
  const confidence = top ? top.value : 0.5;
  const suggestedArticles: KnowledgeArticle[] = await searchKnowledge(text, [category]);
  return { category, confidence, suggestedArticles };
}
