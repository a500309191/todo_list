import React, { useState, useRef } from "react";
import { Fetch } from "./Fetch"
import { NoTasks } from "./NoTasks"
import { TasksProps } from "./Schemas"



export const TaskList = () => {
    return (
        <Fetch
            uri = "/api/tasks/"
            renderSuccess = {({data}: TasksProps) => <TaskListView data={data}/>}
        />
    )
}


const TaskListView = (props: TasksProps) => {

    const [tasks, setTasks] = useState(props.data)
    const [edit, setEdit] = useState<number[]>([])

    const [title, setTitle] = useState<string>()
    const [body, setBody] = useState<string>()
    const [date, setDate] = useState<string>()

    const [updateTitle, setUpdateTitle] = useState<string>()
    const [updateBody, setUpdateBody] = useState<string>()
    const [updateDate, setUpdateDate] = useState<string>()

    const titleRefs = useRef<any>([])
    const bodyRefs = useRef<any>([])
    const dateRefs = useRef<any>([])

    const nowStamp = Date.now()


    const updateData = () => {
        console.log("data updated")
        fetch("/api/tasks/")
        .then((response) => { return response.json() })
        .then((result) => { setTasks(result) })
    }

    const removeTask = (id: number) => {
        fetch(`/api/tasks/${id}/`, { method: "DELETE" })
        .then(() => updateData())
    }

    const updateTask = (id: number, title: string, body: string, date: string) => {
        const req_body = JSON.stringify({
            "title": `${updateTitle ? updateTitle : title}`,
            "body": `${updateBody ? updateBody : body}`,
            "expiry_date": `${updateDate ? updateDate : date}`
        })
        fetch(`/api/tasks/${id}/`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: req_body
        })
        .then(response => response.json())
        .then(data => {console.log(data)})
        .then(() => updateData())
        .then(() => setEdit([]))
    }

    const makeTaskDone = (
        id: number,
        title: string,
        body: string,
        date: string,
        done: boolean
    ) => {
        const req_body = JSON.stringify({
            "title": `${updateTitle ? updateTitle : title}`,
            "body": `${updateBody ? updateBody : body}`,
            "expiry_date": `${updateDate ? updateDate : date}`,
            "is_done": `${done ? false : true}`
        })
        fetch(`/api/tasks/${id}/`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: req_body
        })
        .then(response => response.json())
        .then(data => {console.log(data)})
        .then(() => updateData())
        .then(() => setEdit([]))
    }


    const addTask = () => {
        const req_body = JSON.stringify({
            "title": title,
            "body": body,
            "expiry_date": date
        })

        fetch("/api/tasks/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: req_body
        })
        .then(() => updateData())
    }

    const deleteFile = (id: number) => {
        const req_body = JSON.stringify({ "id": id })

        fetch("/file-handler/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: req_body
        })
        .then(() => updateData())
    }

    const uploadFile = (e: any, id: number) => {
        const filesDict = e.target.files

        for (let i = 0; i < filesDict.length; i++) {
            const file = filesDict[i]

            const formData = new FormData()
            formData.append('file', file)
            formData.append('task_id', id.toString())

            fetch('/file-handler/', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => console.log("DATA PUT:", data))
            .then(() => updateData())
        }
    }


    const changeClassName = (className: string, id: number, reverse: boolean=false) => {
        if (reverse) {return edit.includes(id) ? className : `hide ${className}` }
        else { return edit.includes(id) ? `hide ${className}` : className }    
    }

    const isDataChanged = () => {
        if (updateTitle || updateBody || updateDate) { return true } else { return false }
    }

    const isDataFilled = () => {
        if (title && body && date) { return true } else { return false }
    }
    

    return (
        <>
        {tasks.length > 1 ? <div className="task-info">{`${tasks.length} TASKS`}</div> : <></> }
        <div className="window">
        {tasks.length > 0 ?
            <>
            <div className="task-list">

                {tasks.map((task, index) => {

                    const date = new Date(task.expiry_date)
                    const [Y,M,D,h,m] = [
                        date.getFullYear(),
                        `${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}`,
                        `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`,
                        `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}`,
                        `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`,
                    ]

                    const expDateStamp = Date.parse(task.expiry_date)

                    return (
                        <div
                            className={`${nowStamp > expDateStamp && !task.is_done
                                ? "overdue task"
                                : `${task.is_done ? "done task" : "task"}`
                            }`} 
                            key={task.id}
                        >
                            <input
                                className={changeClassName("task-title-update", task.id, true)}
                                maxLength={25} 
                                onChange={e => setUpdateTitle(e.target.value)}
                                defaultValue={task.title}
                                ref={e => (titleRefs.current[index] = e)}
                            />
                            <textarea
                                className={changeClassName("task-body-update", task.id, true)}
                                maxLength={250} 
                                onChange={e => setUpdateBody(e.target.value)}
                                defaultValue={task.body}
                                ref={e => (bodyRefs.current[index] = e)}
                            ></textarea>
                            <div className={changeClassName("task-files-update", task.id, true)}>
                                {task.files.map((file, index) => {
                                    return (
                                        <div
                                            className="task-file-update"
                                            onClick={() => deleteFile(file.id)}
                                            key={file.id}
                                        >file {index+1}</div>
                                    )
                                })}
                            </div>
                            <input
                                className={changeClassName("task-date-update", task.id, true)}
                                type="datetime-local"
                                //onChange={e => setUpdateDate(e.target.value)}
                                onChange={e => {
                                    const datetime = new Date(e.target.value)
                                    setUpdateDate(datetime.toISOString())
                                }}
                                defaultValue={task.expiry_date}
                                ref={e => (dateRefs.current[index] = e)}
                            />
                            <label htmlFor={`file-upload-${task.id}`} className={changeClassName("task-file-upload", task.id, true)}>
                                upload file
                            </label>
                            <input type="file" multiple id={`file-upload-${task.id}`} onChange={e => uploadFile(e, task.id)}/>

                            <div className={changeClassName("task-title", task.id)}>
                            
                                {nowStamp > expDateStamp && !task.is_done
                                ? <div className="overdue-title">OVERDUE&nbsp;&nbsp;</div>
                                : task.is_done ? <div className="done-title">DONE&nbsp;&nbsp;</div> : ""
                                }
                                {task.title}

                            </div>
                            <div className={changeClassName("task-body", task.id)}>{task.body}</div>
                            <div className={changeClassName("task-files", task.id)}>
                                {task.files.map((file, index) => {
                                    return <a href={file.file} className="task-file" key={file.id}>file {index+1}</a> 
                                })}
                            </div>
                            <div className={changeClassName("task-date", task.id)}>{h}:{m} / {D}.{M}.{Y}</div>


                            <div className="task-buttons">
                                {edit.includes(task.id)
                                    ? <>
                                        <div
                                            className={task.is_done ? "red done-button" : "green done-button"}
                                            onClick={() => {
                                                makeTaskDone(task.id, task.title, task.body, date.toISOString(), task.is_done)
                                            }}
                                        >{`${task.is_done ? "UNDO" : "MAKE DONE"}`}
                                        </div>
                                        <div
                                            className="accept-button"
                                            onClick={() => {
                                                if (isDataChanged()) {
                                                    updateTask(task.id, task.title, task.body, date.toISOString())
                                                } else {
                                                    console.log("DATA WAS NOT CHANGED")
                                                    setEdit([])
                                                }
                                            }}
                                        >✔</div>
                                        <div
                                            className="cancel-button"
                                            onClick={() => {
                                                setEdit([])
                                                titleRefs.current[index].value = task.title
                                                bodyRefs.current[index].value = task.body
                                                dateRefs.current[index].value = task.expiry_date
                                            }}
                                        >X</div>
                                    </> : <>
                                        <div
                                            className="edit-button"
                                            onClick={() => {
                                                setEdit([task.id])
                                                setUpdateTitle("")
                                                setUpdateBody("")
                                                setUpdateDate("")
                                            }}
                                        >EDIT</div>
                                        <div
                                            className="remove-button"
                                            onClick={() => removeTask(task.id)}
                                        >REMOVE</div>
                                    </>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            </>
            : <NoTasks />
        }

        <div className="new-task">
            <div className="new-task-header">CREATE NEW TASK:</div>
            <input
                className="new-task-title"
                maxLength={25}
                placeholder="task title"
                onChange={e => setTitle(e.target.value)} />
            <textarea
                className="new-task-body"
                maxLength={250}
                placeholder="task description"
                onChange={e => setBody(e.target.value)}></textarea>
            <input
                className="new-task-date"
                type="datetime-local"
                onChange={e => {
                    const datetime = new Date(e.target.value)  
                    setDate(datetime.toISOString())
                }}
            />
            <div
                className="add-button"
                onClick={() => isDataFilled() ? addTask() : console.log("FILL ALL FIELDS")}
            >ADD NEW</div>
        </div>
        </div>
        </>
    )
}