import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IValue from '@lib/IValue'
import IVisitor from './IVisitor'
import VariableDoesNotExistsException from '@exceptions/VariableDoesNotExistsException'
import { Identifier } from './FunctionDefineStatement'

export default class VariableExpression implements IExpression {
  constructor(public name: Identifier) {}

  public eval(): IValue {
    if (Variables.isExists(this.name.getName())) {
      const value = Variables.get(this.name.getName())
      return value
    }
    throw new VariableDoesNotExistsException(this.name.getName())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name.getName()
  }
}
