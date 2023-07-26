import BooleanValue from '@lib/BooleanValue'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class IfStatement implements IStatement {
  constructor(public expression: IExpression, public ifStatement: IStatement, public elseStatement: IStatement | null) {}

  public execute(): void {
    const result = this.expression.eval().asNumber()
    if (result === BooleanValue.TRUE.asNumber()) this.ifStatement.execute()
    else if (this.elseStatement) this.elseStatement.execute()
  }

  public toString(): string {
    const result: string[] = ['if ', String(this.expression), ' ', String(this.ifStatement)]
    if (this.elseStatement) {
      result.push('\nelse ')
      result.push(String(this.elseStatement))
    }
    return result.join('')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }
}
