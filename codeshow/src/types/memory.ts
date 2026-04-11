export interface MemBlock {
  id: string
  name: string
  value: string
  type: string
  isRef?: boolean
  refTarget?: string
  highlight?: boolean
  gcTarget?: boolean
}

export interface Arrow {
  from: string
  to: string
}

export interface Step {
  step: number
  line: number
  desc: string
  explanation: string
  stack: MemBlock[]
  heap: MemBlock[]
  arrows: Arrow[]
}

export interface User {
  user_id: number
  user_name: string
  login_id: string
  isMember: boolean
  token?: string
}

export interface SavedAnimation {
  animation_code: number
  animation_name: string
  language_id: number
  original_code: string
  json_data: Step[]
  create_date: string
}