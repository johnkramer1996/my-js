import IValue from '@lib/IValue'
import { IExpression } from './IExpression'
import NumberValue from '@lib/NumberValue'

enum Operator {
  DELETE = 'delete',
  VOID = 'void',
  TYPEOF = 'typeof',
  PLUS = '+',
  NEGATION = '-',
  BITWISE_NOT = '~',
  LOGICAL_NOT = '!',
  AWAIT = 'await',
}

export default class UnaryExpression implements IExpression {
  public operation: string
  public expression: IExpression

  public static Operator = Operator

  constructor(operation: Operator, expression: IExpression) {
    this.operation = operation
    this.expression = expression
  }

  public eval(): IValue {
    const value = this.expression.eval().asNumber()
    switch (this.operation) {
      case Operator.PLUS:
        return new NumberValue(value)
      case Operator.NEGATION:
        return new NumberValue(-value)
      case Operator.LOGICAL_NOT:
        return new NumberValue(!!value ? 1 : 0)
      case Operator.BITWISE_NOT:
        return new NumberValue(~value)
      default:
        throw new Error('Operation ' + this.operation + ' is not supported')
    }
  }
}
