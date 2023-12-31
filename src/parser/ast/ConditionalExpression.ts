import IValue from '@lib/IValue'
import IExpression from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import NumberValue from '@lib/NumberValue'
import IVisitor from './IVisitor'
import OperationIsNotSupportedException from '@exceptions/OperationIsNotSupportedException'

enum ConditionOperator {
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
  public static Operator = ConditionOperator

  constructor(public operator: ConditionOperator, public left: IExpression, public right: IExpression) {}

  public eval(): IValue {
    const value1 = this.left.eval()
    const value2 = this.right.eval()

    const isBoolean = value1 instanceof BooleanValue || value2 instanceof BooleanValue
    const isNumber = value1 instanceof NumberValue || value2 instanceof NumberValue
    const compareString = isNumber ? 0 : value1.asString().localeCompare(value2.asString())
    const number1 = isBoolean || isNumber ? value1.asNumber() : compareString
    const number2 = isBoolean || isNumber ? value2.asNumber() : 0

    const result = (() => {
      switch (this.operator) {
        case ConditionOperator.EQUALS:
          return number1 === number2
        case ConditionOperator.NOT_EQUALS:
          return number1 !== number2
        case ConditionOperator.LT:
          return number1 < number2
        case ConditionOperator.LTEQ:
          return number1 <= number2
        case ConditionOperator.GT:
          return number1 > number2
        case ConditionOperator.GTEQ:
          return number1 >= number2
        case ConditionOperator.AND:
          return number1 != 0 && number2 != 0
        case ConditionOperator.OR:
          return number1 != 0 || number2 != 0
        default:
          throw new OperationIsNotSupportedException('Operation ' + this.operator + ' is not supported')
      }
    })()

    return BooleanValue[result ? 'TRUE' : 'FALSE']
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.left} ${this.operator} ${this.right}`
  }
}
