import { Check, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
    category: string;
    time?: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'bg-white border-gray-300 hover:border-blue-400'
        }`}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check className="w-7 h-7 text-white" strokeWidth={3} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p
          className={`text-xl ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {task.text}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500">{task.category}</p>
          {task.time && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(task.time)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 w-12 h-12 hover:bg-red-50"
        aria-label="Delete task"
      >
        <Trash2 className="w-6 h-6 text-red-500" />
      </Button>
    </div>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}