import React, { useState } from 'react';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/Card';
import Textarea from '../ui/Textarea';

interface SessionNoteModalProps {
  isOpen: boolean;
  onSave: (note: string) => void;
  onCancel: () => void;
}

const SessionNoteModal: React.FC<SessionNoteModalProps> = ({ isOpen, onSave, onCancel }) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    setNote(''); // Reset for next time
  };

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleCancel}>
      <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Session Complete!</CardTitle>
          <CardDescription>Add a short note about what you accomplished.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Finished Chapter 3 exercises..."
            aria-label="Session Note"
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Session</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SessionNoteModal;
