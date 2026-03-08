import styled from "@emotion/styled"

export const CalendarContainer = styled.div`
    display: flex;
    height: 100vh;
`

export const CalendarMain = styled.div`
    flex: 1;
    min-width: 0;
    padding: 16px;
    overflow: auto;
`

export const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
`

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
`

export const HeaderCenter = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
`

export const NavButton = styled.button`
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;

    &:hover {
        background: #f5f5f5;
        border-color: #999;
    }
`

export const MonthYearTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    padding: 0 15px;
`

export const TodayButton = styled.button`
    border: 1px solid #0070f3;
    background: #0070f3;
    color: #fff;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;

    &:hover {
        background: #0060dd;
        border-color: #0060dd;
    }
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
    width: 320px;
    flex-shrink: 0;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #fafafa;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
`