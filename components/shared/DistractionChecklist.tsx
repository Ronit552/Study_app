
import React, { useState } from 'react';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';

interface DistractionChecklistProps {
  onConfirm: () => void;
}

const checklistItems = [
  "Phone is on silent and out of sight.",
  "Unnecessary tabs are closed.",
  "In a quiet environment.",
  "Have water/coffee nearby.",
  "Notified others not to disturb.",
];

const DistractionChecklist: React.FC<DistractionChecklistProps> = ({ onConfirm }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ready to Focus?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">Run through this quick checklist to minimize distractions.</p>
          <div className="space-y-3">
            {checklistItems.map(item => (
              <label key={item} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={!!checkedItems[item]}
                  onChange={() => handleCheckboxChange(item)}
                />
                <span className="text-foreground">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onConfirm}>
            Let's Go!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DistractionChecklist;
