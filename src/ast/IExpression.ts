import { INode } from '@ast/INode'
import IValue from '@lib/IValue'

export interface IExpression extends INode {
  eval(): IValue
}
