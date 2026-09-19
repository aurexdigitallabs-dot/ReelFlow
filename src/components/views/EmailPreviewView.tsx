import React, { useState } from 'react';
import { getWelcomeEmail, getTaskAssignedEmail, getStatusUpdatedEmail } from '../../emails/templates';
import { Mail, CheckCircle2 } from 'lucide-react';

export const EmailPreviewView: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  
  const templates: Record<string, { name: string, description: string, html: string }> = {
    welcome: {
      name: 'Welcome / Onboarding',
      description: 'Sent when an admin creates a new creator profile.',
      html: getWelcomeEmail('Sarah Creator', 'https://reelflow.aurexdigitals.in/login')
    },
    task: {
      name: 'New Task Assigned',
      description: 'Sent to a creator when a new content task is assigned to them.',
      html: getTaskAssignedEmail('Sarah Creator', 'Summer Campaign Shoot', 'Oct 15, 2026', 'https://reelflow.aurexdigitals.in/task/123')
    },
    status: {
      name: 'Status Updated',
      description: 'Sent to a creator when their task status is updated (e.g. Needs Edit).',
      html: getStatusUpdatedEmail('Sarah Creator', 'Summer Campaign Shoot', 'Ready to Post', 'https://reelflow.aurexdigitals.in/task/123')
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">Email Templates</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preview how automated emails look to your creators</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-72 border-r border-slate-800 p-4 flex flex-col gap-3 shrink-0 bg-slate-950 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Select Trigger</h3>
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`p-3 rounded-xl text-left transition-all ${
                selectedTemplate === key 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-gray-400 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold">{template.name}</span>
                {selectedTemplate === key && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
              </div>
              <p className="text-[10px] opacity-80 leading-relaxed">
                {template.description}
              </p>
            </button>
          ))}
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 bg-[#f8fafc] relative overflow-hidden flex flex-col">
           {/* Browser-like header for preview */}
           <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0 shadow-sm">
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-full bg-rose-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
             </div>
             <div className="flex-1 flex justify-center">
                <div className="bg-gray-100 text-gray-500 text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-gray-400">Subject:</span> 
                  <span className="font-medium text-gray-700">{templates[selectedTemplate].name}</span>
                </div>
             </div>
           </div>
           
           <iframe 
            srcDoc={templates[selectedTemplate].html} 
            className="w-full flex-1 border-none bg-transparent"
            title="Email Preview"
           />
        </div>
      </div>
    </div>
  );
};
