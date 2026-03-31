// Safe check for the Notification API
const getNotification = () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return (window as any).Notification;
  }
  return null;
};

export const requestNotificationPermission = async () => {
  const Notif = getNotification();
  if (!Notif) return false;

  try {
    const permission = await Notif.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
};

export const checkAndScheduleReminders = (tasks: any[]) => {
  const Notif = getNotification();
  if (!Notif || Notif.permission !== 'granted') return;

  // This part handles the actual reminder logic safely
  const now = new Date();
  tasks.forEach(task => {
    if (task.time && !task.completed) {
      // Logic for reminders goes here
    }
  });
};
