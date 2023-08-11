import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import AbstractVisitor from './AbstractVisitor'
import VariableExpression from '@ast/VariableExpression'
import { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import Literal from '@ast/Literal'
import { Identifier } from '@ast/Identifier'
import Program from '@ast/Program'

export default class HighLightVisitor extends AbstractVisitor {
  string = ''

  public visit(s: IStatement | IExpression): void {
    let obj: { [index: string]: any } = {}

    // if (s instanceof Program) {
    //   obj.type = 'Program'
    //   obj.start = s.location.start
    //   obj.end = s.location.end
    //   obj.body = super.visit(s)
    // }
    // if (s instanceof VaraibleDeclaration) {
    //   obj.type = 'VaraibleDeclaration'
    //   obj.start = s.location.start
    //   obj.end = s.location.end
    //   obj.declarations = s.declarations.map(toNode)
    // }
    // if (s instanceof VariableDeclarator) {
    //   obj.type = 'VariableDeclarator'
    //   obj.start = s.location.start
    //   obj.end = s.location.end
    //   obj.declarations = toNode(s.target)
    // }
    // if (s instanceof Identifier) {
    //   obj.type = 'VariableDeclarator'
    //   obj.start = s.location.start
    //   obj.end = s.location.end
    //   obj.declarations = toNode(s.target)
    // }

    // return obj
  }
}
