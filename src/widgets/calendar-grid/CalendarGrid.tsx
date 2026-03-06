import { generateCalendarDays } from "@/domain/calendar/generateCalendarDays"
import { WEEK_DAYS } from "@/domain/date/week.constants"
import {
    CalendarContainer,
    CalendarGridWrapper,
    SidePanel,
    WeekHeaderCell,
} from "./CalendarGrid.styles"
import { useTaskStore } from "@/store/task/useTaskStore"
import type { Task } from "@/domain/task/task.types"
import { DayCell } from "./DayCell"
import { useMemo, useRef, useState } from "react"
import type { DateKey } from "@/domain/types/date"
import { DayTaskList } from "./DayTaskList"

interface Props {
    year: number
    month: number
}

const initialTasks: Task[] = [
    {
        id: "1",
        title: "Design review",
        date: "2026-03-05",
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: "2",
        title: "Team meeting",
        date: "2026-03-05",
        order: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        id: "3",
        title: "Write documentation",
        date: "2026-03-12",
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
]

function groupTasksByDate(tasks: Task[]) {
    const map = new Map<string, Task[]>()

    for (const task of tasks) {
        if (!map.has(task.date)) {
            map.set(task.date, [])
        }
        map.get(task.date)!.push(task)
    }

    for (const [, value] of map) {
        value.sort((a, b) => a.order - b.order)
    }

    return map
}

export function CalendarGrid({ year, month }: Props) {
    const days = generateCalendarDays(year, month)

    const { tasks, dispatch } = useTaskStore(initialTasks)
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<DateKey | null>(null)
    const sidePanelRef = useRef<HTMLDivElement | null>(null)

    const tasksByDate = groupTasksByDate(tasks)

    const selectedDayTasks = useMemo(
        () => (selectedDate ? tasksByDate.get(selectedDate) ?? [] : []),
        [selectedDate, tasksByDate]
    )

    const todayKey: DateKey = new Date().toISOString().slice(0, 10) as DateKey

    function handleContainerClick(event: React.MouseEvent<HTMLDivElement>) {
        if (!selectedDate) return
        if (!sidePanelRef.current) return

        if (!sidePanelRef.current.contains(event.target as Node)) {
            setSelectedDate(null)
        }
    }

    return (
        <CalendarContainer onClickCapture={handleContainerClick}>
            <CalendarGridWrapper>
                {WEEK_DAYS.map((day) => (
                    <WeekHeaderCell key={day}>{day}</WeekHeaderCell>
                ))}

                {days.map((day) => (
                    <DayCell
                        key={day.date}
                        date={day.date}
                        isCurrentMonth={day.isCurrentMonth}
                        tasks={tasksByDate.get(day.date) ?? []}
                        dispatch={dispatch}
                        draggedTaskId={draggedTaskId}
                        setDraggedTaskId={setDraggedTaskId}
                        onShowAllTasks={(date) => setSelectedDate(date)}
                        isToday={day.date === todayKey}
                    />
                ))}
            </CalendarGridWrapper>

            {selectedDate && (
                <SidePanel ref={sidePanelRef}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3>Tasks for {selectedDate}</h3>
                        <button
                            type="button"
                            onClick={() => setSelectedDate(null)}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <DayTaskList
                        date={selectedDate}
                        tasks={selectedDayTasks}
                        dispatch={dispatch}
                        draggedTaskId={draggedTaskId}
                        setDraggedTaskId={setDraggedTaskId}
                        showHeader={false}
                    />
                </SidePanel>
            )}
        </CalendarContainer>
    )
}