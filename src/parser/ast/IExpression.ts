import { INode } from '@ast/INode'
import IValue from '@lib/IValue'

export function isIExpression(node: any): node is IExpression {
  return 'eval' in node && 'accept' in node
}

export default interface IExpression extends INode {
  eval(): IValue
}
