import Functions, { Function } from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import { Identifier } from './ContainerAccessExpression'
import Variables, { Scope } from '@lib/Variables'
import FunctionValue from '@lib/FunctionValue'

export default class FunctionDefineStatement implements IStatement {
  constructor(public name: Identifier, public func: UserDefinedFunction) {}

  public execute(): void {
    this.name.set(new FunctionValue(this.func))
  }

  public hoisting() {
    Variables.hoisting(this.name.getName(), 'func', new FunctionValue(this.func))
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `def ${this.name} ${this.func}`
  }
}
