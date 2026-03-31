import { Link, useLocation } from 'react-router';
import { CheckSquare, History, Brain, BookOpen } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white rounded-2xl shadow-lg p-2 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Link
          to="/"
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 sm:px-4 rounded-xl text-base sm:text-lg transition-colors ${
            location.pathname === '/'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CheckSquare className="w-6 h-6" />
          <span className="text-sm sm:text-base">Tasks</span>
        </Link>
        
        <Link
          to="/history"
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 sm:px-4 rounded-xl text-base sm:text-lg transition-colors ${
            location.pathname === '/history'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <History className="w-6 h-6" />
          <span className="text-sm sm:text-base">History</span>
        </Link>

        <Link
          to="/memory-game"
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 sm:px-4 rounded-xl text-base sm:text-lg transition-colors ${
            location.pathname === '/memory-game'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Brain className="w-6 h-6" />
          <span className="text-sm sm:text-base">Brain Game</span>
        </Link>

        <Link
          to="/notepad"
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 sm:px-4 rounded-xl text-base sm:text-lg transition-colors ${
            location.pathname === '/notepad'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-sm sm:text-base">Notes</span>
        </Link>
      </div>
    </nav>
  );
}