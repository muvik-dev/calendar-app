import styled from "@emotion/styled"

export const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 120px;
  gap: 4px;
  padding: 16px;
`

export const DayCell = styled.div<{ $isCurrentMonth: boolean }>`
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 12px;

  background-color: ${({ $isCurrentMonth }) =>
    $isCurrentMonth ? "#ffffff" : "#f5f5f5"};
`