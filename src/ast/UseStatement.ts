import IModule from '@lib/IModule'
import { IStatement } from './IStatement'
import { IExpression } from './IExpression'
import Mathematics from 'modules/Mathematics'
import IVisitor from './IVisitor'

type ModuleConstroctor = new () => IModule

export default class UseStatement implements IStatement {
  // prettier-ignore
  private static MODULES = new Map<string, ModuleConstroctor>([
    ['Math', Mathematics],
  ])

  constructor(public expression: IExpression) {}

  public execute(): void {
    try {
      const moduleName = this.expression.eval().asString()
      const Module = UseStatement.MODULES.get(moduleName)
      if (!Module) return

      new Module().init()
    } catch (err) {
      console.log(err)
    }
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'use ' + this.expression
  }
}
