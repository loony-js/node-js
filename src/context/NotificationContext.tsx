import { createContext, useState, ReactNode, useEffect } from 'react'
import { NotificationContextProps, NotificationState } from 'loony-types'

const NotificationContext = createContext<NotificationContextProps>({
  alert: null,
  setNotificationContext: () => {
    return
  },
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setNotificationContext] = useState<NotificationState>({
    alert: null,
  })

  useEffect(() => {
    if (state.alert) {
      setTimeout(() => {
        setNotificationContext((prevState) => ({
          ...prevState,
          alert: null,
        }))
      }, 5000)
    }
  }, [state.alert])

  return (
    <NotificationContext.Provider value={{ ...state, setNotificationContext }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
