import IValue from '@lib/IValue'
import IExpression from './IExpression'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'
import StringValue from '@lib/StringValue'
import ArrayValue from '@lib/ArrayValue'

enum BinaryOperator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  REMAINDER = '%',
  PUSH = '::',
  AND = '&',
  OR = '|',
  XOR = '^',
  LSHIFT = '<<',
  RSHIFT = '>>',
  URSHIFT = '>>>',
}

export default class BinaryExpression implements IExpression {
  public static Operator = BinaryOperator

  constructor(public operation: BinaryOperator, public expr1: IExpression, public expr2: IExpression) {}

  public eval(): IValue {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    if (value1 instanceof StringValue || value2 instanceof StringValue) {
      const string1 = value1.asString()
      switch (this.operation) {
        case BinaryOperator.MULTIPLY: {
          return new StringValue(string1.repeat(value2.asNumber()))
        }
        case BinaryOperator.ADD:
        default:
          return new StringValue(string1 + value2.asString())
      }
    }

    if (value1 instanceof ArrayValue) {
      switch (this.operation) {
        case BinaryOperator.LSHIFT:
          if (!(value2 instanceof ArrayValue)) throw new Error('Cannot merge non array value to array')
          return ArrayValue.merge(value1, value2)
        case BinaryOperator.PUSH:
        default:
          return ArrayValue.add(value1, value2)
      }
    }

    const number1 = value1.asNumber() || 0
    const number2 = value2.asNumber() || 0

    const result = (() => {
      switch (this.operation) {
        case BinaryOperator.ADD:
          return number1 + number2
        case BinaryOperator.SUBTRACT:
          return number1 - number2
        case BinaryOperator.MULTIPLY:
          return number1 * number2
        case BinaryOperator.DIVIDE:
          return number1 / number2
        case BinaryOperator.REMAINDER:
          return number1 % number2
        case BinaryOperator.AND:
          return number1 & number2
        case BinaryOperator.XOR:
          return number1 ^ number2
        case BinaryOperator.OR:
          return number1 | number2
        case BinaryOperator.LSHIFT:
          return number1 << number2
        case BinaryOperator.RSHIFT:
          return number1 >> number2
        case BinaryOperator.URSHIFT:
          return number1 >>> number2
        default:
          throw new Error('Operation ' + this.operation + ' is not supported')
      }
    })()

    return new NumberValue(result)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.expr1} ${this.operation} ${this.expr2}`
  }
}
