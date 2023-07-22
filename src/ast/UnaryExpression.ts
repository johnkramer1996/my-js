import { IExpression } from './IExpression'

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

  public eval(): string | number {
    const value = Number(this.expression.eval())
    switch (this.operation) {
      case Operator.PLUS:
        return Number(value)
      case Operator.NEGATION:
        return -value
      case Operator.LOGICAL_NOT:
        return !!value ? 1 : 0
      case Operator.BITWISE_NOT:
        return ~value
      default:
        throw new Error('Operation ' + this.operation + ' is not supported')
    }
  }
}
