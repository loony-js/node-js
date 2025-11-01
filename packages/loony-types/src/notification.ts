export type Alert = null | { status: string; title: string; content: string }
export type NotificationState = {
  alert: Alert
}
export interface NotificationContextProps extends NotificationState {
  setNotificationContext: React.Dispatch<
    React.SetStateAction<NotificationState>
  >
}
