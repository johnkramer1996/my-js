import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Variables from '@lib/Variables'
import AbstractVisitor from './AbstractVisitor'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import BlockStatement from '@ast/BlockStatement'
import BooleanValue from '@lib/BooleanValue'
import StringValue from '@lib/StringValue'

export default class AssignValidator extends AbstractVisitor {
  private declarations: VariableDeclarator[]
  constructor(blockStatements: BlockStatement) {
    super()
    this.declarations = (blockStatements.statements.filter((i) => i instanceof VaraibleDeclaration) as VaraibleDeclaration[]).map((i) => i.declarations).flat()
  }

  public visit(s: IStatement | IExpression): void {
    super.visit(s)

    if (s instanceof VariableDeclarator) {
      if (this.declarations.find((i) => i === s)) {
        const identifier = s.identifier.getName()
        Variables.define(identifier, StringValue.EMPTY)
      }
    }

    // if (s instanceof AssignmentExpression) {
    //   if (Variables.isExists(s.identifier.getName())) {
    //     throw new Error('Cannot assign value to constant')
    //   }
    // }
  }
}

//
