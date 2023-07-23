import BooleanValue from '@lib/BooleanValue'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class IfStatement implements IStatement {
  constructor(private expression: IExpression, private ifStatement: IStatement, private elseStatement: IStatement | null) {}

  public execute(): void {
    const result = this.expression.eval().asNumber()
    if (result === BooleanValue.TRUE.asNumber()) this.ifStatement.execute()
    else if (this.elseStatement) this.elseStatement.execute()
  }
}
