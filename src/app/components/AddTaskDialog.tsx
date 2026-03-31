import { useState, useRef, useEffect } from 'react';
import { Plus, X, Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddTaskDialogProps {
  onAdd: (text: string, category: string, time?: string) => void;
}

const categories = [
  'Morning Routine',
  'Medications',
  'Exercise',
  'Meals',
  'Evening Routine',
  'Other',
];

export function AddTaskDialog({ onAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState('Other');
  const [time, setTime] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTaskText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAdd(taskText.trim(), category, time || undefined);
      setTaskText('');
      setCategory('Other');
      setTime('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-16 text-xl bg-blue-500 hover:bg-blue-600">
          <Plus className="w-7 h-7 mr-2" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label htmlFor="task" className="text-lg">
              Task Description
            </Label>
            <div className="flex gap-2">
              <Input
                id="task"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="e.g., Take morning vitamins"
                className="h-14 text-lg flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                className={`h-14 w-14 flex-shrink-0 ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                aria-label="Voice input"
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-red-500" />
                ) : (
                  <Mic className="w-6 h-6 text-blue-500" />
                )}
              </Button>
            </div>
            {isListening && (
              <p className="text-sm text-blue-600">🎤 Listening... Speak now</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-lg py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="time" className="text-lg">
              Reminder Time (Optional)
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-14 text-lg"
            />
            {time && (
              <p className="text-sm text-gray-500">
                You'll receive a notification at this time
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-14 text-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-14 text-lg bg-blue-500 hover:bg-blue-600">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}