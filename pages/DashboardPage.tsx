

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { formatDuration, getPastDates, getDatesForCurrentMonth } from '../lib/time';
import StatCard from '../components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import HistoryChart from '../components/dashboard/HistoryChart';
import GoalProgress from '../components/dashboard/GoalProgress';
import { TimerCategory, DailySummary, TaskStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import FocusPieChart from '../components/dashboard/FocusPieChart';
import PendingTasks from '../components/dashboard/PendingTasks';

const DashboardPage: React.FC = () => {
    const { todaySummary, getSummaryForDate, streaks, goals, tasks } = useAppContext();
    const navigate = useNavigate();
    const [pieChartRange, setPieChartRange] = useState<'today' | 'week' | 'month'>('today');

    const totalToday = todaySummary[TimerCategory.STUDY] + todaySummary[TimerCategory.CODING];
    const past7Days = useMemo(() => getPastDates(7), []);
    const chartData = useMemo(() => past7Days.map(date => getSummaryForDate(date)), [past7Days, getSummaryForDate]);
    
    const weeklyTotal = chartData.reduce((acc, summary) => acc + summary[TimerCategory.STUDY] + summary[TimerCategory.CODING], 0);

    const pendingTasks = useMemo(() => 
        tasks.filter(task => task.status !== TaskStatus.DONE),
    [tasks]);

    const pieChartData = useMemo(() => {
        let summaries: DailySummary[] = [];

        if (pieChartRange === 'today') {
            summaries = [todaySummary];
        } else if (pieChartRange === 'week') {
            summaries = past7Days.map(date => getSummaryForDate(date));
        } else { // 'month'
            const monthDates = getDatesForCurrentMonth();
            summaries = monthDates.map(date => getSummaryForDate(date));
        }

        const totals = summaries.reduce((acc, summary) => {
            acc[TimerCategory.STUDY] += summary[TimerCategory.STUDY];
            acc[TimerCategory.CODING] += summary[TimerCategory.CODING];
            return acc;
        }, { [TimerCategory.STUDY]: 0, [TimerCategory.CODING]: 0 });

        return [
            { name: TimerCategory.STUDY, value: totals[TimerCategory.STUDY] },
            { name: TimerCategory.CODING, value: totals[TimerCategory.CODING] }
        ];

    }, [pieChartRange, todaySummary, getSummaryForDate, past7Days]);


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2 sm:mb-0">Dashboard</h1>
                 <div className="flex space-x-2">
                    <Button onClick={() => navigate('/timers/study')}>
                        Start Studying
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/timers/coding')}>
                        Start Coding
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Today's Total" value={formatDuration(totalToday)} iconName="Clock" />
                <StatCard title="Weekly Total" value={formatDuration(weeklyTotal)} iconName="Calendar" />
                <StatCard title="Current Streak" value={`${streaks.current} Days`} iconName="Flame" colorClass="text-orange-500" />
                <StatCard title="Best Streak" value={`${streaks.best} Days`} iconName="Trophy" colorClass="text-yellow-500" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* History Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Last 7 Days</CardTitle>
                        <CardDescription>Your focus sessions over the past week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HistoryChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Right Column: Goals & Tasks */}
                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Goals</CardTitle>
                            <CardDescription>Your progress towards today's goals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <GoalProgress goals={goals} summary={todaySummary} category={TimerCategory.STUDY} />
                           <GoalProgress goals={goals} summary={todaySummary} category={TimerCategory.CODING} />
                        </CardContent>
                    </Card>
                    <PendingTasks tasks={pendingTasks} />
                </div>
                
                {/* Focus Distribution Pie Chart */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div>
                                <CardTitle>Focus Distribution</CardTitle>
                                <CardDescription>How you've spent your focus time.</CardDescription>
                            </div>
                            <div className="flex space-x-1 bg-muted p-1 rounded-md">
                                <Button 
                                    size="sm" 
                                    variant={pieChartRange === 'today' ? 'default' : 'ghost'} 
                                    onClick={() => setPieChartRange('today')}
                                    className="w-24"
                                >
                                    Today
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={pieChartRange === 'week' ? 'default' : 'ghost'} 
                                    onClick={() => setPieChartRange('week')}
                                    className="w-24"
                                >
                                    This Week
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={pieChartRange === 'month' ? 'default' : 'ghost'} 
                                    onClick={() => setPieChartRange('month')}
                                    className="w-24"
                                >
                                    This Month
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <FocusPieChart data={pieChartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;