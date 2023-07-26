import IValue from '@lib/IValue'
import IExpression from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'

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

  constructor(public operation: Operator, public expr1: IExpression, public expr2: IExpression) {}

  public eval(): IValue {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const isNumber = value1 instanceof NumberValue || value2 instanceof NumberValue
    const compareString = isNumber ? 0 : value1.asString().localeCompare(value2.asString())
    const number1 = isNumber ? value1.asNumber() : compareString
    const number2 = isNumber ? value2.asNumber() : 0

    const result = (() => {
      switch (this.operation) {
        case Operator.EQUALS:
          return number1 == number2
        case Operator.NOT_EQUALS:
          return number1 != number2
        case Operator.LT:
          return number1 < number2
        case Operator.LTEQ:
          return number1 <= number2
        case Operator.GT:
          return number1 > number2
        case Operator.GTEQ:
          return number1 >= number2
        case Operator.AND:
          return number1 != 0 && number2 != 0
        case Operator.OR:
          return number1 != 0 || number2 != 0
        default:
          throw new Error('Operation ' + this.operation + ' is not supported')
      }
    })()

    return BooleanValue[result ? 'TRUE' : 'FALSE']
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.expr1} ${this.operation} ${this.expr2}`
  }
}
