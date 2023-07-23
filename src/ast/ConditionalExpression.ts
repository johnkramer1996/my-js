import { IExpression } from './IExpression'

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

  public eval(): string | number {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const isNumber = typeof value1 === 'number' || typeof value2 === 'number'
    const compareString: number = isNumber ? 0 : String(value1).localeCompare(String(value2))
    const number1 = isNumber ? value1 : compareString
    const number2 = isNumber ? value2 : 0

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

    return result ? 1 : 0
  }
}
