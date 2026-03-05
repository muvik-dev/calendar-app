import { generateCalendarDays } from "@/domain/calendar/generateCalendarDays"
import { CalendarContainer, DayCell } from "./CalendarGrid.styles"

interface Props {
    year: number
    month: number
}

export function CalendarGrid({ year, month }: Props) {
    const days = generateCalendarDays(year, month)

    return (
        <CalendarContainer>
            {days.map((day) => (
                <DayCell key={day.date} $isCurrentMonth={day.isCurrentMonth}>
                    {day.date}
                </DayCell>
            ))}
        </CalendarContainer>
    )
}