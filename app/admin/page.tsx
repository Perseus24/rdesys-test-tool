'use client';
import { AlertCircle, CheckCircle, ExternalLink, Loader, Star, ChevronsUpDown  } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAverageOverallEval, getNumberOfTestEvaluated, getOverallEvalResponses, getOverallEvals, getTotalTestCases, getUserEmails, getUserFeedbacks} from '../lib/supabase';
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
import { Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart } from "recharts";
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function Home() {
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
    const [chartData, setChartData] = useState<any[]>([
        { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
    ]);
    const [seeAllTestResponses, setSeeAllTestResponses] = useState(false);
    const [overallEvalResponses, setOverallEvalResponses] = useState<any[]>([]);
    const [seeOverallEvalResponses, setSeeOverallEvalResponses] = useState(false);
    const [activeFiltersOverallEval, setActiveFiltersOverallEval] = useState<any[]>([]);
    const [filteredOverallEvalResponses, setFilteredOverallEvalResponses] = useState<any[]>([]);

    useEffect(() => {
        async function fetchEmails() {
            const emails = await getUserEmails();
            if (emails) setEmails(emails);
        }

        async function getTotal() {
            const data = await getTotalTestCases();
            if (data) setTotalTestCases(data.length);
        }

        async function fetchFeedbacks() {
            const data = await getUserFeedbacks();
            if (data) setFeedbacks(data);
        }

        async function fetchEvalResponses() {
            const data = await getOverallEvalResponses();
            if (data) {
                setOverallEvalResponses(data)
                setFilteredOverallEvalResponses(data);
            };
        }

        async function getTotalEvaluated() {
            const data = await getNumberOfTestEvaluated();
            if (data) {
                setTotalEvaluated(data.length);
                setChartData([
                    {
                    browser: "safari",
                    visitors: data.length,    
                    fill: "var(--color-safari)",
                    },
                ]);
            };
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
                if (data4) formatData.filter(item => item.module === module)[0].evaluations = setChartDataFormat(data4);
            }
            setModuleData(formatData);
        }

        function setChartDataFormat(data: any[]) {
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
        fetchFeedbacks();
        fetchEvalResponses();
    }, [])

    useEffect(() => {
        async function fetchEmails() {
            const data = await getUserFeedbacks(activeUser);
            if (data) setFeedbacks(data);
        }
        fetchEmails();
    }, [activeUser])

    useEffect(() => {
        console.log("changing");
        setFilteredOverallEvalResponses(overallEvalResponses.filter(item => activeFiltersOverallEval.includes(item.title)));
    }, [activeFiltersOverallEval])

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    
    const chartConfig2 = {
        visitors: {
            label: "Visitors",
        },
        safari: {
            label: "Safari",
            color: "var(--chart-2)",
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
                <div className="flex items-center gap-5">
                    <div className="flex flex-1 flex-col gap-4 justify-between border border-gray-200 p-4 text-sm h-min">
                        <p>Number of Testers</p>
                        <p className='text-4xl font-bold'>{emails.length}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 justify-between border border-gray-200 p-4 text-sm h-min">
                        <p>Total Test Cases</p>
                        <p className='text-4xl font-bold'>{totalTestCases}</p>
                    </div>
                    {/* <div className="flex flex-col justify-between border border-gray-200 p-4 text-sm">
                        <p>Number of Test Cases Evaluated</p>
                        <p className='text-4xl font-bold'>{totalEvaluated}</p>
                    </div> */}
                    <ChartContainer
                        config={chartConfig2}
                        className="mx-auto aspect-square max-h-[250px] flex-1"
                        >
                        <RadialBarChart
                            // className='fill-orange-600'
                            data={chartData}
                            endAngle={(chartData[0].visitors / totalTestCases) * 360}
                            innerRadius={80}
                            outerRadius={140}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-gray-200 last:fill-white"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="visitors" background className="fill-orange-600" />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-orange-600 text-4xl font-bold"
                                        >
                                        {chartData[0].visitors.toLocaleString()}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground"
                                        >
                                        Evaluated
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </div>
                {/* <div className='grid grid-cols-2 gap-5'>
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square w-full max-w-[250px] h-[200px]"
                        >
                        <RadialBarChart
                            data={[{title: 'Total Responses', value: totalTestCases}]}
                            endAngle={180}
                            innerRadius={80}
                            outerRadius={130}
                        >
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) - 16}
                                        className="fill-cyan-700 text-2xl font-bold"
                                        >
                                        {totalTestCases}
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 4}
                                        className="fill-muted-foreground"
                                        >
                                        Total Responses
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                            <RadialBar
                            dataKey="value"
                            stackId="a"
                            cornerRadius={5}
                            fill="#0e7490"
                            className="stroke-transparent stroke-2"
                            />
                        </RadialBarChart>
                    </ChartContainer>
                </div> */}
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
                            <Card key={index} className='border border-neutral-300'>
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
                </div>
                <div className='flex flex-col gap-5 w-full my-8'>
                        <p>Test Responses ({feedbacks.length})</p>
                        <Table className='w-full'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className=' text-neutral-600'>Module</TableHead>
                                    <TableHead className='w-[200px] text-neutral-600'>Test Title</TableHead>
                                    <TableHead className='text-neutral-600 font-bold text-center'>Pass</TableHead>
                                    <TableHead className='text-neutral-600 font-bold text-center'>User Experience Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    (seeAllTestResponses ? feedbacks :feedbacks.slice(0, 10)).map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='text-neutral-600'>{data.test_cases.test_id}</TableCell>
                                            <TableCell className='text-neutral-600'>{data.test_cases.title}</TableCell>
                                            <TableCell className='text-neutral-600 text-center font-bold'>{ data.test_is_pass ? <CheckCircle className='text-green-600' /> : <AlertCircle className='text-red-600'/> }</TableCell>
                                            <TableCell>
                                                <div className='flex gap-2'>
                                                    {
                                                        Array.from({ length: data.user_experience_rating }, (_, index) => (
                                                            <Star key={index} className='fill-orange-600 text-orange-600' />
                                                        ))
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <p className='underline text-xs font-medium text-right cursor-pointer' onClick={() => setSeeAllTestResponses(!seeAllTestResponses)}>{seeAllTestResponses ? 'See Less' : 'See All'}</p>
                </div>
                <div className='flex flex-col gap-5 w-full my-8'>
                        <p>Overall Evaluation ({filteredOverallEvalResponses.length})</p>
                        <div className='flex flex-wrap gap-5'>
                            {
                                evaluations.map((data, index) => (
                                    <div 
                                        onClick={() => {
                                            if (activeFiltersOverallEval.includes(data.value)) {
                                                setActiveFiltersOverallEval(activeFiltersOverallEval.filter(item => item != data.value))
                                            } else {
                                                setActiveFiltersOverallEval([...activeFiltersOverallEval, data.value])
                                            }
                                        }}
                                        key={index} 
                                        className={
                                            `text-xs p-2 border border-neutral-200 cursor-pointer hover:bg-neutral-100 ${activeFiltersOverallEval.includes(data.value) ? 'border-orange-600' : ''}`
                                        }>
                                        <p>{data.title}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <Table className='w-full'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className=' text-neutral-600'>Module</TableHead>
                                    <TableHead className='w-[200px] text-neutral-600'>Criteria</TableHead>
                                    <TableHead className='text-neutral-600 font-bold text-center'>Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    (seeOverallEvalResponses ? filteredOverallEvalResponses :filteredOverallEvalResponses.slice(0, 10)).map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='text-neutral-600'>{data.module}</TableCell>
                                            <TableCell className='w-[300px] text-neutral-600'>{evaluations.filter(item => item.value == data.title)[0].title}</TableCell>
                                            <TableCell>
                                                <div className='flex gap-2'>
                                                    {
                                                        Array.from({ length: data.rating }, (_, index) => (
                                                            <Star key={index} className='fill-orange-600 text-orange-600' />
                                                        ))
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-neutral-600'>{data.user_email}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <p className='underline text-xs font-medium text-right cursor-pointer' onClick={() => setSeeOverallEvalResponses(!seeOverallEvalResponses)}>{seeOverallEvalResponses ? 'See Less' : 'See All'}</p>
                </div>
            </div>
    </div>
    )
}