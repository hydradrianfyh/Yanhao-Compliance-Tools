import React, { useState } from 'react';
import { AssessmentFormData, GeneratedReport, KPIEntry, ReportSection, ScenarioType } from './types';
import ScenarioSelector from './components/ScenarioSelector';
import AssessmentForm from './components/AssessmentForm';
import ReportViewer from './components/ReportViewer';
import { generateComplianceReport } from './services/openaiService';
import { logCaseToKPI } from './services/kpiService';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [scenario, setScenario] = useState<ScenarioType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const handleScenarioSelect = (type: ScenarioType, key: string) => {
    setApiKey(key);
    setScenario(type);
    setStep(1);
  };

  const handleFormSubmit = async (data: AssessmentFormData) => {
    if (!scenario) return;
    if (!apiKey) {
      alert("API Key is missing. Please restart.");
      setStep(0);
      return;
    }

    setIsSubmitting(true);
    const startTime = Date.now();

    try {
      // 1. Generate Content via OpenAI (gpt-5.2-pro)
      const rawMarkdown = await generateComplianceReport(scenario, data, apiKey);
      
      // 2. Parse Markdown Sections using the delimiter
      const sectionsRaw = rawMarkdown.split('---SECTION:');
      const sections: ReportSection[] = sectionsRaw
        .filter(s => s.trim().length > 0)
        .map((s, index) => {
          let title = `Section ${index + 1}`;
          let content = s;

          const titleMatch = s.match(/^\s*(.*?)-{3}/);
          if (titleMatch) {
            title = titleMatch[1].trim();
            content = s.replace(/^\s*(.*?)-{3}/, '').trim();
          } else if (index === 0 && !s.includes('---SECTION')) {
              title = "Executive Conclusion"; 
          }

          return { id: `sec-${index}`, title, content };
        });

      // 3. Determine Risk Level for KPI
      const firstSection = sections[0]?.content || '';
      let riskLevel: KPIEntry['riskLevel'] = 'GREEN';
      if (firstSection.includes('RED') || firstSection.includes('高风险') || firstSection.includes('Red')) riskLevel = 'RED';
      else if (firstSection.includes('YELLOW') || firstSection.includes('中风险') || firstSection.includes('Yellow')) riskLevel = 'YELLOW';

      // 4. Log to KPI Tool
      const durationMins = (Date.now() - startTime) / 1000 / 60;
      const kpiEntry = await logCaseToKPI(
        scenario, 
        riskLevel, 
        rawMarkdown.includes('DPIA: Required') || rawMarkdown.includes('触发 DPIA'), 
        sections.length, 
        durationMins
      );

      setReport({
        fullMarkdown: rawMarkdown,
        sections,
        kpiData: kpiEntry
      });
      
      setStep(3);

    } catch (error: any) {
      alert(`Error generating report: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetApp = () => {
    setStep(0);
    setScenario(null);
    setReport(null);
    // Keep apiKey
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {step === 0 && <ScenarioSelector onSelect={handleScenarioSelect} />}
      
      {step === 1 && scenario && (
        <AssessmentForm 
          scenario={scenario} 
          onSubmit={handleFormSubmit} 
          onBack={() => setStep(0)}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 3 && report && (
        <ReportViewer report={report} onReset={resetApp} />
      )}
    </div>
  );
};

export default App;