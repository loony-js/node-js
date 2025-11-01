// type Indexer = Record<string, string>

// export type JsonObject = Indexer

export type DocNode = {
  uid: number
  title: string
  content: string
  images: string
  user_id: number
  identity: number
  theme: number
  parent_id?: number
  child?: DocNode[]
  created_at: string
  updated_at?: string
}

export type AppendNodeResponse = {
  new_node: DocNode
  update_node: DocNode
}

export type GroupedNodesById = {
  [key: number]: DocNode
}

// Doc State

export enum DocStatus {
  EditNode,
  DeleteNode,
  CreateNode,
  None,
}

type CommonDocState = {
  topNode: DocNode | null
  doc_id: number
}

type ReadDocState = {
  mainNode: DocNode | null
  childNodes: DocNode[]
} & CommonDocState

type ModalState = {
  method: string
  nodeType: number
  title?: string
}

type FormState = {
  method: string // create, update
  nodeType: number
}

type EditDocState = {
  form: FormState
  modal: ModalState
  addNode: DocNode | null
  editNode: DocNode | null
  parentNode: DocNode | null
  deleteNode: DocNode | null
} & ReadDocState

// Blog State

export type ReadBlogState = CommonDocState &
  ReadDocState & { childNodes: DocNode[] }
export type EditBlogState = ReadBlogState &
  EditDocState & { nodeIndex: number | null }

// Book State

type CommonBookState = {
  page_id: number | null
  section_id: number | null
  groupNodesById: GroupedNodesById
  // activeSectionsByPageId: DocNode[]
  // activeSubSectionsBySectionId: DocNode[]
  // allSectionsByPageId: GroupedNodesById
  // allSubSectionsBySectionId: GroupedNodesById
}

export type ReadBookState = CommonBookState & {
  mainNode: DocNode | null
  parentNode: DocNode | null
  navNodes: DocNode[]
  childNodes: DocNode[]
  frontPage: DocNode | null
}

export type EditBookState = ReadBookState & EditDocState

export type UploadImageState = { name: string }
