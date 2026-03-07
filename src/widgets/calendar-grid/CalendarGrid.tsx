import { generateCalendarDays } from "@/domain/calendar/generateCalendarDays"
import { WEEK_DAYS } from "@/domain/date/week.constants"
import {
    CalendarContainer,
    CalendarGridWrapper,
    CalendarHeader,
    MonthNav,
    MonthYearTitle,
    NavButton,
    SearchInput,
    SidePanel,
    TodayButton,
    WeekHeaderCell,
} from "./CalendarGrid.styles"
import { useTaskStore } from "@/store/task/useTaskStore"
import type { Task } from "@/domain/task/task.types"
import { DayCell } from "./DayCell"
import { useEffect, useMemo, useRef, useState } from "react"
import type { DateKey } from "@/domain/types/date"
import { DayTaskList } from "./DayTaskList"
import type { Holiday } from "@/domain/holiday/holiday.types"
import { loadHolidays } from "@/api/holidays"

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

interface Props {
    year?: number
    month?: number
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

function getTodayView() {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
}

export function CalendarGrid(props: Props) {
    const today = getTodayView()
    const initialYear = props.year ?? today.year
    const initialMonth = props.month ?? today.month

    const [viewYear, setViewYear] = useState(initialYear)
    const [viewMonth, setViewMonth] = useState(initialMonth)

    const days = generateCalendarDays(viewYear, viewMonth)

    const { tasks, dispatch } = useTaskStore(initialTasks)
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<DateKey | null>(null)
    const [search, setSearch] = useState("")
    const sidePanelRef = useRef<HTMLDivElement | null>(null)

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return tasks
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(query)
        )
    }, [tasks, search])

    const tasksByDate = groupTasksByDate(filteredTasks)

    const [holidaysByDate, setHolidaysByDate] = useState<
        Record<DateKey, Holiday[]>
    >({})

    useEffect(() => {
        loadHolidays().then(r =>
            setHolidaysByDate(r)
        ).catch(e => console.error('Error loading holidays:', e))
    }, [])

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

    function goPrevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11)
            setViewYear((y) => y - 1)
        } else {
            setViewMonth((m) => m - 1)
        }
    }

    function goNextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0)
            setViewYear((y) => y + 1)
        } else {
            setViewMonth((m) => m + 1)
        }
    }

    function goToToday() {
        const { year: y, month: m } = getTodayView()
        setViewYear(y)
        setViewMonth(m)
    }

    return (
        <CalendarContainer onClickCapture={handleContainerClick}>
            <CalendarHeader>
                <MonthNav>
                    <NavButton type="button" onClick={goPrevMonth} aria-label="Previous month">
                        ‹
                    </NavButton>
                    <NavButton type="button" onClick={goNextMonth} aria-label="Next month">
                        ›
                    </NavButton>
                </MonthNav>
                <MonthYearTitle>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </MonthYearTitle>
                <TodayButton type="button" onClick={goToToday}>
                    Today
                </TodayButton>
                <SearchInput
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </CalendarHeader>

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
                        holidays={holidaysByDate[day.date] ?? []}
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
                        holidays={holidaysByDate[selectedDate] ?? []}
                    />
                </SidePanel>
            )}
        </CalendarContainer>
    )
}