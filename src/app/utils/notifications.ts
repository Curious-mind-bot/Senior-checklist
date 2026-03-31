export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleNotification(taskText: string, time: string) {
  if (Notification.permission !== 'granted') {
    return;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  // Schedule the notification
  setTimeout(() => {
    new Notification('Daily Checklist Reminder', {
      body: taskText,
      icon: '/favicon.ico',
      tag: taskText, // Prevents duplicate notifications
    });
  }, timeUntilNotification);
}

export function checkAndScheduleReminders(tasks: Array<{ text: string; time?: string; completed: boolean }>) {
  tasks.forEach(task => {
    if (task.time && !task.completed) {
      scheduleNotification(task.text, task.time);
    }
  });
}
