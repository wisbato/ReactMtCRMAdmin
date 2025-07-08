import axios from 'axios';

export interface Notification {
  id: number;
  userId: number;
  senderId: number;
  title: string;
  message: string;
  type: string;
  role: string;
  isSeen: boolean;
  metadata: {
    newUserId?: number;
    // Add other possible metadata fields here
  };
  createdAt: string;
  updatedAt: string;
}

export const fetchAllNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get('/api/v1/notification/getAll');
  return response.data.notifications;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await axios.patch(`/api/v1/notification/markAsRead/${id}`);
};

export const deleteNotification = async (id: number): Promise<void> => {
  await axios.delete(`/api/v1/notification/delete/${id}`);
};