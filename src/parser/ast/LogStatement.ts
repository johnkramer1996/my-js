import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import IVisitor from './IVisitor'
import { Console } from 'components/App'
import { Location } from 'parser/Parser'

export default class LogStatement implements IStatement {
  public start: number
  public end: number
  constructor(public expression: IExpression, public newLine: boolean = false) {
    Location.endStatement()
    this.start = Location.getStatement().start
    this.end = Location.getStatement().end
  }

  public execute(): void {
    Console.log(this.expression.eval().asString())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'log ' + this.expression
  }
}
