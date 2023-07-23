import IValue from '@lib/IValue'
import { IExpression } from './IExpression'
import NumberValue from '@lib/NumberValue'

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
  public operation: Operator
  public expr1: IExpression
  public expr2: IExpression

  public static Operator = Operator

  constructor(operation: Operator, expr1: IExpression, expr2: IExpression) {
    this.operation = operation
    this.expr1 = expr1
    this.expr2 = expr2
  }

  public eval(): IValue {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const number1 = value1.asNumber()
    const number2 = value2.asNumber()

    let result: number

    switch (this.operation) {
      case Operator.ADD:
        result = number1 + number2
        break
      case Operator.SUBTRACT:
        result = number1 - number2
        break
      case Operator.MULTIPLY:
        result = number1 * number2
        break
      case Operator.DIVIDE:
        result = number1 / number2
        break
      case Operator.REMAINDER:
        result = number1 % number2
        break
      case Operator.AND:
        result = number1 & number2
        break
      case Operator.XOR:
        result = number1 ^ number2
        break
      case Operator.OR:
        result = number1 | number2
        break
      case Operator.LSHIFT:
        result = number1 << number2
        break
      case Operator.RSHIFT:
        result = number1 >> number2
        break
      case Operator.URSHIFT:
        result = number1 >>> number2
        break
      default:
        throw new Error('Operation ' + this.operation + ' is not supported')
    }

    return new NumberValue(result)
  }
}
