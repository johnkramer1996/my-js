import { IExpression } from '@ast/IExpression'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import { IStatement } from '@ast/IStatement'
import AbstractVisitor from './AbstractVisitor'

export default class FunctionAdder extends AbstractVisitor {
  public visit(s: IStatement | IExpression): void {
    super.visit(s)

    if (s instanceof FunctionDefineStatement) {
      s.execute()
    }
  }
}
