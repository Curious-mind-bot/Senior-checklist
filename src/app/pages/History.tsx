import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { getHistory, DayHistory } from '../utils/history';
import { SupportFooter } from '../components/SupportFooter';

export function History() {
  const [history, setHistory] = useState<DayHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const day of sortedHistory) {
      if (day.completedTasks === day.totalTasks && day.totalTasks > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getCompletionRate = (completedTasks: number, totalTasks: number) => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getAverageCompletionRate = () => {
    if (history.length === 0) return 0;
    const totalRate = history.reduce((sum, day) => {
      return sum + getCompletionRate(day.completedTasks, day.totalTasks);
    }, 0);
    return Math.round(totalRate / history.length);
  };

  const streak = calculateStreak();
  const averageRate = getAverageCompletionRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Navigation />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-3xl text-gray-800">{streak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rate</p>
                <p className="text-3xl text-gray-800">{averageRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl text-gray-800">Past 30 Days</h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                No history yet. Complete some tasks to start tracking!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((day, index) => {
                const completionRate = getCompletionRate(day.completedTasks, day.totalTasks);
                const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg text-gray-800">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {isToday && (
                            <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-gray-800">
                          {day.completedTasks}/{day.totalTasks}
                        </p>
                        <p className="text-sm text-gray-500">{completionRate}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all ${
                          completionRate === 100
                            ? 'bg-green-500'
                            : completionRate >= 75
                            ? 'bg-blue-500'
                            : completionRate >= 50
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>

                    {/* Task Summary */}
                    <details className="cursor-pointer">
                      <summary className="text-sm text-blue-600 hover:text-blue-700">
                        View tasks ({day.tasks.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {day.tasks.map((task, taskIndex) => (
                          <div
                            key={taskIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                            )}
                            <span className={task.completed ? 'text-gray-600' : 'text-gray-400'}>
                              {task.text}
                            </span>
                            {task.time && (
                              <span className="text-xs text-gray-400 ml-auto">
                                {task.time}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SupportFooter />
      </div>
    </div>
  );
}