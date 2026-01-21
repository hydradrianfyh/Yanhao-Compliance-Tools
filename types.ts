export type ScenarioType = 'R&D' | 'Office';

export interface AssessmentFormData {
  systemName: string;      // 1. System/Process Name
  dataSubject: string;     // 2. Data Subject
  dataType: string;        // 3. Data Type
  purpose: string;         // 4. Processing Purpose
  source: string;          // 5. Data Source
  storage: string;         // 6. Storage Location
  recipients: string;      // 7. Recipients/Sharing
  crossBorder: string;     // 8. Cross-border transfer
  retention: string;       // 9. Retention Period
  security: string;        // 10. Security Measures
  files?: File[];          // Attached Regulation PDFs
}

export interface KPIEntry {
  caseId: string;
  scenarioType: string;
  timestamp: string;
  durationMs: number;
  outputSections: number;
  riskLevel: 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN';
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
}

export interface GeneratedReport {
  fullMarkdown: string;
  sections: ReportSection[];
  kpiData?: KPIEntry;
}