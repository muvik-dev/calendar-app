import styled from "@emotion/styled"

export const CalendarContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 100px;
    gap: 4px;
    padding: 16px;
`

export const WeekHeaderCell = styled.div`
    font-weight: 600;
    text-align: center;
    padding: 8px 0;
    background: #fafafa;
    border-bottom: 2px solid #ddd;
`

export const DayCell = styled.div<{ $isCurrentMonth: boolean }>`
  border: 1px solid #ddd;
  padding: 6px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  background-color: ${({ $isCurrentMonth }) =>
    $isCurrentMonth ? "#ffffff" : "#f5f5f5"};
`