import { BooleanDispatchAction } from "."
import { AuthContextProps } from "./user"

export type AppState = {
  env: {
    base_url: string
  }
  device: {
    type: string
    width: number
    height: number
  }
  isDark: boolean
  api: any
}

export interface AppContextProps extends AppState {
  setAppContext: React.Dispatch<React.SetStateAction<AppState>>
}

export type AppRouteProps = {
  setMobileNavOpen: BooleanDispatchAction
  mobileNavOpen: boolean
  isMobile: boolean
  authContext: AuthContextProps
  appContext: AppContextProps
}
