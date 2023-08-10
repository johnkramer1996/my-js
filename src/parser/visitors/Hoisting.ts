import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Variables from '@lib/Variables'
import AbstractVisitor from './AbstractVisitor'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import BlockStatement from '@ast/BlockStatement'
import BooleanValue from '@lib/BooleanValue'
import StringValue from '@lib/StringValue'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import Program from '@ast/Program'

export default class Hoisting extends AbstractVisitor {
  public visit(s: IStatement | IExpression): void {
    // only GLobalivisi
    // if (s instanceof VaraibleDeclaration) s.hoisting()
    // if (s instanceof FunctionDefineStatement) s.hoisting()

    super.visit(s)
  }
}
