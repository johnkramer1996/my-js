import ArrayAccessExpression from '@ast/ArrayAccessExpression'
import ArrayAssignmentStatement from '@ast/ArrayAssignmentStatement'
import ArrayExpression from '@ast/ArrayExpression'
import AssignmentStatement from '@ast/AssignmentStatement'
import BinaryExpression from '@ast/BinaryExpression'
import BlockStatement from '@ast/BlockStatement'
import BreakStatement from '@ast/BreakStatement'
import ConditionalExpression1 from '@ast/ConditionalExpression'
import ContinueStatement from '@ast/ContinueStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import { IExpression } from '@ast/IExpression'
import ForStatement from '@ast/ForStatement'
import FunctionalExpression from '@ast/FunctionalExpression'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import FunctionStatement from '@ast/FunctionStatement'
import IfStatement from '@ast/IfStatement'
import { LogStatement } from '@ast/LogStatement'
import ReturnStatement from '@ast/ReturnStatement'
import { IStatement } from '@ast/IStatement'
import TernaryExpression from '@ast/TernarExpression'
import UnaryExpression from '@ast/UnaryExpression'
import UseStatement from '@ast/UseStatement'
import { ValueExpression } from '@ast/ValueExpression'
import VariableExpression from '@ast/VariableExpression'
import WhileStatement from '@ast/WhileStatement'
import IVisitor from '@ast/IVisitor'

export default abstract class AbstractVisitor implements IVisitor {
  public visit(s: IStatement | IExpression): void {
    if (s instanceof ArrayAccessExpression) {
      for (const index of s.indices) {
        index.accept(this)
      }
    } else if (s instanceof ArrayAssignmentStatement) {
      s.array.accept(this)
      s.expression.accept(this)
    } else if (s instanceof ArrayExpression) {
      for (const index of s.elements) {
        index.accept(this)
      }
    } else if (s instanceof AssignmentStatement) {
      s.expression.accept(this)
    } else if (s instanceof BinaryExpression) {
      s.expr1.accept(this)
      s.expr2.accept(this)
    } else if (s instanceof BlockStatement) {
      for (const statement of s.statements) {
        statement.accept(this)
      }
      // eslint-disable-next-line
    } else if (s instanceof BreakStatement) {
    } else if (s instanceof ConditionalExpression1) {
      s.expr1.accept(this)
      s.expr2.accept(this)
      // eslint-disable-next-line
    } else if (s instanceof ContinueStatement) {
    } else if (s instanceof DoWhileStatement) {
      s.condition.accept(this)
      s.statement.accept(this)
    } else if (s instanceof ForStatement) {
      s.initialization.accept(this)
      s.termination.accept(this)
      s.increment.accept(this)
      s.statement.accept(this)
    } else if (s instanceof FunctionDefineStatement) {
      s.body.accept(this)
    } else if (s instanceof FunctionStatement) {
      s.func.accept(this)
    } else if (s instanceof FunctionalExpression) {
      for (const arg of s.args) {
        arg.accept(this)
      }
    } else if (s instanceof IfStatement) {
      s.expression.accept(this)
      s.ifStatement.accept(this)
      if (s.elseStatement != null) {
        s.elseStatement.accept(this)
      }
    } else if (s instanceof LogStatement) {
      s.expression.accept(this)
    } else if (s instanceof ReturnStatement) {
      s.expression.accept(this)
    } else if (s instanceof TernaryExpression) {
      s.condition.accept(this)
      s.trueExpr.accept(this)
      s.falseExpr.accept(this)
      // eslint-disable-next-line
    } else if (s instanceof UnaryExpression) {
      s.expression.accept(this)
      // eslint-disable-next-line
    } else if (s instanceof ValueExpression) {
      // eslint-disable-next-line
    } else if (s instanceof VariableExpression) {
    } else if (s instanceof WhileStatement) {
      s.condition.accept(this)
      s.statement.accept(this)
    } else if (s instanceof UseStatement) {
      s.expression.accept(this)
    }
  }
}
