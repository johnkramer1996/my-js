import IValue from '@lib/IValue'
import IExpression from './IExpression'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'

enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  REMAINDER = '%',
  AND = '&',
  OR = '|',
  XOR = '^',
  LSHIFT = '<<',
  RSHIFT = '>>',
  URSHIFT = '>>>',
}

export default class BinaryExpression implements IExpression {
  public static Operator = Operator

  constructor(public operation: Operator, public expr1: IExpression, public expr2: IExpression) {}

  public eval(): IValue {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const number1 = value1.asNumber() || 0
    const number2 = value2.asNumber() || 0

    const result = (() => {
      switch (this.operation) {
        case Operator.ADD:
          return number1 + number2
        case Operator.SUBTRACT:
          return number1 - number2
        case Operator.MULTIPLY:
          return number1 * number2
        case Operator.DIVIDE:
          return number1 / number2
        case Operator.REMAINDER:
          return number1 % number2
        case Operator.AND:
          return number1 & number2
        case Operator.XOR:
          return number1 ^ number2
        case Operator.OR:
          return number1 | number2
        case Operator.LSHIFT:
          return number1 << number2
        case Operator.RSHIFT:
          return number1 >> number2
        case Operator.URSHIFT:
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
