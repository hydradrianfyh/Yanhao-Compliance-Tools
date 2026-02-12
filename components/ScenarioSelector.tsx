import React from 'react';
import { ScenarioType } from '../types';

interface Props {
  onSelect: (type: ScenarioType, apiKey: string) => void;
}

const ScenarioSelector: React.FC<Props> = ({ onSelect }) => {
  const [apiKey, setApiKey] = React.useState('');

  const handleSelect = (type: ScenarioType) => {
    if (!apiKey.trim()) {
      alert("Please enter your OpenAI API Key to proceed.");
      return;
    }
    onSelect(type, apiKey);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <span className="text-red-700">EU</span> Data Protection Tool Kit
        </h1>
        <p className="text-lg text-gray-600">
          合规落地执行助手 | Compliance Execution Assistant
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key (Required)
        </label>
        <input 
          type="password" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 shadow-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Key is stored locally in memory only. Used for gpt-5.2-pro.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* R&D Card */}
        <button
          onClick={() => handleSelect('R&D')}
          className="group relative p-8 bg-white border-2 border-transparent hover:border-red-600 rounded-xl shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">R&D 研发场景</h2>
          <p className="text-gray-600 mb-6">
            适用于 ADAS/AD, 智能座舱 (Cockpit), HMI, 人因工程, 底盘, 动力总成, 电池, 充电等相关数据处理活动。
          </p>
          <span className="inline-flex items-center text-red-600 font-semibold group-hover:underline">
            Start Assessment &rarr;
          </span>
        </button>

        {/* Office Card */}
        <button
          onClick={() => handleSelect('Office')}
          className="group relative p-8 bg-white border-2 border-transparent hover:border-blue-600 rounded-xl shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Office 运营管理</h2>
          <p className="text-gray-600 mb-6">
             适用于 HR, Admin, Finance, IT Infrastructure, 访客管理, 门禁考勤等企业运营场景。
          </p>
          <span className="inline-flex items-center text-blue-600 font-semibold group-hover:underline">
            Start Assessment &rarr;
          </span>
        </button>
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400">
        GDPR check tool | Powered by OpenAI | Yanhao FU
      </div>
    </div>
  );
};

export default ScenarioSelector;