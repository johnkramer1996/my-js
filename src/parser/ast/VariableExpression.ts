import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IValue from '@lib/IValue'
import IVisitor from './IVisitor'
import { VariableDoesNotExistsException } from 'exceptions/ArgumentsMismatchException'

export default class VariableExpression implements IExpression {
  constructor(public name: string) {}

  public eval(): IValue {
    if (Variables.isExists(this.name)) return Variables.get(this.name)
    throw new VariableDoesNotExistsException('Variable does not exists: ' + this.name)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name
  }
}
