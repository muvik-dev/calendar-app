import { useState } from "react"
import styled from "@emotion/styled"
import type { Task } from "@/domain/task/task.types"
import type { TaskAction } from "@/store/task/task.actions"

interface Props {
    task: Task
    dispatch: React.Dispatch<TaskAction>
    onDragStart: () => void
    onDropOnTask: () => void
    truncate?: boolean
}

export function TaskItem({
                             task,
                             dispatch,
                             onDragStart,
                             onDropOnTask,
                             truncate = false,
                         }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(task.title)

    function handleUpdate() {
        const trimmed = value.trim()

        if (!trimmed) {
            dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
            return
        }

        dispatch({
            type: "UPDATE_TASK",
            payload: {
                id: task.id,
                title: trimmed,
            },
        })

        setIsEditing(false)
    }

    return (

        <Container
            draggable
            onDragStart={onDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDropOnTask()
            }}>
            {isEditing ? (
                <Input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate()
                        if (e.key === "Escape") {
                            setValue(task.title)
                            setIsEditing(false)
                        }
                    }}
                />
            ) : (
                <Title $truncate={truncate} onClick={() => setIsEditing(true)}>
                    {task.title}
                </Title>
            )}

            <DeleteButton
                onClick={() =>
                    dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
                }
            >
                ×
            </DeleteButton>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  background: #f2f2f2;
  padding: 4px;
  border-radius: 4px;
  min-width: 0;
  flex-shrink: 0;
`

const Title = styled.div<{ $truncate: boolean }>`
  flex: 1;
  min-width: 0;
  cursor: pointer;
  ${({ $truncate }) =>
      $truncate &&
      `
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  `}
`

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 12px;

  &:focus {
    outline: none;
  }
`

const DeleteButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 12px;
`