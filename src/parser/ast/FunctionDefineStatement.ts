import Functions, { Function } from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IExpression from './IExpression'
import Variables from '@lib/Variables'
import IValue from '@lib/IValue'
import ArrayValue from '@lib/ArrayValue'

export default class FunctionDefineStatement implements IStatement {
  constructor(public name: string, public func: UserDefinedFunction) {}

  public execute(): void {
    Functions.set(this.name, this.func)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `def ${this.name} ${this.func}`
  }
}
