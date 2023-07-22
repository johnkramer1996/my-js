import { IExpression } from './IExpression'

enum Operator {
  ADD,
  SUBTRACT,
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

  public eval(): string {
    const value1 = this.expr1.eval()
    const value2 = this.expr2.eval()

    const number1 = Number(value1)
    const number2 = Number(value2)
    switch (this.operation) {
      case Operator.ADD:
        return String(number1 + number2)
      case Operator.SUBTRACT:
        return String(number1 - number2)

      default:
        throw new Error('Operation ' + this.operation + ' is not supported')
    }
  }
}
