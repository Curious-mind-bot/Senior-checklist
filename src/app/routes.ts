import { createBrowserRouter } from 'react-router';
import { Checklist } from './pages/Checklist';
import { History } from './pages/History';
import { MemoryGame } from './pages/MemoryGame';
import { Notepad } from './pages/Notepad';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Checklist,
  },
  {
    path: '/history',
    Component: History,
  },
  {
    path: '/memory-game',
    Component: MemoryGame,
  },
  {
    path: '/notepad',
    Component: Notepad,
  },
]);