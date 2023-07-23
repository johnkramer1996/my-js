import IValue from '@lib/IValue'
import { IExpression } from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import NumberValue from '@lib/NumberValue'

enum Operator {
  EQUALS = '==',
  NOT_EQUALS = '!=',
  LT = '<',
  LTEQ = '<=',
  GT = '>',
  GTEQ = '>=',
  AND = '&&',
  OR = '||',
}

export default class ConditionalExpression implements IExpression {
  public static Operator = Operator

  constructor(private operation: Operator, private expr1: IExpression, private expr2: IExpression) {}

  public eval(): IValue {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const isNumber = value1 instanceof NumberValue || value2 instanceof NumberValue
    const compareString = isNumber ? 0 : value1.asString().localeCompare(value2.asString())
    const number1 = isNumber ? value1.asNumber() : compareString
    const number2 = isNumber ? value2.asNumber() : 0

    let result: boolean
    switch (this.operation) {
      case Operator.EQUALS:
        result = number1 == number2
        break
      case Operator.NOT_EQUALS:
        result = number1 != number2
        break
      case Operator.LT:
        result = number1 < number2
        break
      case Operator.LTEQ:
        result = number1 <= number2
        break
      case Operator.GT:
        result = number1 > number2
        break
      case Operator.GTEQ:
        result = number1 >= number2
        break
      case Operator.AND:
        result = number1 != 0 && number2 != 0
        break
      case Operator.OR:
        result = number1 != 0 || number2 != 0
        break
      default:
        throw new Error('Operation ' + this.operation + ' is not supported')
    }
    return BooleanValue[result ? 'TRUE' : 'FALSE']
  }
}
