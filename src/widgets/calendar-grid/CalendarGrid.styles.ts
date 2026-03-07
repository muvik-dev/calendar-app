import styled from "@emotion/styled"

export const CalendarContainer = styled.div`
    position: relative;
    padding: 16px;
`

export const CalendarHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
`

export const SearchInput = styled.input`
    padding: 6px 8px;
    font-size: 13px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 200px;

    &:focus {
        outline: none;
        border-color: #0070f3;
        box-shadow: 0 0 0 1px rgba(0, 112, 243, 0.2);
    }
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