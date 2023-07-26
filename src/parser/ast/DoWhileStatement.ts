import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class DoWhileStatement implements IStatement {
  constructor(public condition: IExpression, public statement: IStatement) {}

  public execute(): void {
    Variables.push()
    do {
      this.statement.execute()
    } while (this.condition.eval().asNumber() !== 0)
    Variables.pop()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'do  ' + this.statement + ' while ' + this.condition
  }
}
