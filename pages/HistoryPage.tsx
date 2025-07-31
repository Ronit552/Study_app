

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Session, TimerCategory } from '../types';
import { formatDuration } from '../lib/time';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/shared/Icon';
import Papa from 'papaparse';

const HistoryPage: React.FC = () => {
    const { sessions } = useAppContext();
    const [filter, setFilter] = useState<'all' | TimerCategory>('all');
    const [sort, setSort] = useState<{ key: keyof Session; order: 'asc' | 'desc' }>({ key: 'startTime', order: 'desc' });

    const columns: { key: keyof Session; label: string }[] = [
        { key: 'category', label: 'Category' },
        { key: 'startTime', label: 'Start Time' },
        { key: 'duration', label: 'Duration' },
        { key: 'note', label: 'Note' },
    ];

    const filteredAndSortedSessions = useMemo(() => {
        let filtered = sessions;
        if (filter !== 'all') {
            filtered = sessions.filter(s => s.category === filter);
        }
        return filtered.sort((a, b) => {
            const valA = a[sort.key] || '';
            const valB = b[sort.key] || '';
            if (valA < valB) return sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [sessions, filter, sort]);

    const handleSort = (key: keyof Session) => {
        setSort(prev => ({
            key,
            order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const exportToCSV = () => {
        const csv = Papa.unparse(filteredAndSortedSessions);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'focus_sessions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
                <Button onClick={exportToCSV} variant="outline">
                    <Icon name="Download" className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>All Sessions</CardTitle>
                        <div className="flex space-x-2">
                            <Button variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
                            <Button variant={filter === TimerCategory.STUDY ? 'default' : 'secondary'} onClick={() => setFilter(TimerCategory.STUDY)}>Study</Button>
                            <Button variant={filter === TimerCategory.CODING ? 'default' : 'secondary'} onClick={() => setFilter(TimerCategory.CODING)}>Coding</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs uppercase bg-secondary">
                                <tr>
                                    {columns.map(col => (
                                        <th key={col.key} scope="col" className="px-6 py-3" onClick={() => handleSort(col.key)}>
                                            <div className="flex items-center cursor-pointer">
                                                {col.label}
                                                {sort.key === col.key && <Icon name={sort.order === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="ml-1 h-3 w-3" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedSessions.map(session => (
                                    <tr key={session.id} className="border-b border-border">
                                        <td className="px-6 py-4 font-medium text-foreground">{session.category}</td>
                                        <td className="px-6 py-4">{new Date(session.startTime).toLocaleString()}</td>
                                        <td className="px-6 py-4">{formatDuration(session.duration)}</td>
                                        <td className="px-6 py-4 whitespace-pre-wrap">{session.note || <span className="text-muted-foreground/50 italic">No note</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {filteredAndSortedSessions.length === 0 && (
                         <p className="text-center py-8 text-muted-foreground">No sessions found for this filter.</p>
                     )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HistoryPage;