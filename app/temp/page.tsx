'use client';

import React, { useState } from 'react';
import { CheckCircle, Upload, ExternalLink, AlertCircle, FileText } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    module: '',
    testCaseId: '',
    title: '',
    description: '',
    remarks: '',
    attachmentType: 'link',
    attachment: '',
    testerName: '',
    testerRole: '',
    testerEmail: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const modules = [
    { id: 'student-management', name: 'Student Management Module', desc: 'Student records, enrollment, and profile management' },
    { id: 'grading-system', name: 'Grading System Module', desc: 'Grade computation, submission, and reporting' },
    { id: 'scheduling', name: 'Class Scheduling Module', desc: 'Course scheduling, room allocation, and timetables' }
  ];

  const testCases = {
    'student-management': [
      { id: 'SM-001', title: 'Add new student record', desc: 'Test the ability to create a new student profile with complete information' },
      { id: 'SM-002', title: 'Update student information', desc: 'Test editing existing student records and saving changes' },
      { id: 'SM-003', title: 'Search and filter students', desc: 'Test search functionality using various filters' }
    ],
    'grading-system': [
      { id: 'GS-001', title: 'Input final grades', desc: 'Test grade entry and computation accuracy' },
      { id: 'GS-002', title: 'Generate grade reports', desc: 'Test report generation for different formats' },
      { id: 'GS-003', title: 'Grade submission workflow', desc: 'Test the complete grade submission process' }
    ],
    'scheduling': [
      { id: 'CS-001', title: 'Create class schedule', desc: 'Test schedule creation with conflict detection' },
      { id: 'CS-002', title: 'Assign room and faculty', desc: 'Test room and faculty assignment process' },
      { id: 'CS-003', title: 'View and export schedules', desc: 'Test schedule viewing and export functionality' }
    ]
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    setSubmitted(true);
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-mono flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 border-4 border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-light mb-4">Test Case Submitted</h1>
            <p className="text-lg text-neutral-600 font-sans">
              Thank you for your feedback. Your test results have been recorded and will be reviewed by the development team.
            </p>
          </div>

          <div className="bg-white border border-neutral-300 p-8 text-left mb-6">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Submission Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Module:</span>
                <span className="font-medium">{modules.find(m => m.id === formData.module)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Test Case:</span>
                <span className="font-medium">{formData.testCaseId} - {formData.title}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Submitted by:</span>
                <span className="font-medium">{formData.testerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email:</span>
                <span className="font-medium">{formData.testerEmail}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setSubmitted(false); setCurrentStep(1); setFormData({ module: '', testCaseId: '', title: '', description: '', remarks: '', attachmentType: 'link', attachment: '', testerName: '', testerRole: '', testerEmail: '' }); }}
            className="px-6 py-3 bg-neutral-900 text-white hover:bg-orange-600 transition-colors"
          >
            Submit Another Test Case
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-mono">
      {/* Grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'}}></div>

      <div className="max-w-4xl mx-auto px-8 py-16 relative">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-8">
            <p className="text-sm text-neutral-500 mb-2">[ ALPHA_TESTING_PHASE = ACTIVE ]</p>
            <h1 className="text-5xl font-light leading-tight mb-4">
              System Testing,<br/>
              <span className="italic text-neutral-600">feedback portal</span>
            </h1>
          </div>
          
          <div className="max-w-2xl">
            <p className="text-lg text-neutral-600 leading-relaxed font-sans mb-4">
              Thank you for participating in the alpha testing phase of our university management system. 
              Your feedback is crucial in identifying issues and improving the system before full deployment.
            </p>
            <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
              <p className="text-sm text-neutral-700 font-sans">
                <strong>Note:</strong> Please test each module thoroughly and document any bugs, 
                issues, or suggestions for improvement. Include screenshots or screen recordings when possible.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${
                    currentStep === step 
                      ? 'border-orange-600 bg-orange-600 text-white' 
                      : currentStep > step 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-neutral-300 text-neutral-400'
                  }`}>
                    {currentStep > step ? <CheckCircle size={20} /> : step}
                  </div>
                  <span className={`text-sm ${currentStep === step ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                    {step === 1 ? 'Select Module' : step === 2 ? 'Test Case Details' : 'Your Information'}
                  </span>
                </div>
                {step < 3 && <div className="flex-1 h-px bg-neutral-300"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-neutral-300">
          {/* Step 1: Module Selection */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-xl font-medium mb-6">Select Module to Test</h2>
              
              <div className="space-y-4">
                {modules.map((module) => (
                  <label
                    key={module.id}
                    className={`block border-2 p-6 cursor-pointer transition-all ${
                      formData.module === module.id 
                        ? 'border-orange-600 bg-orange-50' 
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="module"
                      value={module.id}
                      checked={formData.module === module.id}
                      onChange={(e) => handleInputChange('module', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                        formData.module === module.id 
                          ? 'border-orange-600 bg-orange-600' 
                          : 'border-neutral-400'
                      }`}>
                        {formData.module === module.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{module.name}</h3>
                        <p className="text-sm text-neutral-600 font-sans">{module.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.module}
                  className={`px-6 py-3 transition-colors ${
                    formData.module 
                      ? 'bg-neutral-900 text-white hover:bg-orange-600' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Test Case
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Test Case Details */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-xl font-medium mb-6">Test Case Details</h2>

              {/* Predefined Test Cases */}
              <div className="mb-6">
                <label className="block text-sm text-neutral-600 mb-3">
                  Select Predefined Test Case (Optional)
                </label>
                <select
                  value={formData.testCaseId}
                  onChange={(e) => {
                    const selected = (testCases as any)[formData.module]?.find((tc: { id: string; }) => tc.id === e.target.value);
                    if (selected) {
                      handleInputChange('testCaseId', selected.id);
                      handleInputChange('title', selected.title);
                      handleInputChange('description', selected.desc);
                    } else {
                      handleInputChange('testCaseId', '');
                      handleInputChange('title', '');
                      handleInputChange('description', '');
                    }
                  }}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                >
                  <option value="">-- Select or create custom test case --</option>
                  {(testCases as any)[formData.module]?.map((tc: any) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.id} - {tc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Test Case ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testCaseId}
                    onChange={(e) => handleInputChange('testCaseId', e.target.value)}
                    placeholder="e.g., SM-001 or CUSTOM-001"
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Test Case Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief title describing what you tested"
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Test Case Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what you tested and the expected behavior..."
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Your Remarks / Findings <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="Report any bugs, issues, or suggestions. Be as detailed as possible..."
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans resize-none"
                    required
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm text-neutral-600 mb-3">
                    Evidence (Screenshot/Recording)
                  </label>
                  
                  <div className="flex gap-4 mb-4">
                    <label className={`flex-1 border-2 p-4 cursor-pointer transition-colors ${
                      formData.attachmentType === 'link' 
                        ? 'border-orange-600 bg-orange-50' 
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}>
                      <input
                        type="radio"
                        name="attachmentType"
                        value="link"
                        checked={formData.attachmentType === 'link'}
                        onChange={(e) => handleInputChange('attachmentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <ExternalLink size={20} className={formData.attachmentType === 'link' ? 'text-orange-600' : 'text-neutral-500'} />
                        <span className="text-sm">Provide Link</span>
                      </div>
                    </label>

                    <label className={`flex-1 border-2 p-4 cursor-pointer transition-colors ${
                      formData.attachmentType === 'upload' 
                        ? 'border-orange-600 bg-orange-50' 
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}>
                      <input
                        type="radio"
                        name="attachmentType"
                        value="upload"
                        checked={formData.attachmentType === 'upload'}
                        onChange={(e) => handleInputChange('attachmentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <Upload size={20} className={formData.attachmentType === 'upload' ? 'text-orange-600' : 'text-neutral-500'} />
                        <span className="text-sm">Upload File</span>
                      </div>
                    </label>
                  </div>

                  {formData.attachmentType === 'link' ? (
                    <input
                      type="url"
                      value={formData.attachment}
                      onChange={(e) => handleInputChange('attachment', e.target.value)}
                      placeholder="https://drive.google.com/... or https://imgur.com/..."
                      className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                    />
                  ) : (
                    <div className="border-2 border-dashed border-neutral-300 p-8 text-center hover:border-orange-600 transition-colors cursor-pointer">
                      <Upload size={32} className="mx-auto mb-3 text-neutral-400" />
                      <p className="text-sm text-neutral-600 font-sans mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-neutral-500">PNG, JPG, MP4 up to 10MB</p>
                      <input type="file" className="hidden" accept="image/*,video/*" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-neutral-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.testCaseId || !formData.title || !formData.description || !formData.remarks}
                  className={`px-6 py-3 transition-colors ${
                    formData.testCaseId && formData.title && formData.description && formData.remarks
                      ? 'bg-neutral-900 text-white hover:bg-orange-600' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Tester Information */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-xl font-medium mb-6">Your Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.testerName}
                    onChange={(e) => handleInputChange('testerName', e.target.value)}
                    placeholder="Dr. Juan Dela Cruz"
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Role / Position <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.testerRole}
                    onChange={(e) => handleInputChange('testerRole', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="professor">Professor</option>
                    <option value="dean">Dean</option>
                    <option value="registrar">Registrar</option>
                    <option value="admin-staff">Administrative Staff</option>
                    <option value="it-staff">IT Staff</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.testerEmail}
                    onChange={(e) => handleInputChange('testerEmail', e.target.value)}
                    placeholder="juan.delacruz@university.edu.ph"
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 bg-neutral-100 border border-neutral-300 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-neutral-700 font-sans">
                    <p className="font-medium mb-2">Privacy Notice</p>
                    <p>
                      Your information will be used solely for the purpose of this alpha testing phase 
                      and may be contacted for follow-up questions regarding your feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-neutral-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.testerName || !formData.testerRole || !formData.testerEmail}
                  className={`px-6 py-3 transition-colors ${
                    formData.testerName && formData.testerRole && formData.testerEmail
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Submit Test Case
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500 font-sans">
          <p>For technical support or questions, contact the development team at dev-support@university.edu.ph</p>
        </div>
      </div>
    </div>
  );
}