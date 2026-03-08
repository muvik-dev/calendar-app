import { useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import type { AvailableCountry } from "@/api/holidays"

const NEAREST_LABEL = "Nearest holidays"
const TASKS_ONLY_LABEL = "Tasks only"
export const TASKS_ONLY = "__tasks_only__"

interface Props {
    value: string | null
    options: AvailableCountry[]
    loading?: boolean
    onChange: (value: string | null) => void
}

export function CountrySelect({
    value,
    options,
    loading = false,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    const displayLabel = value === null
        ? NEAREST_LABEL
        : value === TASKS_ONLY
            ? TASKS_ONLY_LABEL
            : options.find((c) => c.countryCode === value)?.name ?? value

    const filteredOptions = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return options
        return options.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.countryCode.toLowerCase().includes(q)
        )
    }, [options, search])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current?.contains(e.target as Node)) return
            setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <Container ref={containerRef}>
            <Trigger
                type="button"
                onClick={() => setOpen((o) => !o)}
                $open={open}
            >
                {loading && options.length === 0
                    ? "Loading…"
                    : displayLabel}
            </Trigger>
            {open && (
                <Dropdown>
                    <SearchInput
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    <OptionList>
                        <Option
                            $active={value === null}
                            onClick={() => {
                                onChange(null)
                                setOpen(false)
                                setSearch("")
                            }}
                        >
                            {NEAREST_LABEL}
                        </Option>
                        <Option
                            $active={value === TASKS_ONLY}
                            onClick={() => {
                                onChange(TASKS_ONLY)
                                setOpen(false)
                                setSearch("")
                            }}
                        >
                            {TASKS_ONLY_LABEL}
                        </Option>
                        {filteredOptions.map((c) => (
                            <Option
                                key={c.countryCode}
                                $active={value === c.countryCode}
                                onClick={() => {
                                    onChange(c.countryCode)
                                    setOpen(false)
                                    setSearch("")
                                }}
                            >
                                {c.name} ({c.countryCode})
                            </Option>
                        ))}
                    </OptionList>
                </Dropdown>
            )}
        </Container>
    )
}

const Container = styled.div`
    position: relative;
`

const Trigger = styled.button<{ $open: boolean }>`
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    min-width: 160px;
    text-align: left;

    &:hover {
        border-color: #999;
    }
    ${({ $open }) =>
        $open &&
        `
        border-color: #0070f3;
        outline: none;
        box-shadow: 0 0 0 1px #0070f3;
    `}
`

const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 220px;
    max-height: 280px;
    display: flex;
    flex-direction: column;
`

const SearchInput = styled.input`
    padding: 8px 10px;
    font-size: 13px;
    border: none;
    border-bottom: 1px solid #eee;
    border-radius: 4px 4px 0 0;

    &:focus {
        outline: none;
    }
`

const OptionList = styled.div`
    overflow-y: auto;
    max-height: 220px;
`

const Option = styled.div<{ $active: boolean }>`
    padding: 8px 10px;
    font-size: 13px;
    cursor: pointer;
    background: ${({ $active }) => ($active ? "#e6f2ff" : "transparent")};

    &:hover {
        background: ${({ $active }) => ($active ? "#cce5ff" : "#f5f5f5")};
    }
`
