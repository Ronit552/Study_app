
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Icon from '../shared/Icon';
import { icons } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  iconName: keyof typeof icons;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconName, colorClass = 'text-primary' }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon name={iconName} className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
