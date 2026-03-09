import { useState } from "react"
import styled from "@emotion/styled"
import type { DateKey } from "@/domain/types/date.types"
import type { Task } from "@/domain/types/task.types"
import type { TaskAction } from "@/store/task/task.actions"
import type { Holiday } from "@/domain/types/holiday.types"
import { TaskItem } from "@/components/TaskItem"

interface Props {
    date: DateKey
    tasks: Task[]
    dispatch: React.Dispatch<TaskAction>
    draggedTaskId: string | null
    setDraggedTaskId: (id: string | null) => void
    maxVisibleTasks?: number
    showHeader?: boolean
    onShowAllClick?: () => void
    holidays?: Holiday[]
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
    holidays = [],
}: Props) {
    const [title, setTitle] = useState("")

    const hasLimit = typeof maxVisibleTasks === "number"

    const totalItems = holidays.length + tasks.length

    const visibleHolidays = hasLimit ? holidays.slice(0, maxVisibleTasks) : holidays

    const remainingSlots = hasLimit ? Math.max(0, maxVisibleTasks - visibleHolidays.length) : tasks.length

    const visibleTasks = hasLimit ? tasks.slice(0, remainingSlots) : tasks

    const shownCount = visibleHolidays.length + visibleTasks.length
    const hiddenCount = hasLimit ? Math.max(0, totalItems - shownCount) : 0

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

    function getHeaderLabel() {
        const dateObj = new Date(date)
        const day = dateObj.getUTCDate()
        const year = dateObj.getUTCFullYear()
        const month = dateObj.getUTCMonth()

        const lastDayOfMonth = new Date(
            Date.UTC(year, month + 1, 0)
        ).getUTCDate()

        const isFirstOfMonth = day === 1
        const isLastOfMonth = day === lastDayOfMonth

        if (!isFirstOfMonth && !isLastOfMonth) {
            return String(day)
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthLabel = monthNames[month]
        return `${day} ${monthLabel}`
    }

    return (
        <>
            {showHeader && <Header>{getHeaderLabel()}</Header>}

            {visibleHolidays.map((holiday) => (
                <HolidayItem key={holiday.name} $truncate={hasLimit}>
                    {holiday.name}
                </HolidayItem>
            ))}

            {visibleTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    dispatch={dispatch}
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDropOnTask={() => handleDropOnTask(task.order)}
                    truncate={hasLimit}
                />
            ))}

            {hiddenCount > 0 && onShowAllClick && (
                <MoreButton type="button" onClick={onShowAllClick}>
                    +{hiddenCount} more
                </MoreButton>
            )}

            {(!hasLimit || hiddenCount === 0) && (
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
            )}
        </>
    )
}

const Header = styled.div`
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
`

const HolidayItem = styled.div<{ $truncate: boolean }>`
    font-size: 12px;
    padding: 4px;
    border-radius: 4px;
    background: #ffe9c7;
    color: #8a4b00;
    flex-shrink: 0;
    ${({ $truncate }) =>
        $truncate &&
        `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `}
`

const Input = styled.input`
    border: none;
    border-top: 1px solid #eee;
    padding: 4px;
    font-size: 12px;
    flex-shrink: 0;

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
    flex-shrink: 0;
`

