// Notification.js
import "./notification.css";
import { useNotificationStore } from '../../../strore/notificationStore';

const Notification = () => {
  const {notifications, removeNotification} = useNotificationStore();


  return (
    
      notifications.map((notification, index) => (
        <div key={index} className="notification-container">
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
        </div>
      ))
    
  );
};

export default Notification;
