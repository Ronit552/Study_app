

import React, { useState, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Goal, ReminderSettings, TimerCategory } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import toast from 'react-hot-toast';
import Select from '../components/ui/Select';

const SettingsPage: React.FC = () => {
    const { goals, updateGoals, allData, importData, reminderSettings, updateReminderSettings } = useAppContext();
    const [currentGoals, setCurrentGoals] = useState<Goal>(goals);
    const [currentReminderSettings, setCurrentReminderSettings] = useState<ReminderSettings>(reminderSettings);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGoalChange = (category: TimerCategory, value: string) => {
        const minutes = parseInt(value, 10);
        if (!isNaN(minutes)) {
            setCurrentGoals(prev => ({ ...prev, [category]: minutes }));
        }
    };

    const handleSaveGoals = () => {
        updateGoals(currentGoals);
        toast.success('Goals updated successfully!');
    };

    const handleReminderSettingsChange = (field: keyof ReminderSettings, value: any) => {
        setCurrentReminderSettings(prev => ({...prev, [field]: value}));
    }

    const handleSaveReminderSettings = () => {
        updateReminderSettings(currentReminderSettings);
        toast.success('Reminder settings updated!');
    }

    const handleExport = () => {
        const data = allData();
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `focus-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        toast.success('Data exported!');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const jsonData = JSON.parse(text);
                        const { success, message } = importData(jsonData);
                        if (success) {
                            toast.success(message);
                            // Refresh settings on page
                            if(jsonData.goals) setCurrentGoals(jsonData.goals);
                            if(jsonData.reminderSettings) setCurrentReminderSettings(jsonData.reminderSettings);
                        } else {
                            toast.error(message);
                        }
                    }
                } catch (error) {
                    toast.error('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Daily Goals</CardTitle>
                    <CardDescription>Set your daily targets for studying and coding (in minutes).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="study-goal" className="font-medium">Study Goal</label>
                        <Input
                            id="study-goal"
                            type="number"
                            value={currentGoals[TimerCategory.STUDY]}
                            onChange={(e) => handleGoalChange(TimerCategory.STUDY, e.target.value)}
                            className="w-32"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="coding-goal" className="font-medium">Coding Goal</label>
                        <Input
                            id="coding-goal"
                            type="number"
                            value={currentGoals[TimerCategory.CODING]}
                            onChange={(e) => handleGoalChange(TimerCategory.CODING, e.target.value)}
                            className="w-32"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveGoals}>Save Goals</Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Health Reminders</CardTitle>
                    <CardDescription>Get reminders to drink water and stretch during long sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="enable-reminders" className="font-medium">Enable Reminders</label>
                        <input
                            id="enable-reminders"
                            type="checkbox"
                            className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={currentReminderSettings.enabled}
                            onChange={(e) => handleReminderSettingsChange('enabled', e.target.checked)}
                        />
                    </div>
                     <div className="flex items-center justify-between">
                        <label htmlFor="reminder-interval" className="font-medium">Reminder Interval (minutes)</label>
                        <Select
                            id="reminder-interval"
                            value={currentReminderSettings.interval}
                            onChange={(e) => handleReminderSettingsChange('interval', parseInt(e.target.value, 10))}
                            className="w-32"
                            disabled={!currentReminderSettings.enabled}
                        >
                            <option value="30">30</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                            <option value="90">90</option>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveReminderSettings}>Save Reminders</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Backup your data or import it to a new device.</CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-4">
                    <Button onClick={handleExport} variant="secondary">Export Data</Button>
                    <Button onClick={handleImportClick} variant="outline">Import Data</Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
