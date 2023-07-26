import IModule from '@lib/IModule'
import IStatement from './IStatement'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import Mathematics from '@lib/modules/Mathematics'
import Std from '@lib/modules/Std'
import Types from '@lib/modules/Types'

type ModuleConstroctor = new () => IModule

export default class UseStatement implements IStatement {
  private static MODULES = new Map<string, ModuleConstroctor>([
    ['math', Mathematics],
    ['std', Std],
    ['types', Types],
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
