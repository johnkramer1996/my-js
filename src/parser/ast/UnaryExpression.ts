import IValue from '@lib/IValue'
import IExpression from './IExpression'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'
import OperationIsNotSupportedException from '@exceptions/OperationIsNotSupportedException'
import { instanceOfIAccessible } from './IAccessible'

enum Operator {
  DELETE = 'delete',
  VOID = 'void',
  TYPEOF = 'typeof',
  PLUS = '+',
  NEGATION = '-',
  BITWISE_NOT = '~',
  LOGICAL_NOT = '!',
  AWAIT = 'await',
  INCREMENT_PREFIX = '++var',
  DECREMENT_PREFIX = '--var',
  INCREMENT_POSTFIX = 'var++',
  DECREMENT_POSTFIX = 'var--',
}

export default class UnaryExpression implements IExpression {
  public static Operator = Operator

  constructor(public operation: Operator, public expression: IExpression) {}

  public eval(): IValue {
    const value = this.expression.eval()
    switch (this.operation) {
      case Operator.INCREMENT_PREFIX: {
        const result = new NumberValue(value.asNumber() + 1)
        return instanceOfIAccessible(this.expression) ? this.expression.set(result) : result
      }
      case Operator.DECREMENT_PREFIX: {
        const result = new NumberValue(value.asNumber() - 1)
        return instanceOfIAccessible(this.expression) ? this.expression.set(result) : result
      }
      case Operator.INCREMENT_POSTFIX: {
        const result = new NumberValue(value.asNumber() + 1)
        return instanceOfIAccessible(this.expression) ? (this.expression.set(result), value) : result
      }
      case Operator.DECREMENT_POSTFIX: {
        const result = new NumberValue(value.asNumber() - 1)
        return instanceOfIAccessible(this.expression) ? (this.expression.set(result), value) : result
      }
      case Operator.PLUS:
        return new NumberValue(value.asNumber())
      case Operator.NEGATION:
        return new NumberValue(-value.asNumber())
      case Operator.LOGICAL_NOT:
        return new NumberValue(!!value.asNumber() ? 1 : 0)
      case Operator.BITWISE_NOT:
        return new NumberValue(~value.asNumber())
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
