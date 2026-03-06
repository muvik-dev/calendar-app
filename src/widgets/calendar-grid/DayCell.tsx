import { useState } from "react"
import styled from "@emotion/styled"
import { getDayNumber } from "@/domain/date/format.utils"
import type { DateKey } from "@/domain/types/date"
import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "@/store/task/task.actions"
import { TaskItem } from "@/components/task/TaskItem"

interface Props {
    date: DateKey
    isCurrentMonth: boolean
    tasks: Task[]
    dispatch: React.Dispatch<TaskAction>

    draggedTaskId: string | null
    setDraggedTaskId: (id: string | null) => void
}

export function DayCell({
    date,
    isCurrentMonth,
    tasks,
    dispatch,
    draggedTaskId,
    setDraggedTaskId,
}: Props) {
    const [title, setTitle] = useState("")

    function handleAddTask() {
        if (!title.trim()) return

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            order: tasks.length,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }

        dispatch({ type: "ADD_TASK", payload: newTask })
        setTitle("")
    }

    function handleDropOnDayEnd() {
        if (!draggedTaskId) return

        const isSameDay = tasks.some((t) => t.id === draggedTaskId)

        if (isSameDay) {
            dispatch({
                type: "REORDER_TASK",
                payload: {
                    id: draggedTaskId,
                    newOrder: tasks.length - 1,
                },
            })
        } else {
            dispatch({
                type: "MOVE_TASK",
                payload: {
                    id: draggedTaskId,
                    toDate: date,
                    newOrder: tasks.length,
                },
            })
        }

        setDraggedTaskId(null)
    }

    function handleDropOnTask(targetOrder: number) {
        if (!draggedTaskId) return

        const draggedTask = tasks.find((t) => t.id === draggedTaskId)

        if (draggedTask && draggedTask.date === date) {
            dispatch({
                type: "REORDER_TASK",
                payload: {
                    id: draggedTaskId,
                    newOrder: targetOrder,
                },
            })
        } else {
            dispatch({
                type: "MOVE_TASK",
                payload: {
                    id: draggedTaskId,
                    toDate: date,
                    newOrder: targetOrder,
                },
            })
        }

        setDraggedTaskId(null)
    }

    return (
        <Container
            $isCurrentMonth={isCurrentMonth}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault()
                handleDropOnDayEnd()
            }}
        >
            <Header>{getDayNumber(date)}</Header>

            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    dispatch={dispatch}
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDropOnTask={() => handleDropOnTask(task.order)}
                />
            ))}

            <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleAddTask()
                    }
                }}
                placeholder="+ Add task"
            />
        </Container>
    )
}

const Container = styled.div<{ $isCurrentMonth: boolean }>`
    border: 1px solid #ddd;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    background-color: ${({ $isCurrentMonth }) =>
            $isCurrentMonth ? "#ffffff" : "#f5f5f5"};
`

const Header = styled.div`
    font-size: 14px;
    font-weight: 600;
`

const Input = styled.input`
    border: none;
    border-top: 1px solid #eee;
    padding: 4px;
    font-size: 12px;

    &:focus {
        outline: none;
    }
`