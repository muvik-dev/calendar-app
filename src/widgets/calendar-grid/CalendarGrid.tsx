import { generateCalendarDays } from "@/domain/calendar/generateCalendarDays"
import { WEEK_DAYS } from "@/domain/date/week.constants"
import { getDayNumber } from "@/domain/date/format.utils"
import { CalendarContainer, DayCell, WeekHeaderCell } from "./CalendarGrid.styles"

interface Props {
    year: number
    month: number
}

export function CalendarGrid({ year, month }: Props) {
    const days = generateCalendarDays(year, month)

    return (
        <CalendarContainer>
            {WEEK_DAYS.map((day) => (
                <WeekHeaderCell key={day}>{day}</WeekHeaderCell>
            ))}

            {days.map((day) => (
                <DayCell key={day.date} $isCurrentMonth={day.isCurrentMonth}>
                    {getDayNumber(day.date)}
                </DayCell>
            ))}
        </CalendarContainer>
    )
}