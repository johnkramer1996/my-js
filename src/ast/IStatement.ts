import { INode } from '@ast/INode'

export interface IStatement extends INode {
  execute(): void
}
