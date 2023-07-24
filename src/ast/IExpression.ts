import { INode } from '@ast/INode'
import IValue from '@lib/IValue'

export default interface IExpression extends INode {
  eval(): IValue
}
