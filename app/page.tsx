'use client';
import { AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';


export default function Home() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        module: '',
        testCaseId: '',
        title: '',
        description: '',
        remarks: '',
        pass: null,
        attachmentType: 'link',
        attachment: '',
        testerName: '',
        testerRole: '',
        testerEmail: ''
    });

    const modules = [
        { id: 'promis+', name: 'Proposal Management Information System +', desc: 'Proposal submission, review, approval, and management' },
        { id: 'inspire', name: 'Information Something', desc: 'Proposal submission, review, approval, and management' },
    ]

    const testCases = {
        'promis+': [
            { id: 'PRMS-001', title: 'Dashboard successfully loaded', desc: 'The dashboard loads the correct information and layout.' },
        ]
    }

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className='min-h-screen bg-neutral-50 text-neutral-900 font-mono'>
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none" 
                style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'}}></div>

            <div className="max-w-4xl mx-auto px-8 py-16 relative">
                {/* header */}
                <div className='flex flex-col gap-8'>
                    <p className="text-sm text-neutral-500">[ RDESys version = 1.0 ]</p>
                    <h1 className="text-5xl font-light leading-tight mb-4">
                        Alpha Testing,<br/>
                        <span className="italic text-neutral-600">feedback portal</span>
                    </h1>
                    <p className='max-w-2xl text-lg text-neutral-600 leading-relaxed font-sans mb-4'>
                        Thank you for participating in the alpha testing phase the RDESys v1.0. 
                        Your feedback is crucial in identifying issues and improving the system before full deployment.</p>
                    <div className='-mt-5 max-w-2xl bg-orange-50 border-l-4 border-orange-600 p-4 text-sm text  -neutral-700 font-sans'>
                        <p>
                            <span className='font-bold'>Note:</span> Please test each module thoroughly and document any bugs, issues, or suggestions for improvement. 
                            Include screenshots or screen recordings when possible.</p>
                    </div>
                </div>

                {/* content */}
                <div className='mt-12 flex items-center gap-4'>
                    {
                        [1,2,3].map((step) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium
                                        ${currentStep == step
                                            ? 'border-orange-600 bg-orange-600 text-white'
                                            : currentStep > step 
                                                ? 'border-green-600 bg-green-600 text-white'
                                                : 'border-neutral-300 text-neutral-400'
                                        }
                                        `}>{ currentStep > step ? <CheckCircle size={20} /> : step }</div>
                                    <p className={`text-sm ${currentStep == step ? 'text-neutral-900 font-medium': 'text-neutral-400'}`}>
                                        {
                                            step == 1 ? 'Select Module'
                                                : step == 2
                                                    ? 'Test Case Details'
                                                    : 'Your Information'
                                        }
                                    </p>
                                </div>
                                {step < 3 && <div className="flex-1 h-px bg-neutral-300"></div>}
                            </React.Fragment>
                        ))
                    }
                </div>

                <div className='flex flex-col gap-5 bg-white border border-neutral-300 mt-12 p-8'>
                    {
                        currentStep == 1 && (
                            <div>
                                <p className='text-xl font-medium'>Select Module to Test</p>
                                <div className='mt-6 flex flex-col gap-4'>
                                    {
                                        modules.map((module) => (
                                            <div 
                                                key={module.id}
                                                onClick={() => handleInputChange('module', module.id) }
                                                className={`border-2 p-6 cursor-pointer transition-all flex gap-4 ${
                                                    formData.module == module.id
                                                        ? 'border-orange-600 bg-orange-50'
                                                        : 'border-neutral-300 hover:border-neutral-400'
                                                }`}>
                                                <div className={`
                                                    flex items-center-justify-center rounded-full h-5 w-5  
                                                    ${formData.module == module.id ? 'bg-orange-600': 'border-2 border-neutral-400'}
                                                `}></div>
                                                <div className='flex flex-col'>
                                                    <p className='font-medium'>{ module.name }</p>
                                                    <p className='mt-2 text-sm text-neutral-600 font-sans'>{ module.desc }</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='flex justify-end mt-8'>
                                    <div 
                                        onClick={() => setCurrentStep(2)}
                                        className='bg-black px-6 py-3 transition-colors text-white hover:bg-orange-600 cursor-pointer'>
                                            Continue to Test Case
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        currentStep == 2 && (
                            <div>
                                <p className='text-xl font-medium'>Test Case Details</p>
                                <div className='flex flex-col gap-5 mt-5'>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Select Test Case 
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
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
                                            }}>
                                                <option value="">
                                                    -- Select test case --
                                                </option>
                                                {
                                                    (testCases as any)[formData.module]?.map((tc: { id: string; title: string; desc: string; }) => (
                                                        <option key={tc.id} value={tc.id}>
                                                            {tc.id} - {tc.title}
                                                        </option>
                                                    ))
                                                }
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Test Case ID
                                        </label>
                                        <p>{ formData.testCaseId }</p>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Test Case Title
                                        </label>
                                        <p>{ formData.title }</p>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Test Case Description
                                        </label>
                                        <p>{ formData.description }</p>
                                    </div>
                                    <div className='flex flex-col gap-2 mt-8'>
                                        <label className="text-sm text-neutral-600 ">
                                            Did the test case pass? <span className='text-red-600'>*</span>
                                        </label>
                                        <div className='flex gap-8'>
                                            <div 
                                                onClick={() => handleInputChange('pass', true)} 
                                                className={`
                                                flex-1 border-2 p-4 cursor-pointer transition-colors border-neutral-300 
                                                ${formData.pass && formData.pass != null ? 'bg-orange-50 border-orange-600' : 'hover:border-neutral-500'}
                                            `}>Yes</div>
                                            <div 
                                                onClick={() => handleInputChange('pass', false)} 
                                                className={`
                                                flex-1 border-2 p-4 cursor-pointer transition-colors border-neutral-300 
                                                ${!formData.pass && formData.pass != null ? 'bg-orange-50 border-orange-600' : 'hover:border-neutral-500'}
                                            `}>No</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Remarks
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                                            value={formData.remarks}
                                            onChange={(e) => handleInputChange('remarks', e.target.value)}
                                            placeholder="Report any bugs, issues, or suggestions. Be as detailed as possible..."
                                            rows={6}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-between mt-8'>
                                    <div 
                                        onClick={() => setCurrentStep(1)}
                                        className='px-6 py-3 transition-colors border border-neutral-300 hover:border-orange-600 hover:text-orange-600 cursor-pointer'>
                                            Back
                                    </div>
                                    <button 
                                        onClick={() => setCurrentStep(3)}
                                        disabled={formData.pass == null || formData.testCaseId == ''}
                                        className={`
                                            bg-black px-6 py-3 transition-colors text-white 
                                            ${formData.pass == null || formData.testCaseId == '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600  cursor-pointer'}
                                        `}>
                                            Continue
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {
                        currentStep == 3 && (
                            <div>
                                <p className='text-xl font-medium'>Your Information</p>
                                <div className='flex flex-col gap-5 mt-5'>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Name
                                        </label>
                                        <input
                                            className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                                            value={formData.testerName}
                                            onChange={(e) => handleInputChange('testerName', e.target.value)}
                                            placeholder="Juan De La Cruz"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Role / Position <span className='text-red-600'>*</span>
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
                                            <option value="college-coordinator">College Coordinator</option>
                                            <option value="admin-staff">Administrative Staff</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className="text-sm text-neutral-600 ">
                                            Email Address <span className='text-red-600'>*</span>
                                        </label>
                                        <input
                                            type='email'
                                            className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                                            value={formData.testerEmail}
                                            onChange={(e) => handleInputChange('testerEmail', e.target.value)}
                                            placeholder="juan.delacruz@bicol-u.edu.ph"
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-3 bg-neutral-100 border border-neutral-300 p-6 mt-8 font-sans text-sm'>
                                    <AlertCircle size={20} className="text-orange-600 shrink-0 mt-1" />
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-neutral-700 font-medium'>Privacy Notice</p>
                                        <p>Your information will be used solely for the purpose of this alpha testing phase.</p>
                                    </div>
                                </div>
                                <div className='flex justify-between mt-8'>
                                    <div 
                                        onClick={() => setCurrentStep(2)}
                                        className='px-6 py-3 transition-colors border border-neutral-300 hover:border-orange-600 hover:text-orange-600 cursor-pointer'>
                                            Back
                                    </div>
                                    <button 
                                        onClick={() => setCurrentStep(3)}
                                        disabled={formData.testerEmail == '' || formData.testerRole == ''}
                                        className={`
                                            bg-black px-6 py-3 transition-colors text-white 
                                            ${formData.testerEmail == '' || formData.testerRole == '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600  cursor-pointer'}
                                        `}>
                                            Submit
                                    </button>
                                </div>
                            </div>
                        )
                        
                    }
                    
                </div>
            </div>
        </div>
    )
}