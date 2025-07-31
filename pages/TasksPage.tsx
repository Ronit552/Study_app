
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Task, TaskStatus, TimerCategory } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Icon from '../components/shared/Icon';
import { cn } from '../lib/utils';

const TaskItem: React.FC<{ task: Task, onUpdate: (task: Task) => void, onDelete: (id: string) => void }> = ({ task, onUpdate, onDelete }) => {
    const handleStatusChange = (newStatus: TaskStatus) => {
        onUpdate({ ...task, status: newStatus });
    };

    const statusColor = {
        [TaskStatus.TODO]: 'bg-gray-500',
        [TaskStatus.IN_PROGRESS]: 'bg-blue-500',
        [TaskStatus.DONE]: 'bg-green-500',
    };

    return (
        <div className="flex items-center p-3 bg-secondary rounded-lg justify-between">
            <div className="flex items-center">
                 <input type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary mr-3"
                    checked={task.status === TaskStatus.DONE}
                    onChange={() => handleStatusChange(task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE)}
                />
                <span className={cn('font-medium', task.status === TaskStatus.DONE && 'line-through text-muted-foreground')}>
                    {task.title}
                </span>
                <span className="ml-3 text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">{task.category}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Select 
                    value={task.status} 
                    onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                    className="h-8 text-xs w-32"
                >
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(task.id)}>
                    <Icon name="Trash2" className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        </div>
    );
};

const TasksPage: React.FC = () => {
    const { tasks, addTask, updateTask, deleteTask } = useAppContext();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<TimerCategory | 'Other'>(TimerCategory.STUDY);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask({ title: newTaskTitle.trim(), category: newTaskCategory });
            setNewTaskTitle('');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g., Finish Physics chapter"
                            className="flex-grow"
                        />
                        <Select 
                            value={newTaskCategory}
                            onChange={e => setNewTaskCategory(e.target.value as any)}
                        >
                            <option value={TimerCategory.STUDY}>Study</option>
                            <option value={TimerCategory.CODING}>Coding</option>
                            <option value="Other">Other</option>
                        </Select>
                        <Button type="submit">
                            <Icon name="Plus" className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No tasks yet. Add one to get started!</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TasksPage;
