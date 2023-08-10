import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import AbstractVisitor from './AbstractVisitor'
import VariableExpression from '@ast/VariableExpression'
import { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import Literal from '@ast/Literal'
import { Identifier } from '@ast/Identifier'

export default class HighLightVisitor extends AbstractVisitor {
  string = ''

  public visit(s: IStatement | IExpression): void {
    super.visit(s)
  }
}
