'use client';
import { AlertCircle, CheckCircle, ExternalLink, Loader, Star, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAverageOverallEval, getNumberOfTestEvaluated, getOverallEvals, getTotalTestCases, getUserEmails, getUserFeedbacks} from '../lib/supabase';
import Head from "next/head";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


export default function Home() {
    // const evaluations = ['easeOfUse', 'speedAndResponsiveness', 'clarity', 'usefulness', 'overallSatisfaction'];
    const evaluations = [{
        title: 'Ease of Use',
        value: 'easeOfUse',
    }, {
        title: 'Speed and Responsiveness',
        value: 'speedAndResponsiveness',
    }, {
        title: 'Clarity',
        value: 'clarity',
    }, {
        title: 'Usefulness',
        value: 'usefulness',
    }, {
        title: 'Overall Satisfaction',
        value: 'overallSatisfaction',
    }
    ];
    const [emails, setEmails] = useState<any[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState('');
    const [totalTestCases, setTotalTestCases] = useState(0);
    const [totalEvaluated, setTotalEvaluated] = useState(0);
    const modules = ['promis', 'inspire', 'scorecard'];

    const [moduleData, setModuleData] = useState<any[]>([]);
    useEffect(() => {
        async function fetchEmails() {
            const emails = await getUserEmails();
            if (emails) setEmails(emails);
        }

        async function getTotal() {
            const data = await getTotalTestCases();
            if (data) setTotalTestCases(data.length);
        }

        async function getTotalEvaluated() {
            const data = await getNumberOfTestEvaluated();
            if (data) setTotalEvaluated(data.length);
        }

        

        async function getDataPerModule() {
            const formatData: {
            module: string;
            total: number;
            evaluated: number;
            averageEval: number;
            evaluations: any[]; 
            }[] = [];
            for (const module of modules) {
                const data = await getTotalTestCases(module);
                const data2 = await getNumberOfTestEvaluated(module);
                const data3 = await getAverageOverallEval(module);
                const data4 = await getOverallEvals(module);
                if (data) formatData.push({ module: module, total: data.length, evaluated: 0, averageEval: 0, evaluations: [] });
                if (data2) formatData.filter(item => item.module === module)[0].evaluated = data2.length;
                if (data3) formatData.filter(item => item.module === module)[0].averageEval = data3;
                if (data4) formatData.filter(item => item.module === module)[0].evaluations = setChartDataFormat(module, data4);
            }
            setModuleData(formatData);
        }

        function setChartDataFormat(title: string, data: any[]) {
            const formatData: { title: string; rating: any; }[] = [];
            data.forEach((item, index) => {
                formatData.push({ title: evaluations[index].title, rating: item });
            })
            return formatData;
        }

        getTotal();
        getTotalEvaluated();
        fetchEmails();
        getDataPerModule();
        
    }, [])

    useEffect(() => {
        async function fetchEmails() {
            const data = await getUserFeedbacks(activeUser);
            if (data) setFeedbacks(data);
        }
        fetchEmails();
    }, [activeUser])

    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 273 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ]
    
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    
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
                <div className="grid grid-cols-3 gap-5">
                    <div className="flex flex-col justify-between border border-gray-200 p-4 text-sm">
                        <p>Number of Testers</p>
                        <p className='text-4xl font-bold'>{emails.length}</p>
                    </div>
                    <div className="flex flex-col justify-between border border-gray-200 p-4 text-sm">
                        <p>Total Test Cases</p>
                        <p className='text-4xl font-bold'>{totalTestCases}</p>
                    </div>
                    <div className="flex flex-col justify-between border border-gray-200 p-4 text-sm">
                        <p>Number of Test Cases Evaluated</p>
                        <p className='text-4xl font-bold'>{totalEvaluated}</p>
                    </div>
                </div>
                <div className='flex w-full my-5'>
                    <Table className='w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[200px] text-neutral-600'>Module</TableHead>
                                <TableHead className='text-neutral-600 text-center'>Test Cases</TableHead>
                                <TableHead className='text-neutral-600 font-bold text-center'>Number of Test Cases Evaluated</TableHead>
                                <TableHead className='text-neutral-600 font-bold text-center'>Average Evaluation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                moduleData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='text-neutral-600'>{data.module == 'promis' ? 'PROMIS' : data.module == 'inspire' ? 'InSPIRE' : 'SCORECARD'}</TableCell>
                                        <TableCell className='text-neutral-600 text-center'>{data.total}</TableCell>
                                        <TableCell className='text-neutral-600 text-center font-bold'>{data.evaluated}</TableCell>
                                        <TableCell className='text-neutral-600 text-center font-bold text-base'>{data.averageEval.toFixed(2)}/5</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <div className='grid grid-cols-3 mt-10 gap-5 -mx-[200px]'>
                    {
                        moduleData.map((data, index) => (
                            <Card className='border border-neutral-300'>
                                <CardHeader className="items-center pb-4">
                                    <CardTitle>Overall Evaluation</CardTitle>
                                    <CardDescription>{data.module == 'promis' ? 'PROMIS' : data.module == 'inspire' ? 'InSPIRE' : 'SCORECARD'}</CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="mx-auto aspect-square max-h-[250px]"
                                    >
                                        <RadarChart data={moduleData[index].evaluations}>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent color='#c2410c' className="bg-white text-black border border-gray-300" />}  />
                                            <PolarAngleAxis 
                                                dataKey="title" 
                                            />
                                            <PolarRadiusAxis domain={[0, 5]} />
                                            <PolarGrid />
                                            <Radar
                                            dataKey="rating"
                                            fill="#c2410c"
                                            fillOpacity={0.6}
                                            />
                                        </RadarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        ))
                    }
                    {/* {
                        moduleData.map((data, index) => (
                            <div className='flex flex-col gap-5'>
                                <p className='font-semibold'>Proposal Management Information System+</p>
                                {
                                    evaluations.map((evaluation, index) => (
                                        <div className='flex flex-col gap-3'>
                                            <p>{evaluation}</p>
                                            <div key={index} className='flex gap-2'>
                                                {
                                                    Array.from({ length: Math.floor(data.evaluations[index]) }, (_, index) => (
                                                        <Star key={index} className='fill-orange-600 text-orange-600' />
                                                    ))
                                                }
                                                {
                                                    data.evaluations[index].toFixed(2) - Math.floor(data.evaluations[index]) > 0 ? (
                                                        <div className='flex relative'>
                                                            <Star className="fill-orange-600 text-orange-600"/>
                                                            <div 
                                                                style={{ width: `${(( Math.ceil(data.evaluations[index]) - data.evaluations[index].toFixed(2) )*100)}%` }} 
                                                                className='h-6 absolute right-0 top-0 bg-neutral-50'></div>
                                                        </div>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    } */}
                        {/* {
                            moduleData[0] ? (
                                moduleData[0].averageEval ? (
                                    <div className='flex gap-2'>
                                        {
                                            Array.from({ length: moduleData[0].averageEval }, (_, index) => (
                                                <Star key={index} className='fill-orange-600 text-orange-600' />
                                            ))
                                        }
                                        {
                                            5 - moduleData[0].averageEval.toFixed(2) > 0 ? (
                                                <div className='flex relative'>
                                                    <Star className="fill-orange-600 text-orange-600"/>
                                                    <div 
                                                        style={{ width: `${(5 - moduleData[0].averageEval.toFixed(2))*100}%` }} 
                                                        className='h-6 absolute right-0 top-0 bg-neutral-50'></div>
                                                </div>
                                            ) : null
                                        }
                                        
                                    </div>
                                ) : null
                            ) : null
                        } */}
                </div>
                {/* <div>
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
                </div> */}
            </div>
    </div>
    )
}