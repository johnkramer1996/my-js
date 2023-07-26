import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import IVisitor from './IVisitor'

export default class LogStatement implements IStatement {
  constructor(public expression: IExpression, public newLine: boolean = false) {}

  public execute(): void {
    process.stdout.write(String(this.expression.eval().asString()))
    this.newLine && process.stdout.write('\n')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'log ' + this.expression
  }
}
