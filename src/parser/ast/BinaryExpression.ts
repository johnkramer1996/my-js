import IValue from '@lib/IValue'
import IExpression from './IExpression'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'
import StringValue from '@lib/StringValue'
import ArrayValue from '@lib/ArrayValue'
import OperationIsNotSupportedException from '@exceptions/OperationIsNotSupportedException'
import TypeException from '@exceptions/TypeException'
import Highlight from 'Highlight'

export enum BinaryOperator {
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
  public start: number
  public end: number
  public static Operator = BinaryOperator

  constructor(public operator: BinaryOperator, public left: IExpression, public right: IExpression) {
    this.start = left.start
    this.end = right.end
  }

  public eval(): IValue {
    const value1 = this.left.eval()
    const value2 = this.right.eval()

    if (value1 instanceof StringValue || value2 instanceof StringValue) {
      const string1 = value1.asString()
      switch (this.operator) {
        case BinaryOperator.MULTIPLY: {
          return new StringValue(string1.repeat(value2.asNumber()))
        }
        case BinaryOperator.ADD:
        default:
          return new StringValue(string1 + value2.asString())
      }
    }

    if (value1 instanceof ArrayValue) {
      switch (this.operator) {
        case BinaryOperator.LSHIFT:
          if (!(value2 instanceof ArrayValue)) throw new TypeException('Cannot merge non array value to array')
          return ArrayValue.merge(value1, value2)
        case BinaryOperator.PUSH:
        default:
          return ArrayValue.add(value1, value2)
      }
    }

    const number1 = value1.asNumber() || 0
    const number2 = value2.asNumber() || 0

    const result = (() => {
      switch (this.operator) {
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
          throw new OperationIsNotSupportedException('Operation ' + this.operator + ' is not supported')
      }
    })()

    return new NumberValue(result)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.left} ${this.operator} ${this.right}`
  }
}
