import styled from "@emotion/styled"

export const CalendarContainer = styled.div`
    position: relative;
    padding: 16px;
`

export const CalendarGridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 100px;
    gap: 4px;
`

export const WeekHeaderCell = styled.div`
    font-weight: 600;
    text-align: center;
    padding: 8px 0;
    background: #fafafa;
    border-bottom: 2px solid #ddd;
`

export const SidePanel = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 320px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #fafafa;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 1001;
`