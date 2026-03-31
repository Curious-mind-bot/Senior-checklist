export interface DayHistory {
  date: string;
  totalTasks: number;
  completedTasks: number;
  tasks: Array<{
    text: string;
    category: string;
    completed: boolean;
    time?: string;
  }>;
}

export function saveHistory(tasks: Array<{ text: string; category: string; completed: boolean; time?: string }>) {
  const today = new Date().toDateString();
  const history: DayHistory[] = JSON.parse(localStorage.getItem('checklistHistory') || '[]');
  
  // Remove today's entry if it exists
  const filteredHistory = history.filter(h => h.date !== today);
  
  // Add today's data
  const todayHistory: DayHistory = {
    date: today,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    tasks: tasks.map(({ text, category, completed, time }) => ({ text, category, completed, time })),
  };
  
  filteredHistory.unshift(todayHistory);
  
  // Keep only last 30 days
  const recentHistory = filteredHistory.slice(0, 30);
  
  localStorage.setItem('checklistHistory', JSON.stringify(recentHistory));
}

export function getHistory(): DayHistory[] {
  return JSON.parse(localStorage.getItem('checklistHistory') || '[]');
}
