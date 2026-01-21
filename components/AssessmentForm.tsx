import React, { useState } from 'react';
import { AssessmentFormData, ScenarioType } from '../types';

interface Props {
  scenario: ScenarioType;
  onSubmit: (data: AssessmentFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const AssessmentForm: React.FC<Props> = ({ scenario, onSubmit, onBack, isSubmitting }) => {
  const [formData, setFormData] = useState<AssessmentFormData>({
    systemName: '',
    dataSubject: '',
    dataType: '',
    purpose: '',
    source: '',
    storage: '',
    recipients: '',
    crossBorder: '',
    retention: '',
    security: '',
    files: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: Array.from(e.target.files || [])
      }));
    }
  };

  const handleDemoFill = () => {
    if (scenario === 'R&D') {
      setFormData(prev => ({
        ...prev,
        systemName: 'ADAS Data Logging Pilot (Frankfurt)',
        dataSubject: 'Public road users (pedestrians, other drivers), Test drivers',
        dataType: 'Video footage (faces, license plates), GPS location, CAN bus data, Driver fatigue status',
        purpose: 'Validation of L2+ autonomous driving algorithms',
        source: 'Vehicle sensors (Camera, LiDAR) and Telematics Box',
        storage: 'Encrypted SSD on vehicle -> Upload to AWS Frankfurt (S3)',
        recipients: 'Chery EU R&D (Algo Team), 3rd Party Labeling Vendor (Scale AI)',
        crossBorder: 'Metadata shared with HQ (China) for stats; Raw data stays in EU',
        retention: 'Raw data: 3 months; Anonymized data: 3 years',
        security: 'Disk encryption (LUKS), Access Control (IAM), No facial blurring on raw collection'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        systemName: 'Raunheim Office Visitor Management System',
        dataSubject: 'External Visitors, Interview Candidates',
        dataType: 'Name, Company, Phone, Email, Host Name, Time in/out',
        purpose: 'Physical security, Health & Safety compliance',
        source: 'iPad Kiosk at reception (Self-service)',
        storage: 'SaaS Vendor Cloud (Envoy) - Server in Ireland',
        recipients: 'Reception staff, HR (for interviews)',
        crossBorder: 'Vendor support team access from USA (SCC signed)',
        retention: '12 months',
        security: 'HTTPS, Password protected admin panel'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Shared classes for readable inputs
  const inputClass = "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 outline-none bg-white text-gray-900 placeholder-gray-500";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 font-medium flex items-center">
          &larr; Back
        </button>
        <div className="flex items-center gap-2">
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${scenario === 'R&D' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
             {scenario} Scenario
           </span>
           <button 
             type="button" 
             onClick={handleDemoFill} 
             className="text-xs text-gray-400 underline hover:text-gray-600"
           >
             Auto-fill Demo
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Processing Activity Details</h2>
          <p className="text-sm text-gray-500">Provide 1 line per field. Be concise.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">1. System/Process Name</label>
            <input required name="systemName" value={formData.systemName} onChange={handleChange} className={inputClass} placeholder="e.g. ADAS Data Collection" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">2. Data Subject</label>
            <input required name="dataSubject" value={formData.dataSubject} onChange={handleChange} className={inputClass} placeholder="e.g. Employees, Drivers" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">3. Data Type</label>
            <input required name="dataType" value={formData.dataType} onChange={handleChange} className={inputClass} placeholder="e.g. GPS, Face, Name" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">4. Purpose</label>
            <input required name="purpose" value={formData.purpose} onChange={handleChange} className={inputClass} placeholder="Why are we collecting this?" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">5. Data Source</label>
            <input required name="source" value={formData.source} onChange={handleChange} className={inputClass} placeholder="Direct from user, Sensor, etc." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">6. Storage Location</label>
            <input required name="storage" value={formData.storage} onChange={handleChange} className={inputClass} placeholder="AWS Frankfurt, Local Server, etc." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">7. Recipients</label>
            <input required name="recipients" value={formData.recipients} onChange={handleChange} className={inputClass} placeholder="Vendors, HQ, Internal Depts" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">8. Cross-border Transfer?</label>
            <input required name="crossBorder" value={formData.crossBorder} onChange={handleChange} className={inputClass} placeholder="No, or Yes (to China/USA)" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">9. Retention Period</label>
            <input required name="retention" value={formData.retention} onChange={handleChange} className={inputClass} placeholder="e.g. 6 months" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">10. Security Measures</label>
            <input required name="security" value={formData.security} onChange={handleChange} className={inputClass} placeholder="Encryption, Access Control, MFA" />
          </div>

          {/* New File Upload Section */}
          <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach Regulations / Policies (Optional)
              <span className="text-gray-400 font-normal ml-2">PDF/DOCX only</span>
            </label>
            <input 
              type="file" 
              multiple 
              accept=".pdf,.docx,.doc" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100
                cursor-pointer
              " 
            />
            {formData.files && formData.files.length > 0 && (
               <div className="mt-2 text-xs text-gray-600">
                  Selected: {formData.files.map(f => f.name).join(', ')}
               </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading & Analyzing (gpt-5.2-pro)...
                </span>
              ) : (
                "Generate Compliance Pack"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;