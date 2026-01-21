import { KPIEntry, ScenarioType } from '../types';

/**
 * Simulates the openai_kpi.log_case tool call.
 * In a real backend scenario, this would write to a DB or external log.
 */
export const logCaseToKPI = async (
  scenario: ScenarioType,
  riskLevel: 'RED' | 'YELLOW' | 'GREEN' | 'UNKNOWN',
  triggerDPIA: boolean,
  outputCount: number,
  timeSpentMinutes: number
): Promise<KPIEntry> => {
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  const entry: KPIEntry = {
    caseId,
    scenarioType: scenario,
    timestamp: new Date().toISOString(),
    durationMs: timeSpentMinutes * 60 * 1000,
    outputSections: outputCount,
    riskLevel
  };

  console.log('----------------------------------------------------');
  console.log('🛠️ TOOL CALL: openai_kpi.log_case');
  console.log('Payload:', JSON.stringify(entry, null, 2));
  console.log('Result: Success');
  console.log('----------------------------------------------------');

  return entry;
};

export const getKPICost = async () => {
   // Mock function for token usage
   return {
     monthlyTokens: 145020,
     monthlyCostUSD: 4.52
   };
}