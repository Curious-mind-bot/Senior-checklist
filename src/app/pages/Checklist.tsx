import { useState, useEffect } from 'react';
import { Circle, RotateCcw, Bell, BellOff } from 'lucide-react';
import { TaskItem } from '../components/TaskItem';
import { AddTaskDialog } from '../components/AddTaskDialog';
import { Button } from '../components/ui/button';
import { Navigation } from '../components/Navigation';
import { requestNotificationPermission, checkAndScheduleReminders } from '../utils/notifications';
import { saveHistory } from '../utils/history';
import { SupportFooter } from '../components/SupportFooter';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  time?: string;
}

const defaultTasks: Task[] = [
  { id: '1', text: 'Take morning medication', completed: false, category: 'Medications', time: '08:00' },
  { id: '2', text: 'Drink a glass of water', completed: false, category: 'Morning Routine', time: '08:30' },
  { id: '3', text: 'Go for a 15-minute walk', completed: false, category: 'Exercise', time: '10:00' },
  { id: '4', text: 'Eat breakfast', completed: false, category: 'Meals', time: '09:00' },
  { id: '5', text: 'Eat lunch', completed: false, category: 'Meals', time: '12:00' },
  { id: '6', text: 'Take afternoon medication', completed: false, category: 'Medications', time: '14:00' },
  { id: '7', text: 'Eat dinner', completed: false, category: 'Meals', time: '18:00' },
  { id: '8', text: 'Take evening medication', completed: false, category: 'Medications', time: '20:00' },
  { id: '9', text: 'Read for 20 minutes', completed: false, category: 'Evening Routine', time: '21:00' },
];

export function Checklist() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('seniorChecklist');
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();
    
    // Reset tasks if it's a new day
    if (lastReset !== today) {
      localStorage.setItem('lastReset', today);
      return defaultTasks;
    }
    
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => Notification.permission === 'granted'
  );

  useEffect(() => {
    localStorage.setItem('seniorChecklist', JSON.stringify(tasks));
    saveHistory(tasks);
    
    // Schedule reminders for tasks with times
    if (notificationsEnabled) {
      checkAndScheduleReminders(tasks);
    }
  }, [tasks, notificationsEnabled]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = (text: string, category: string, time?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category,
      time,
    };
    setTasks([...tasks, newTask]);
  };

  const resetChecklist = () => {
    setTasks(tasks.map(task => ({ ...task, completed: false })));
    localStorage.setItem('lastReset', new Date().toDateString());
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        checkAndScheduleReminders(tasks);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Navigation />
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl text-gray-800">
              Daily Checklist
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleNotifications}
                className="w-14 h-14"
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
              >
                {notificationsEnabled ? (
                  <Bell className="w-6 h-6 text-blue-500" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetChecklist}
                className="w-14 h-14"
                aria-label="Reset all tasks"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <div className="text-lg text-gray-600 mb-3">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-700">Progress</span>
              <span className="text-2xl text-blue-600">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {completedCount === totalCount && totalCount > 0 && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-xl text-green-700 text-center">
                🎉 Great job! All tasks completed!
              </p>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-3 mb-6">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No tasks yet. Add your first task below!</p>
            </div>
          ) : (
            tasks
              .sort((a, b) => {
                // Sort by time if both have times
                if (a.time && b.time) {
                  return a.time.localeCompare(b.time);
                }
                // Tasks with times come first
                if (a.time) return -1;
                if (b.time) return 1;
                return 0;
              })
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
          )}
        </div>

        {/* Add Task Button */}
        <AddTaskDialog onAdd={addTask} />

        <SupportFooter />
      </div>
    </div>
  );
}