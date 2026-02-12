import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GeneratedReport, KPIEntry, ReportSection } from '../types';

interface Props {
  report: GeneratedReport;
  onReset: () => void;
}

const ReportViewer: React.FC<Props> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<string>(report.sections[0]?.id || '');

  // Helper to parse the risk level from the first section (Executive Conclusion)
  const getRiskColor = () => {
    const conclusion = report.sections.find(s => s.title.includes('Executive Conclusion'))?.content || '';
    if (conclusion.includes('RED') || conclusion.includes('高风险')) return 'bg-red-600';
    if (conclusion.includes('YELLOW') || conclusion.includes('中风险')) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-200">
           <h2 className="font-bold text-gray-800 text-lg leading-tight">Compliance Pack</h2>
           <div className="mt-2 text-xs text-gray-500 font-mono">{report.kpiData?.caseId}</div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {report.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === section.id
                  ? 'bg-gray-100 text-red-700 border-l-4 border-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={onReset} className="w-full py-2 px-4 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
            Start New Case
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4">
              <span className={`h-3 w-3 rounded-full ${getRiskColor()}`}></span>
              <h3 className="font-semibold text-gray-800">
                {report.sections.find(s => s.id === activeTab)?.title}
              </h3>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => navigator.clipboard.writeText(report.fullMarkdown)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded"
              >
                Copy Markdown
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto bg-white min-h-full p-8 shadow-sm rounded-lg">
             <div className="prose prose-red max-w-none">
               <ReactMarkdown>
                 {report.sections.find(s => s.id === activeTab)?.content || ''}
               </ReactMarkdown>
             </div>
          </div>
        </div>

        {/* Mock KPI Footer */}
        {report.kpiData && (
          <div className="bg-gray-800 text-white px-6 py-2 text-xs flex justify-between items-center z-10">
            <div className="flex gap-4">
              <span className="text-green-400">● KPI Tool Connected</span>
              <span>Case Logged: {report.kpiData.caseId}</span>
              <span>Time: {(report.kpiData.durationMs / 1000).toFixed(1)}s</span>
              <span>Artifacts: {report.kpiData.outputSections}</span>
            </div>
            <div className="text-gray-400">
              GDPR Compliance System
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewer;