import ArrayAccessExpression from '@ast/ContainerAccessExpression'
import ArrayExpression from '@ast/ArrayExpression'
import BinaryExpression from '@ast/BinaryExpression'
import BlockStatement from '@ast/BlockStatement'
import BreakStatement from '@ast/BreakStatement'
import ConditionalExpression from '@ast/ConditionalExpression'
import ContinueStatement from '@ast/ContinueStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import IExpression from '@ast/IExpression'
import ForStatement from '@ast/ForStatement'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import ExpressionStatement from '@ast/ExpressionStatement'
import IfStatement from '@ast/IfStatement'
import LogStatement from '@ast/LogStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IStatement from '@ast/IStatement'
import TernaryExpression from '@ast/TernarExpression'
import UnaryExpression from '@ast/UnaryExpression'
import UseStatement from '@ast/UseStatement'
import Literal from '@ast/Literal'
import VariableExpression from '@ast/VariableExpression'
import WhileStatement from '@ast/WhileStatement'
import IVisitor from '@ast/IVisitor'
import MapExpression from '@ast/MapExpression'
import ForeachArrayStatement from '@ast/ForeachStatement'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import MatchExpression from '@ast/MatchExpression'
import Program from '@ast/Program'
import CallExpression from '@ast/CallExpression'

export default abstract class AbstractVisitor implements IVisitor {
  public visit(s: IStatement | IExpression): void {
    if (s instanceof ArrayAccessExpression) {
      for (const index of s.indices) index.accept(this)
    } else if (s instanceof ArrayExpression) {
      for (const el of s.elements) el.accept(this)
    } else if (s instanceof AssignmentExpression) {
      s.target.accept(this)
      s.expression.accept(this)
    } else if (s instanceof VaraibleDeclaration) {
      for (const declarator of s.declarations) declarator.accept(this)
    } else if (s instanceof VariableDeclarator) {
      s.id.accept(this)
      s.init && s.init.accept(this)
    } else if (s instanceof BinaryExpression) {
      s.left.accept(this)
      s.right.accept(this)
    } else if (s instanceof Program) {
      for (const statement of s.body) statement.accept(this)
    } else if (s instanceof BlockStatement) {
      for (const statement of s.statements) statement.accept(this)
    } else if (s instanceof BreakStatement) {
    } else if (s instanceof ConditionalExpression) {
      s.left.accept(this)
      s.right.accept(this)
    } else if (s instanceof ContinueStatement) {
    } else if (s instanceof DoWhileStatement) {
      s.condition.accept(this)
      s.statement.accept(this)
    } else if (s instanceof ForStatement) {
      s.init.accept(this)
      s.test.accept(this)
      s.update.accept(this)
      s.statement.accept(this)
    } else if (s instanceof ForeachArrayStatement) {
      s.container.accept(this)
      s.body.accept(this)
    } else if (s instanceof FunctionDefineStatement) {
      // s.func.accept(this)
    } else if (s instanceof ExpressionStatement) {
      s.expr.accept(this)
    } else if (s instanceof CallExpression) {
      s.callee.accept(this)
      for (const arg of s.args) arg.accept(this)
    } else if (s instanceof IfStatement) {
      s.expression.accept(this)
      s.ifStatement.accept(this)
      s.elseStatement?.accept(this)
    } else if (s instanceof LogStatement) {
      s.expression.accept(this)
    } else if (s instanceof ReturnStatement) {
      s.expression.accept(this)
    } else if (s instanceof TernaryExpression) {
      s.condition.accept(this)
      s.trueExpr.accept(this)
      s.falseExpr.accept(this)
    } else if (s instanceof UnaryExpression) {
      s.expression.accept(this)
    } else if (s instanceof Literal) {
    } else if (s instanceof VariableExpression) {
      s.name.accept(this)
    } else if (s instanceof WhileStatement) {
      s.condition.accept(this)
      s.statement.accept(this)
    } else if (s instanceof UseStatement) {
      s.expression.accept(this)
    } else if (s instanceof MapExpression) {
      for (const [key, value] of s.elements.entries()) key.accept(this), value.accept(this)
    } else if (s instanceof MatchExpression) {
      s.expression.accept(this)
    }
  }
}
