
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface PendingTasksProps {
  tasks: Task[];
}

const PendingTasks: React.FC<PendingTasksProps> = ({ tasks }) => {
  const navigate = useNavigate();

  // Show top 5 pending tasks on the dashboard
  const tasksToShow = tasks.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
        <CardDescription>A quick look at what's next.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {tasksToShow.length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {tasksToShow.map(task => (
              <div key={task.id} className="flex items-center justify-between text-sm p-2 bg-secondary rounded-md">
                <p className="truncate font-medium" title={task.title}>{task.title}</p>
                <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full whitespace-nowrap ml-2">{task.category}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-4">
             <p className="text-muted-foreground">You're all caught up! 🎉</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/tasks')}>
          Manage All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingTasks;
