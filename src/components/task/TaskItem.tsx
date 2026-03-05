import styled from "@emotion/styled"
import type { Task } from "@/domain/task/task.types"

interface Props {
    task: Task
}

export function TaskItem({ task }: Props) {
    return <Container>{task.title}</Container>
}

const Container = styled.div`
  background: #e3f2fd;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  cursor: grab;
  user-select: none;
`