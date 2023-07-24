import { INode } from '@ast/INode'

export default interface IStatement extends INode {
  execute(): void
}
