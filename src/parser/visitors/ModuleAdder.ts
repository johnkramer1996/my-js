import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import UseStatement from '@ast/UseStatement'
import AbstractVisitor from './AbstractVisitor'

export default class ModuleAdder extends AbstractVisitor {
  public visit(s: IStatement | IExpression): void {
    super.visit(s)

    if (s instanceof UseStatement) {
      s.execute()
    }
  }
}
