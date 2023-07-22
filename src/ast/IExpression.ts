import { INode } from '@ast/INode'

export interface IExpression extends INode {
  eval(): string | number
}
