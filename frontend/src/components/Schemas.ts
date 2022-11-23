interface File {
    id: number
    file: string
    task: number
}

interface Task {
    id: number
    files: File[]
    title: string
    body: string
    expiry_date: string
    is_done: boolean
    time_create: string
    time_update: string
}

export interface TasksProps {
    data: Task[]
}

