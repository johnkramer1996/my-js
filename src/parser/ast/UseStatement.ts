import IModule from '@lib/IModule'
import IStatement from './IStatement'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import Mathematics from '@lib/modules/Mathematics'
import Std from '@lib/modules/Std'
import Types from '@lib/modules/Types'
import Functional from '@lib/modules/Functional'
import Canvas from '@lib/modules/Canvas'
import Http from '@lib/modules/Http'
import Json from '@lib/modules/Json'

type ModuleConstroctor = new () => IModule

export default class UseStatement implements IStatement {
  private static MODULES = new Map<string, ModuleConstroctor>([
    ['math', Mathematics],
    ['std', Std],
    ['types', Types],
    ['functional', Functional],
    ['canvas', Canvas],
    ['http', Http],
    ['json', Json],
  ])

  constructor(public expression: IExpression) {}

  public execute(): void {
    try {
      const moduleName = this.expression.eval().asString()
      const Module = UseStatement.MODULES.get(moduleName)
      if (!Module) throw new Error(`Module ${moduleName} not found`)

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
