'use client';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { submitResponse } from './lib/supabase';
import { getTestCases } from './lib/supabase';


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
        testerEmail: '',
        userType: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [testCases, setTestCases] = useState<any[]>([]);
    

    const modules = [
        { id: 'PRMS', name: 'Proposal Management Information System +', desc: 'Proposal submission, review, approval, and management' },
        { id: 'INSPR', name: 'INtegrated System for Project Implementation and Research Evaluation', desc: 'Admin view, research management, reports, and analytics' },
        { id: 'SCRD', name: 'Scorecard', desc: 'College performance, leaderboard, KRAs, and targets' },
    ]

    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitResponse = async (e: any) => {
        e.preventDefault();
        const data = {
            tester_email: formData.testerEmail,
            test_id: formData.testCaseId,
            test_is_pass: formData.pass,
            remarks: formData.remarks,
            tester_role: formData.testerRole,
            tester_name: formData.testerName
        }
        setIsSubmitting(true);
        const error = await submitResponse(data);
        saveUserInfo(formData.testerName, formData.testerEmail, formData.testerRole);
        setSubmitted(true);
        setIsSubmitting(false);

        if (error) {
            console.error('Error submitting response:', error.message);
        }
    };

    // local storage
    const saveUserInfo = (name: string, email: string, role: string) => {
        localStorage.setItem('feedbackName', name);
        localStorage.setItem('feedbackEmail', email);
        localStorage.setItem('feedbackRole', role);
    };

    const loadLocalUserInfo = () => {
        const name = localStorage.getItem('feedbackName');
        const email = localStorage.getItem('feedbackEmail');
        const role = localStorage.getItem('feedbackRole');
        if (name && email && role) {
            handleInputChange('testerName', name);
            handleInputChange('testerEmail', email);
            handleInputChange('testerRole', role);
        }
    }

    // get test cases
    const getTest = async (userType: string, testId: string) => {
        const data = await getTestCases(userType, testId);
        setTestCases(data);
    }

    useEffect(() => {
        loadLocalUserInfo();
    }, []);

    if (submitted) {
        return (
            <div className='min-h-screen bg-neutral-50 text-neutral-900 font-mono flex items-center justify-center p-8'>
                <div className='max-w-2xl flex flex-col text-center'>
                    <div className="w-20 h-20 bg-green-100 border-4 border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <p className='text-4xl font-light mb-4'>Test Case Submitted</p>
                    <p className="text-lg text-neutral-600 font-sans mb-8">Thank you for your response. Your feedbacks have been recorded and will be reviewed by the development team.</p>
                    <div className='bg-white border border-neutral-300 p-8 flex flex-col gap-2 text-left text-sm'>
                        <p className='text-xs text-neutral-500 mb-3'>SUBMISSION SUMMARY</p>
                        <div className='flex justify-between border-b border-b-neutral-200 pb-2'>
                            <p className='text-neutral-500'>Module:</p>
                            <p className='font-medium'>{ modules.find(m => m.id === formData.module)?.name }</p>
                        </div>
                        <div className='flex justify-between border-b border-b-neutral-200 pb-2'>
                            <p className='text-neutral-500'>Test Case:</p>
                            <p className='font-medium'>{ formData.testCaseId } - { formData.title }</p>
                        </div>
                        <div className='flex justify-between border-b border-b-neutral-200 pb-2'>
                            <p className='text-neutral-500'>Submitted by:</p>
                            <p className='font-medium'>{ formData.testerName }</p>
                        </div>
                        <div className='flex justify-between border-b border-b-neutral-200 pb-2'>
                            <p className='text-neutral-500'>Email:</p>
                            <p className='font-medium'>{ formData.testerEmail }</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => { 
                            setSubmitted(false); 
                            setCurrentStep(1); 
                            setFormData({ module: '', testCaseId: '', title: '', description: '', remarks: '', pass: null, attachmentType: 'link', attachment: '', testerName: '', testerRole: '', testerEmail: '', userType: '' });
                            loadLocalUserInfo();
                        }}
                        
                            className="mt-6 px-6 py-3 bg-neutral-900 text-white hover:bg-orange-600 transition-colors"
                    >
                        Submit Another Test Case
                    </button>
                </div>
            </div>
        )
    }

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
                                <div
                                    className='flex justify-end mt-8'>
                                    <button 
                                        disabled={ formData.module == '' }
                                        onClick={() => setCurrentStep(2)}
                                        className={`
                                            bg-black px-6 py-3 transition-colors text-white 
                                            ${formData.module == ''  ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600  cursor-pointer'}
                                        `}>
                                            Continue to Test Case
                                    </button>
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
                                            Select User Type <span className='text-red-600'>*</span>
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                                            value={formData.userType}
                                            onChange={(e) => {
                                                handleInputChange('userType', e.target.value[0]);
                                                getTest(e.target.value[0], formData.module);
                                            }}
                                            >
                                                <option value="">-- Select user type --</option>
                                                <option value="f">Faculty</option>
                                                <option value="a">Admin</option>
                                        </select>
                                    </div>
                                    {
                                        formData.userType != '' && (
                                            <div className='flex flex-col gap-2'>
                                                <label className="text-sm text-neutral-600 ">
                                                    Select Test Case <span className='text-red-600'>*</span>
                                                </label>
                                                <select
                                                    className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                                                    value={formData.testCaseId}
                                                    
                                                    onChange={(e) => {
                                                        const selected = testCases.find((tc: any) => tc.id == e.target.value);
                                                        if (selected) {
                                                            handleInputChange('testCaseId', selected.id);
                                                            handleInputChange('title', selected.title);
                                                            handleInputChange('description', selected.description);
                                                            } else {
                                                            handleInputChange('testCaseId', '');
                                                            handleInputChange('title', '');
                                                            handleInputChange('description', '');
                                                            }
                                                    }}
                                                    >
                                                        <option value="">
                                                            -- Select test case --
                                                        </option>
                                                        {
                                                            testCases
                                                                .filter((tc: any) => tc.user_type === formData.userType && tc.test_id.startsWith(formData.module))
                                                                .map((tc: any) => (
                                                                    <option key={tc.id} value={tc.id}>
                                                                        {tc.title}
                                                                    </option>
                                                                ))
                                                        }
                                                </select>
                                            </div>
                                        )
                                    }

                                    {
                                        formData.testCaseId != '' && (
                                            <React.Fragment>
                                                <div className='flex flex-col gap-2'>
                                                    <label className="text-sm text-neutral-600 ">
                                                        Test Case ID
                                                    </label>
                                                    <p>{ testCases.find((tc: any) => tc.id == formData.testCaseId).test_id }</p>
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
                                                            flex-1 border-2 p-4 cursor-pointer transition-colors 
                                                            ${formData.pass && formData.pass != null ? 'bg-green-50 border-green-600' : 'hover:border-neutral-500 border-neutral-300 '}
                                                        `}>Yes</div>
                                                        <div 
                                                            onClick={() => handleInputChange('pass', false)} 
                                                            className={`
                                                            flex-1 border-2 p-4 cursor-pointer transition-colors 
                                                            ${!formData.pass && formData.pass != null ? 'bg-red-50 border-red-600' : 'hover:border-neutral-500 border-neutral-300 '}
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
                                            </React.Fragment>
                                        )
                                    }
                                </div>
                                <div className='flex justify-between mt-8'>
                                    <div 
                                        onClick={() => { 
                                            setSubmitted(false); 
                                            setCurrentStep(1); 
                                            setFormData({ module: '', testCaseId: '', title: '', description: '', remarks: '', pass: null, attachmentType: 'link', attachment: '', testerName: '', testerRole: '', testerEmail: '', userType: '' });
                                            loadLocalUserInfo();
                                        }}
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
                                        onClick={handleSubmitResponse}
                                        disabled={formData.testerEmail == '' || formData.testerRole == '' || isSubmitting}
                                        className={`
                                            bg-black px-6 py-3 transition-colors text-white 
                                            ${formData.testerEmail == '' || formData.testerRole == '' || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600  cursor-pointer'}
                                        `}>
                                            {
                                                isSubmitting ? (
                                                    <div className='flex items-center gap-2'>
                                                        <Loader size={20} className='animate-spin' />
                                                        Submitting...
                                                    </div>
                                                ) : <p>Submit</p>
                                            }
                                    </button>
                                </div>
                            </div>
                        )
                        
                    }
                    
                </div>

                {/* footer */}
                <div className="mt-8 text-center text-sm text-neutral-500 font-sans">
                    <p>For technical support or questions, contact the development team at databanking.rdmd@bicol-u.edu.ph</p>
                </div>
            </div>
        </div>
    )
}