import IValue from '@lib/IValue'
import IExpression from './IExpression'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'
import { OperationIsNotSupportedException } from 'exceptions/ArgumentsMismatchException'

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
  public static Operator = Operator

  constructor(public operation: Operator, public expression: IExpression) {}

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
        throw new OperationIsNotSupportedException('Operation ' + this.operation + ' is not supported')
    }
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.operation}${this.expression}`
  }
}
