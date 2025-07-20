// Notification.js
import "./notification.css";
import { useNotificationStore } from '../../../strore/notificationStore';
import { Icon } from "@iconify/react/dist/iconify.js";


const Notification = () => {
  const {notifications, removeNotification} = useNotificationStore();

  console.log(notifications)

  return (
    
      notifications.map((notification, index) => (
        <div key={index} className="notification-container">
          
        <div key={notification.id} className={`notification`}>
        {notification.type === 'success' ? <Icon
        icon="mdi:success-circle-outline"
        style={{
        width: "1.4rem",
        height: "1.4rem",
        color: "green"
       
       }} /> : notification.type === 'warning' ? <Icon
       icon="fluent-emoji:warning"
       style={{
       width: "1.4rem",
       height: "1.4rem",
       color: "rgb(225 111 100)"
     
      }} /> : 
      <Icon
        icon="mi:circle-error"
        style={{
        width: "1.4rem",
        height: "1.4rem",
        fontWeight:"bold",
        color: "red"
      
       }} />}
       <div>
          {notification.message}
        </div>
        </div>
        </div>
      ))
    
  );
};

export default Notification;
