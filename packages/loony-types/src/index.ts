export * from "./app"
export * from "./doc"
export * from "./user"
export * from "./notification"
export * from "./form"
export * from "./common"

import { VoidReturnFunction, ApiEvent } from "./common"
import { AppState } from "./app"
import {
  ReadBookState,
  EditBlogState,
  EditBookState,
  ReadBlogState,
  DocNode,
} from "./doc"

export const APP_CSS = {
  // linearGradient: 'linear-gradient(to right, #ffffff, #F6F8FC)',
}

export type ApiStatus = {
  status: ApiEvent
  error: string
}

export enum PageStatus {
  IDLE = "IDLE",
  FETCHING = "FETCHING",
  ERROR = "ERROR",
  VIEW_PAGE = "VIEW_PAGE",
  CREATE_NODE = "CREATE_NODE",
  EDIT_NODE = "EDIT_NODE",
  DELETE_NODE = "DELETE_NODE",
}

export type PageState = {
  status: PageStatus
  error: string
}

export type AppDispatchAction = React.Dispatch<React.SetStateAction<AppState>>
export type ApiDispatchAction = React.Dispatch<React.SetStateAction<ApiStatus>>
export type PageStatusDispatchAction = React.Dispatch<
  React.SetStateAction<PageState>
>

export type EditNodeComponentProps = {
  heading: string
  state: EditBlogState | EditBookState
  docType: string
  doc_id: number
  FnCallback: (data: DocNode) => void
  onCancel: VoidReturnFunction
  url: string
  isMobile: boolean
}

export type ReadBlogAction = React.Dispatch<React.SetStateAction<ReadBlogState>>
export type EditBlogAction = React.Dispatch<React.SetStateAction<EditBlogState>>

export type EditBookAction = React.Dispatch<React.SetStateAction<EditBookState>>
export type ReadBookAction = React.Dispatch<React.SetStateAction<ReadBookState>>
