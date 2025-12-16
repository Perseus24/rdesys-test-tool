'use client';

import { useEffect, useState } from "react";
import { constructBarGraphPromisTests, fetchModuleComments, getAverageOverallEval, getNumberOfTestEvaluated, getOverallEvalResponses, getOverallEvals, getResponsePerCase, getTestCases, getTotalTestCases, getUserEmails, getUserFeedbacks } from "../lib/supabase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, CircleX, MessageCircleMore, Star } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { title } from "process";




export default function Presentation() {
    const [emails, setEmails] = useState<any[]>([]);
    const [totalTestCases, setTotalTestCases] = useState(0);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [filteredOverallEvalResponses, setFilteredOverallEvalResponses] = useState<any[]>([]);
    const [seeOverallEvalResponses, setSeeOverallEvalResponses] = useState(false);
    const [overallEvalResponses, setOverallEvalResponses] = useState<any[]>([]);
    const [moduleData, setModuleData] = useState<any[]>([]);
    const modules = ['promis', 'inspire', 'scorecard'];
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
    const [chartData, setChartData] = useState<any[]>([
        { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
    ]);
    const [totalEvaluated, setTotalEvaluated] = useState(0);

    const [promisTestCases, setPromisTestCases] = useState<any[]>([]);
    const [promisTestCaseIndex, setPromisTestCaseIndex] = useState(0);
    const [promisResponses, setPromisResponses] = useState<any[]>([]);
    const [promisBarGraph, setPromisBarGraph] = useState<any[]>([]);
    const [promisComments, setPromisComments] = useState<any[]>([]);
    
    const [inspireTestCases, setInspireTestCases] = useState<any[]>([]);
    const [inspireTestCaseIndex, setInspireTestCaseIndex] = useState(0);
    const [inspireResponses, setInspireResponses] = useState<any[]>([]);
    const [inspireBarGraph, setInspireBarGraph] = useState<any[]>([]);
    const [inspireComments, setInspireComments] = useState<any[]>([]);

    const [scorecardTestCases, setScorecardTestCases] = useState<any[]>([]);
    const [scorecardTestCaseIndex, setScorecardTestCaseIndex] = useState(0);
    const [scorecardResponses, setScorecardResponses] = useState<any[]>([]);
    const [scorecardBarGraph, setScorecardBarGraph] = useState<any[]>([]);
    const [scorecardComments, setScorecardComments] = useState<any[]>([]);



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

        async function fetchPromisTestCases() {
            const modules = ['PRMS', 'INSPR', 'SCRD'];
            modules.map(async (item) => {
                const data = await getTestCases('null', item);
                if (data) {
                    if (item === 'PRMS') setPromisTestCases(data);
                    if (item === 'INSPR') setInspireTestCases(data);
                    if (item === 'SCRD') setScorecardTestCases(data);
                }
                const data2 = await getResponsePerCase(item, data[0].id);
                if (data2) {
                    if (item === 'PRMS') setPromisResponses(data2);
                    if (item === 'INSPR') setInspireResponses(data2);
                    if (item === 'SCRD') setScorecardResponses(data2);
                }
            })
        }

        

        async function fetchBarGraphCases() {
            const modules = ['PRMS', 'INSPR', 'SCRD'];
            modules.map(async (item) => {
                const data = await constructBarGraphPromisTests(item);
                let format: any[] = [];
                data?.map(item => {
                    format?.push({
                        title: item.title,
                        is_pass: item.responses.filter((res: any) => res.test_is_pass === true).length,
                        is_fail: item.responses.filter((res: any) => res.test_is_pass === false).length
                    })
                });
                if (item === 'PRMS') setPromisBarGraph(format);
                if (item === 'INSPR') setInspireBarGraph(format);
                if (item === 'SCRD') setScorecardBarGraph(format);
            })
            
        }

        async function fetchPromisComments() {
            const modules = ['PRMS', 'INSPR', 'SCRD'];
            modules.map(async (item) => {
                const data = await fetchModuleComments(item);
                if (item === 'PRMS' && data) setPromisComments(data);
                if (item === 'INSPR' && data) setInspireComments(data);
                if (item === 'SCRD' && data) setScorecardComments(data);
            })
            
        }

        fetchPromisComments();
        fetchBarGraphCases();
        fetchPromisTestCases();
        getTotalEvaluated();
        getDataPerModule();
        fetchEvalResponses();
        fetchFeedbacks();
        getTotal();
        fetchEmails();
    }, []);

    const fetchResponsePerCase = async (module: string, isNext: boolean) => {
        const modules = ['PRMS', 'INSPR', 'SCRD'];

        let id = '';
        if (module == 'PRMS') {
            id = isNext ? promisTestCases[promisTestCaseIndex + 1].id : promisTestCases[promisTestCaseIndex - 1].id
            setPromisTestCaseIndex(isNext ? promisTestCaseIndex + 1 : promisTestCaseIndex - 1);
        } else if (module == 'INSPR') {
            id = isNext ? inspireTestCases[inspireTestCaseIndex + 1].id : inspireTestCases[inspireTestCaseIndex - 1].id
            setInspireTestCaseIndex(isNext ? inspireTestCaseIndex + 1 : inspireTestCaseIndex - 1);
        } else if (module == 'SCRD') {
            id = isNext ? scorecardTestCases[scorecardTestCaseIndex + 1].id : scorecardTestCases[scorecardTestCaseIndex - 1].id
            setScorecardTestCaseIndex(isNext ? scorecardTestCaseIndex + 1 : scorecardTestCaseIndex - 1);
        }
        
        const data = await getResponsePerCase(module, id);
        if (data) setPromisResponses(data);
    }

    const chartConfig2 = {
        visitors: {
            label: "Visitors",
        },
        safari: {
            label: "Safari",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

    const chartConfig = {
            desktop: {
                label: "Desktop",
                color: "var(--chart-1)",
            },
        } satisfies ChartConfig
    
    const pieGraphPromis = [
        { browser: "passed", visitors: 49, fill: "#06b6d4" },   // cyan-500
        { browser: "did_not_pass", visitors: 5, fill: "#f97316" }, // orange-500
        ];
    const pieGraphInspire = [
        { browser: "passed", visitors: 11, fill: "#06b6d4" },   // cyan-500
        { browser: "did_not_pass", visitors: 0, fill: "#f97316" }, // orange-500
        ];
    const pieGraphScorecard = [
        { browser: "passed", visitors: 6, fill: "#06b6d4" },   // cyan-500
        { browser: "did_not_pass", visitors: 0, fill: "#f97316" }, // orange-500
        ];
    const pieGraphConfig = {
        passed: {
            label: "Passed",
        },
        did_not_pass: {
            label: "Did not pass",
            color: "var(--chart-1)",
        },
        } satisfies ChartConfig

    const barChartPromis = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const barChartPromisConfig = {
        is_pass: {
            label: "Is Pass",
            color: "var(--chart-2)",
        },
        is_fail: {
            label: "Is Fail",
            color: "var(--chart-1)",
        },
        // next features
    } satisfies ChartConfig

    const [nextFeaturesIndex, setNextFeaturesIndex] = useState(-1);
    const nextFeatureIndexClick = (index: number) => {
        setNextFeaturesIndex(index + 1);
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") {
            // Increment index
            setNextFeaturesIndex((prevIndex) => prevIndex + 1);
        } else if (e.key === "ArrowLeft") {
            // Decrement index (optional)
            setNextFeaturesIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Clean up
        return () => {
        window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex flex-col font-mono">
            <div className="fixed inset-0 opacity-[0.5] pointer-events-none" 
                style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'}}></div>

            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className='flex flex-col gap-8'>
                    <p className="text-sm text-neutral-500">[ RDESys version = 1.0 ]</p>
                    <h1 className="text-5xl font-light leading-tight mb-4">
                        Alpha Testing,<br/>
                        <span className="italic text-neutral-600">summary</span>
                    </h1>
                    <p className='max-w-2xl text-lg text-neutral-600 leading-relaxed font-sans mb-4'>
                        This presentation summarizes the status of the alpha testing, insights, analytics, comments, and future plans for the RDESys.</p>
                </div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="flex flex-wrap gap-20">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">{emails.length}</p>
                        <p>Testers</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">{totalTestCases}</p>
                        <p>Test Cases</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">{feedbacks.length}</p>
                        <p>Responses</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">{overallEvalResponses.length}</p>
                        <p>Overall Eval Responses</p>
                    </div>
                </div>
            </div>
            {
                moduleData && (
                    <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                        <div className="flex flex-col gap-8 mt-20 w-[1000px]">
                            <div className="w-full flex justify-end gap-8 text-xs">
                                <p>Test Cases</p>
                                <p>Number of Test Cases Evaluated</p>
                                <p>Average Evaluation</p>
                            </div>
                            <div className="flex gap-[300px] items-center">
                                <div className="text-orange-600 font-bold tracking-wide text-6xl">ProMIS<sup>+</sup></div>
                                <div className="flex justify-between gap-40 text-lg">
                                    <p>{moduleData[0]?.total}</p>
                                    <p>{moduleData[0]?.evaluated}</p>
                                    <p>{moduleData[0]?.averageEval.toFixed(2)}/5</p>
                                </div>
                            </div>
                            <div className="flex gap-[290px] items-center">
                                <div className="text-cyan-600 font-bold tracking-wide text-6xl">InSPIRE</div>
                                <div className="flex justify-between gap-40 text-lg">
                                    <p>{moduleData[1]?.total}</p>
                                    <p>{moduleData[1]?.evaluated}</p>
                                    <p>{moduleData[1]?.averageEval.toFixed(2)}/5</p>
                                </div>
                            </div>
                            <div className="flex gap-[225px] items-center">
                                <div className="text-green-600 font-bold tracking-wide text-6xl">Scorecard</div>
                                <div className="flex justify-between gap-40 text-lg">
                                    <p>{moduleData[2]?.total}</p>
                                    <p>{moduleData[2]?.evaluated}</p>
                                    <p>{moduleData[2]?.averageEval.toFixed(2)}/5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }

            {
                    moduleData && (
                <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
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
                                            className="mx-auto aspect-square max-h-[250px] h-[250px]"
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
                </div>
                )
            }

            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-9xl mb-6"><span className="text-cyan-500">RDE</span>Sys</div>
                <div className="text-orange-500 font-bold tracking-wide text-6xl">ProMIS<sup>+</sup></div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-6xl mb-16">ProMIS<sup>+</sup></div>
                <div className="flex flex-wrap gap-20">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">10</p>
                        <p>Testers</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">54</p>
                        <p>Responses</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">24/29</p>
                        <p>Test Cases</p>
                    </div>
                    <ChartContainer
                        config={pieGraphConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] h-[250px] w-[300px] pb-0"
                        >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={pieGraphPromis} dataKey="visitors" label />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="browser" />}
                                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                                />
                        </PieChart>
                        </ChartContainer>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="flex flex-col gap-4 w-full items-start text-sm   ">
                    <p className="text-xl font-medium tracking-wide">{promisTestCases[promisTestCaseIndex]?.title}</p>
                    <p>{promisTestCases[promisTestCaseIndex]?.description}</p>
                    <p className="mt-5 mb-2 italic">Responses:</p>
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {
                            Object.keys(promisResponses).map((key: any) => (
                                <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-neutral-500">Tester</p>
                                        <p>{promisResponses[key]?.tester_email}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-neutral-500">User Experience Rating</p>
                                            <div className='flex gap-2'>
                                                {
                                                    Array.from({ length: promisResponses[key]?.user_experience_rating }, (_, index) => (
                                                        <Star key={index} className='fill-orange-600 text-orange-600' />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {
                                            promisResponses[key]?.remarks !== "" && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex gap-2 items-center text-xs">
                                                            <p className="underline cursor-pointer">View Remarks</p>
                                                            <MessageCircleMore className=" h-4 w-4" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 text-[13px] font-mono">
                                                        <p>{promisResponses[key]?.remarks}</p>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                    {
                                        promisResponses[key]?.test_is_pass ? (
                                            <CircleCheck className="absolute top-5 right-5 fill-green-800 text-white" />
                                        ) : (
                                            <CircleX className="absolute top-5 right-5 fill-red-800 text-white" />
                                        )
                                    }
                                    
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full justify-end gap-4">
                        <div className="bg-white text-neutral-800 px-3 py-2 cursor-pointer border border-neutral-800" onClick={() => fetchResponsePerCase('PRMS', false)}>Previous</div>
                        <div className="bg-neutral-800 text-white px-3 py-2 cursor-pointer" onClick={() => fetchResponsePerCase('PRMS', true)}>Next</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <ChartContainer config={barChartPromisConfig} className=" h-[250px] w-full">
                    <BarChart accessibilityLayer data={promisBarGraph}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="title"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent  />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                        dataKey="is_pass"
                        stackId="a"
                        fill="var(--color-is_pass)"
                        radius={[0, 0, 4, 4]}
                        />
                        <Bar
                        dataKey="is_fail"
                        stackId="a"
                        fill="var(--color-is_fail)"
                        radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="flex flex-col min-h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-6xl mb-6">ProMIS<sup>+</sup></div>
                <p className="mb-16">Comments</p>
                <div className="grid grid-cols-2 gap-6 w-full">
                    {
                        Object.keys(promisComments).map((key: any) => (
                            <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Tester</p>
                                    <p>{promisComments[key]?.tester_email}</p>
                                </div>
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Remarks</p>
                                    <p>{promisComments[key]?.remarks}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-9xl mb-6"><span className="text-cyan-500">RDE</span>Sys</div>
                <div className="text-cyan-500 font-bold tracking-wide text-6xl">InSPIRE</div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-cyan-500 font-bold tracking-wide text-6xl mb-16">InSPIRE</div>
                <div className="flex flex-wrap gap-20">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">2</p>
                        <p>Testers</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">11</p>
                        <p>Responses</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">9/28</p>
                        <p>Test Cases</p>
                    </div>
                    <ChartContainer
                        config={pieGraphConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] h-[250px] w-[300px] pb-0"
                        >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={pieGraphInspire} dataKey="visitors" label />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="browser" />}
                                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                                />
                        </PieChart>
                        </ChartContainer>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="flex flex-col gap-4 w-full items-start text-sm   ">
                    <p className="text-xl font-medium tracking-wide">{inspireTestCases[inspireTestCaseIndex]?.title}</p>
                    <p>{inspireTestCases[inspireTestCaseIndex]?.description}</p>
                    <p className="mt-5 mb-2 italic">Responses:</p>
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {
                            Object.keys(inspireResponses).map((key: any) => (
                                <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-neutral-500">Tester</p>
                                        <p>{inspireResponses[key]?.tester_email}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-neutral-500">User Experience Rating</p>
                                            <div className='flex gap-2'>
                                                {
                                                    Array.from({ length: inspireResponses[key]?.user_experience_rating }, (_, index) => (
                                                        <Star key={index} className='fill-orange-600 text-orange-600' />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {
                                            inspireResponses[key]?.remarks !== "" && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex gap-2 items-center text-xs">
                                                            <p className="underline cursor-pointer">View Remarks</p>
                                                            <MessageCircleMore className=" h-4 w-4" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 text-[13px] font-mono">
                                                        <p>{inspireResponses[key]?.remarks}</p>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                    {
                                        inspireResponses[key]?.test_is_pass ? (
                                            <CircleCheck className="absolute top-5 right-5 fill-green-800 text-white" />
                                        ) : (
                                            <CircleX className="absolute top-5 right-5 fill-red-800 text-white" />
                                        )
                                    }
                                    
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full justify-end gap-4">
                        <div className="bg-white text-neutral-800 px-3 py-2 cursor-pointer border border-neutral-800" onClick={() => fetchResponsePerCase('INSPR', false)}>Previous</div>
                        <div className="bg-neutral-800 text-white px-3 py-2 cursor-pointer" onClick={() => fetchResponsePerCase('INSPR', true)}>Next</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <ChartContainer config={barChartPromisConfig} className=" h-[250px] w-full">
                    <BarChart accessibilityLayer data={inspireBarGraph}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="title"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent  />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                        dataKey="is_pass"
                        stackId="a"
                        fill="var(--color-is_pass)"
                        radius={[0, 0, 4, 4]}
                        />
                        <Bar
                        dataKey="is_fail"
                        stackId="a"
                        fill="var(--color-is_fail)"
                        radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="flex flex-col min-h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="text-cyan-500 font-bold tracking-wide text-6xl mb-6">InSPIRE</div>
                <p className="mb-16">Comments</p>
                <div className="grid grid-cols-2 gap-6 w-full">
                    {
                        Object.keys(inspireComments).map((key: any) => (
                            <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Tester</p>
                                    <p>{inspireComments[key]?.tester_email}</p>
                                </div>
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Remarks</p>
                                    <p>{inspireComments[key]?.remarks}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-9xl mb-6"><span className="text-cyan-500">RDE</span>Sys</div>
                <div className="text-green-500 font-bold tracking-wide text-6xl">Scorecard</div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-green-500 font-bold tracking-wide text-6xl mb-16">Scorecard</div>
                <div className="flex flex-wrap gap-20">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">1</p>
                        <p>Testers</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">6</p>
                        <p>Responses</p>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <p className="text-6xl font-bold">6/6</p>
                        <p>Test Cases</p>
                    </div>
                    <ChartContainer
                        config={pieGraphConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] h-[250px] w-[300px] pb-0"
                        >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={pieGraphScorecard} dataKey="visitors" label />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="browser" />}
                                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                                />
                        </PieChart>
                        </ChartContainer>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="flex flex-col gap-4 w-full items-start text-sm   ">
                    <p className="text-xl font-medium tracking-wide">{scorecardTestCases[scorecardTestCaseIndex]?.title}</p>
                    <p>{scorecardTestCases[scorecardTestCaseIndex]?.description}</p>
                    <p className="mt-5 mb-2 italic">Responses:</p>
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {
                            Object.keys(scorecardResponses).map((key: any) => (
                                <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-neutral-500">Tester</p>
                                        <p>{scorecardResponses[key]?.tester_email}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-neutral-500">User Experience Rating</p>
                                            <div className='flex gap-2'>
                                                {
                                                    Array.from({ length: scorecardResponses[key]?.user_experience_rating }, (_, index) => (
                                                        <Star key={index} className='fill-orange-600 text-orange-600' />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {
                                            scorecardResponses[key]?.remarks !== "" && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex gap-2 items-center text-xs">
                                                            <p className="underline cursor-pointer">View Remarks</p>
                                                            <MessageCircleMore className=" h-4 w-4" />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 text-[13px] font-mono">
                                                        <p>{scorecardResponses[key]?.remarks}</p>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                    {
                                        scorecardResponses[key]?.test_is_pass ? (
                                            <CircleCheck className="absolute top-5 right-5 fill-green-800 text-white" />
                                        ) : (
                                            <CircleX className="absolute top-5 right-5 fill-red-800 text-white" />
                                        )
                                    }
                                    
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full justify-end gap-4">
                        <div className="bg-white text-neutral-800 px-3 py-2 cursor-pointer border border-neutral-800" onClick={() => fetchResponsePerCase('SCRD', false)}>Previous</div>
                        <div className="bg-neutral-800 text-white px-3 py-2 cursor-pointer" onClick={() => fetchResponsePerCase('SCRD', true)}>Next</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <ChartContainer config={barChartPromisConfig} className=" h-[250px] w-full">
                    <BarChart accessibilityLayer data={scorecardBarGraph}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="title"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent  />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                        dataKey="is_pass"
                        stackId="a"
                        fill="var(--color-is_pass)"
                        radius={[0, 0, 4, 4]}
                        />
                        <Bar
                        dataKey="is_fail"
                        stackId="a"
                        fill="var(--color-is_fail)"
                        radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="flex flex-col min-h-screen items-start justify-center max-w-4xl w-screen mx-auto">
                <div className="text-green-500 font-bold tracking-wide text-6xl mb-6">Scorecard</div>
                <p className="mb-16">Comments</p>
                <div className="grid grid-cols-2 gap-6 w-full">
                    {
                        Object.keys(scorecardComments).map((key: any) => (
                            <div key={key} className="flex flex-col gap-8 p-4 border border-gray-300 w-full relative">
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Tester</p>
                                    <p>{scorecardComments[key]?.tester_email}</p>
                                </div>
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <p className="text-neutral-500">Remarks</p>
                                    <p>{scorecardComments[key]?.remarks}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <div className="text-orange-500 font-bold tracking-wide text-9xl mb-6"><span className="text-cyan-500">RDE</span>Sys</div>
            </div>
            <div className="flex flex-col h-screen items-center justify-center max-w-4xl mx-auto">
                <p className="text-xl">Features included for Alpha Testing v2.0</p>
            </div>
            <div className="flex flex-col h-screen items-center justify-center w-full mx-auto relative">
                <div className="text-orange-500 font-bold tracking-wide text-9xl mb-6"><span className="text-cyan-500">RDE</span>Sys</div>
                <div className="text-orange-500 font-bold tracking-wide text-6xl">ProMIS<sup>+</sup></div>

                <p className={`
                    absolute left-[300px] bottom-[200px] text-lg text-black rotate-29 ${nextFeaturesIndex > 0 ? '' : 'hidden'}    
                `}>
                    Stage 1 Fixes
                </p>
                <p className={
                    `
                    absolute left-[600px] bottom-[200px] text-lg text-black rotate-29 ${nextFeaturesIndex > 1 ? '' : 'hidden'}    
                `}>
                    Stage 6: RDMD Final Submission fixes
                </p>
                <p  className="absolute left-[700px] bottom-10 text-lg text-black -rotate-12">
                    Stage 6 RDMD Admin Edit
                </p>
                <p className="absolute left-[900px] top-[400px] text-lg text-black rotate-20">
                    Stage 7: WFP Submission
                </p>
                <p className="absolute left-[300px] bottom-[400px] text-lg text-black -rotate-14">
                    Stage 7: WFP Admin Approval
                </p>
                <p className="absolute right-[300px] top-[200px] text-lg text-black -rotate-29">
                    Stage 6: Form UI Redesign
                </p>
                <p className="absolute left-[800px] top-[100px] text-lg text-black rotate-12">
                    Externally Funded Form
                </p>
                <p className="absolute right-[50px] top-[50px] text-lg text-black -rotate-1">
                    Special Funded Form
                </p>
                <p className="absolute left-[50px] bottom-[500px] text-lg text-black -rotate-1">
                    Graduate Form
                </p>
                <p className="absolute right-[50px] bottom-[200px] text-lg text-black -rotate-20">
                    Special/External Form Admin Approval
                </p>
            </div>
        </div>
    )
}