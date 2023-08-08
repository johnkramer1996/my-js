import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Variables from '@lib/Variables'
import AbstractVisitor from './AbstractVisitor'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import BlockStatement from '@ast/BlockStatement'
import BooleanValue from '@lib/BooleanValue'
import StringValue from '@lib/StringValue'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'

export default class Hoisting extends AbstractVisitor {
  private declarations: VaraibleDeclaration[]
  private functionDeclarations: FunctionDefineStatement[]
  constructor(blockStatements: BlockStatement) {
    super()
    this.declarations = blockStatements.statements.filter((i) => i instanceof VaraibleDeclaration) as VaraibleDeclaration[]
    this.functionDeclarations = blockStatements.statements.filter((i) => i instanceof FunctionDefineStatement) as FunctionDefineStatement[]
  }

  public visit(s: IStatement | IExpression): void {
    super.visit(s)

    if (s instanceof VaraibleDeclaration) {
      if (this.declarations.find((i) => i === s)) {
        Variables.setKind(s.kind)
        s.declarations.forEach((d) => Variables.hoisting(d.target.getName()))
      }
    }

    if (s instanceof FunctionDefineStatement) {
      if (this.functionDeclarations.find((i) => i === s)) s.execute()
    }
  }
}
