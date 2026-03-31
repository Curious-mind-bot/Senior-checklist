export const requestNotificationPermission = async () => {
  // Check if we are in a browser and if Notifications exist
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('Notifications not supported on this device');
    return false;
  }

  try {
    const permission = await window.Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const checkAndScheduleReminders = (tasks: any[]) => {
  // Guard clause: stop immediately if Notifications aren't supported
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  // Double check permission before running logic
  if (window.Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  tasks.forEach(task => {
    if (task.time && !task.completed) {
      // Your scheduling logic lives here safely
    }
  });
};
