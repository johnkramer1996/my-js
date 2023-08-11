import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import IVisitor from './IVisitor'
import { Console } from 'components/App'

export default class LogStatement implements IStatement {
  constructor(public expression: IExpression, public newLine: boolean = false) {}

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
