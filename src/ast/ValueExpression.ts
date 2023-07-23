import { IExpression } from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'

export class ValueExpression implements IExpression {
  private value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: string | number) {
    this.value = typeof value === 'number' ? new NumberValue(value) : new StringValue(value)
  }

  public eval(): IValue {
    return this.value
  }
}
