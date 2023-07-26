import AssignmentStatement from '@ast/AssignmentStatement'
import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Variables from '@lib/Variables'
import AbstractVisitor from './AbstractVisitor'

export default class AssignValidator extends AbstractVisitor {
  public visit(s: IStatement | IExpression): void {
    super.visit(s)

    if (s instanceof AssignmentStatement) {
      if (Variables.isExists(s.variable)) {
        throw new Error('Cannot assign value to constant')
      }
    }
  }
}
