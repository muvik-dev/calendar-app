import { generateCalendarDays } from "@/domain/calendar/generateCalendarDays"
import { WEEK_DAYS } from "@/domain/date/week.constants"
import { CalendarContainer, WeekHeaderCell } from "./CalendarGrid.styles"
import { useTaskStore } from "@/store/task/useTaskStore"
import type { Task } from "@/domain/task/task.types"
import { DayCell } from "./DayCell"

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

    const tasksByDate = groupTasksByDate(tasks)

    return (
        <CalendarContainer>
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
                />
            ))}
        </CalendarContainer>
    )
}