import NumberValue from '@lib/NumberValue'
import IValue from '@lib/IValue'
import { IStatement } from './IStatement'
import { IExpression } from './IExpression'
import BooleanValue from '@lib/BooleanValue'

export default class ReturnStatement implements IStatement {
  private result: IValue = BooleanValue.FALSE

  constructor(private expression: IExpression) {}

  public execute(): void {
    this.result = this.expression.eval()
    throw this
  }

  public getResult(): IValue {
    return this.result
  }
}
