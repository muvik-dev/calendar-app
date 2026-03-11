import { generateCalendarDays } from "@/utils/generateCalendarDays"
import { MONTH_NAMES, WEEK_DAYS } from "@/domain/constants"
import {
    CalendarContainer,
    CalendarMain,
    CalendarGridWrapper,
    CalendarHeader,
    HeaderLeft,
    HeaderCenter,
    HeaderRight,
    MonthYearTitle,
    NavButton,
    SearchInput,
    SidePanel,
    TodayButton,
    WeekHeaderCell,
} from "@/styles/calendar.style"
import { useTaskStoreWithApi } from "@/store/task/useTaskStoreWithApi"
import { DayCell } from "./DayCell"
import { useEffect, useMemo, useRef, useState } from "react"
import type { DateKey } from "@/domain/types/date.types"
import { DayTaskList } from "./DayTaskList"
import type { Holiday } from "@/domain/types/holiday.types"
import { getAvailableCountries, loadHolidaysForCountry, loadNextHolidaysWorldwide, loadWorldwideHolidays } from "@/api/holidays"
import type { AvailableCountry } from "@/api/holidays"
import { CountrySelect, TASKS_ONLY, WORLDWIDE } from "@/components/CountrySelect"
import { groupTasksByDate } from "@/utils/groupTasksByDate";

function getTodayView() {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
}

export function CalendarGrid() {
    const today = getTodayView()

    const [viewYear, setViewYear] = useState(today.year)
    const [viewMonth, setViewMonth] = useState(today.month)

    const days = generateCalendarDays(viewYear, viewMonth)

    const { tasks, dispatch, loading: tasksLoading, error: tasksError } = useTaskStoreWithApi()
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
    const [holidayCountry, setHolidayCountry] = useState<string | null>(WORLDWIDE)
    const [countries, setCountries] = useState<AvailableCountry[]>([])
    const [countriesLoading, setCountriesLoading] = useState(true)
    const countryYearCacheRef = useRef<Record<string, Record<DateKey, Holiday[]>>>({})

    useEffect(() => {
        getAvailableCountries()
            .then(setCountries)
            .finally(() => setCountriesLoading(false))
    }, [])

    useEffect(() => {
        if (holidayCountry === TASKS_ONLY) {
            Promise.resolve({}).then(setHolidaysByDate)
            return
        }
        if (holidayCountry === null) {
            loadNextHolidaysWorldwide()
                .then(setHolidaysByDate)
                .catch((e) => console.error("Error loading next holidays:", e))
            return
        }
        if (holidayCountry === WORLDWIDE) {
            const cacheKey = `worldwide-${viewYear}`
            const cached = countryYearCacheRef.current[cacheKey]
            if (cached != null) {
                Promise.resolve(cached).then(setHolidaysByDate)
                return
            }
            loadWorldwideHolidays(viewYear)
                .then((byDate) => {
                    countryYearCacheRef.current[cacheKey] = byDate
                    setHolidaysByDate(byDate)
                })
                .catch((e) => console.error("Error loading worldwide holidays:", e))
            return
        }
        const cacheKey = `${viewYear}-${holidayCountry}`
        const cached = countryYearCacheRef.current[cacheKey]
        if (cached != null) {
            Promise.resolve(cached).then(setHolidaysByDate)
            return
        }
        loadHolidaysForCountry(viewYear, holidayCountry)
            .then((byDate) => {
                countryYearCacheRef.current[cacheKey] = byDate
                setHolidaysByDate(byDate)
            })
            .catch((e) => console.error("Error loading country holidays:", e))
    }, [holidayCountry, viewYear])

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
            <CalendarMain>
                <CalendarHeader>
                    <HeaderLeft />
                    <HeaderCenter>
                        <NavButton type="button" onClick={goPrevMonth} aria-label="Previous month">
                            ‹
                        </NavButton>
                        <MonthYearTitle>
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </MonthYearTitle>
                        <NavButton type="button" onClick={goNextMonth} aria-label="Next month">
                            ›
                        </NavButton>
                    </HeaderCenter>
                    <HeaderRight>
                        <TodayButton type="button" onClick={goToToday}>
                            Today
                        </TodayButton>
                        <CountrySelect
                            value={holidayCountry}
                            options={countries}
                            loading={countriesLoading}
                            onChange={setHolidayCountry}
                        />
                        <SearchInput
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </HeaderRight>
                </CalendarHeader>

                {tasksLoading && (
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#666" }}>
                        Loading tasks…
                    </p>
                )}
                {tasksError && (
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#c61a1a" }}>
                        {tasksError}
                    </p>
                )}

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
            </CalendarMain>

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