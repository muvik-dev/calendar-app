import { useState } from "react"
import styled from "@emotion/styled"
import { getDayNumber } from "@/domain/date/format.utils"
import type { DateKey } from "@/domain/types/date"
import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "@/store/task/task.actions"
import { TaskItem } from "@/components/task/TaskItem"

interface Props {
    date: DateKey
    tasks: Task[]
    dispatch: React.Dispatch<TaskAction>
    draggedTaskId: string | null
    setDraggedTaskId: (id: string | null) => void
    maxVisibleTasks?: number
    showHeader?: boolean
    onShowAllClick?: () => void
}

export function DayTaskList({
    date,
    tasks,
    dispatch,
    draggedTaskId,
    setDraggedTaskId,
    maxVisibleTasks,
    showHeader = true,
    onShowAllClick,
}: Props) {
    const [title, setTitle] = useState("")

    const visibleTasks =
        typeof maxVisibleTasks === "number"
            ? tasks.slice(0, maxVisibleTasks)
            : tasks
    const hiddenCount =
        typeof maxVisibleTasks === "number"
            ? Math.max(0, tasks.length - maxVisibleTasks)
            : 0

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
        <>
            {showHeader && <Header>{getDayNumber(date)}</Header>}

            {visibleTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    dispatch={dispatch}
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDropOnTask={() => handleDropOnTask(task.order)}
                />
            ))}

            {hiddenCount > 0 && onShowAllClick && (
                <MoreButton type="button" onClick={onShowAllClick}>
                    +{hiddenCount} more
                </MoreButton>
            )}

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
        </>
    )
}

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

const MoreButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 11px;
    color: #0070f3;
    align-self: flex-start;
`

