import styled from "@emotion/styled"
import type { DateKey } from "@/domain/types/date"
import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "@/store/task/task.actions"
import { DayTaskList } from "./DayTaskList"

interface Props {
    date: DateKey
    isCurrentMonth: boolean
    tasks: Task[]
    dispatch: React.Dispatch<TaskAction>

    draggedTaskId: string | null
    setDraggedTaskId: (id: string | null) => void
    onShowAllTasks: (date: DateKey) => void
    isToday: boolean
}

export function DayCell({
    date,
    isCurrentMonth,
    tasks,
    dispatch,
    draggedTaskId,
    setDraggedTaskId,
    onShowAllTasks,
    isToday,
}: Props) {
    return (
        <Container
            $isCurrentMonth={isCurrentMonth}
            $isToday={isToday}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault()
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
            }}
        >
            <DayTaskList
                date={date}
                tasks={tasks}
                dispatch={dispatch}
                draggedTaskId={draggedTaskId}
                setDraggedTaskId={setDraggedTaskId}
                maxVisibleTasks={2}
                onShowAllClick={() => onShowAllTasks(date)}
            />
        </Container>
    )
}

const Container = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
    border: 1px solid ${({ $isToday }) => ($isToday ? "#0070f3" : "#ddd")};
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    background-color: ${({ $isCurrentMonth, $isToday }) =>
            $isToday
                    ? "#e6f2ff"
                    : $isCurrentMonth
                            ? "#ffffff"
                            : "#f5f5f5"};
`