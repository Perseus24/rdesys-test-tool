'use client';
import { AlertCircle, CheckCircle, ExternalLink, Loader, Star, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getUserEmails, getUserFeedbacks} from '../lib/supabase';
import Head from "next/head";

export default function Home() {
    const [emails, setEmails] = useState<any[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState('');
    useEffect(() => {
        async function fetchEmails() {
            const emails = await getUserEmails();
            console.log("emails", emails);
            if (emails) setEmails(emails);
        }
        fetchEmails();
    }, [])

    useEffect(() => {
        async function fetchEmails() {
            const data = await getUserFeedbacks(activeUser);
            console.log("emails", data);
            if (data) setFeedbacks(data);
        }
        fetchEmails();
    }, [activeUser])

    
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
                        <span className="italic text-neutral-600">admin portal</span>
                    </h1>
                    <p className='max-w-2xl text-lg text-neutral-600 leading-relaxed font-sans mb-4'>
                        Thank you for participating in the alpha testing phase of the RDESys v1.0. 
                        Your feedback is crucial in identifying issues and improving the system before full deployment.</p>
                    
                </div>
                <div>
                    <select
                        value={activeUser}
                        onChange={(e) => setActiveUser(e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 focus:border-orange-600 focus:outline-none font-sans"
                        required
                    >
                        {
                            emails.map((email, index) => (
                                <option key={index}>{email}</option>
                            ))
                        }
                        
                    </select>
                    {
                        Object.keys(feedbacks).map((key, index) => (
                            <div key={index} className='flex flex-col gap-2'>
                                <h2 className='text-2xl font-bold'>{feedbacks[key as any].test_cases.title}</h2>
                                <div className='pl-10 flex flex-col gap-2'>
                                    <p>Module : {feedbacks[key as any].test_cases.test_id}</p>
                                    <p className='flex gap-3 items-center'>Pass? {feedbacks[key as any].test_is_pass ? <CheckCircle className='text-green-600' /> : <AlertCircle className='text-red-600' />}</p>
                                    <p>Remarks</p>
                                    <p>{feedbacks[key as any].remarks}</p>
                                    <p>User Experience Rating</p>
                                    <div className='flex gap-2'>
                                        {
                                            Array.from({ length: feedbacks[key as any].user_experience_rating }, (_, index) => (
                                                <Star key={index} className='fill-orange-600 text-orange-600' />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
    </div>
    )
}