import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import IValue from '@lib/IValue'

export default class VariableExpression implements IExpression {
  constructor(private name: string) {}

  public eval(): IValue {
    if (Variables.isExists(this.name)) return Variables.get(this.name)
    throw new Error('Variable does not exists: ' + this.name)
  }

  public toString(): string {
    return this.name
  }
}
