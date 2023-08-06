import ArrayAccessExpression from './ContainerAccessExpression'
import ArrayExpression from './ArrayExpression'
import AssignmentExpression from './AssignmentExpression'
import AssignmentStatement from './AssignmentStatement'
import BinaryExpression from './BinaryExpression'
import BlockStatement from './BlockStatement'
import BreakStatement from './BreakStatement'
import ConditionalExpression1 from './ConditionalExpression'
import ContinueStatement from './ContinueStatement'
import DoWhileStatement from './DoWhileStatement'
import ForeachArrayStatement from './ForeachStatement'
import ForStatement from './ForStatement'
import FunctionalExpression from './FunctionalExpression'
import FunctionDefineStatement from './FunctionDefineStatement'
import FunctionReferenceExpression from './FunctionReferenceExpression'
import IfStatement from './IfStatement'
import LogStatement from './LogStatement'
import MapExpression from './MapExpression'
import MatchExpression from './MatchExpression'
import ReturnStatement from './ReturnStatement'
import TernaryExpression from './TernarExpression'
import UnaryExpression from './UnaryExpression'
import UseStatement from './UseStatement'
import ValueExpression from './ValueExpression'
import VariableExpression from './VariableExpression'
import WhileStatement from './WhileStatement'
import ExprStatement from './ExprStatement'
import DestructuringAssignmentStatement from './DestructuringAssignmentStatement'

export default interface IVisitor {
  visit(s: ArrayAccessExpression): void
  visit(s: ArrayExpression): void
  visit(s: AssignmentStatement): void
  visit(s: AssignmentExpression): void
  visit(s: BinaryExpression): void
  visit(s: BlockStatement): void
  visit(s: BreakStatement): void
  visit(s: ConditionalExpression1): void
  visit(s: ContinueStatement): void
  visit(s: DestructuringAssignmentStatement): void
  visit(s: DoWhileStatement): void
  visit(s: ForStatement): void
  visit(s: ForeachArrayStatement): void
  visit(s: FunctionDefineStatement): void
  visit(s: FunctionReferenceExpression): void
  visit(s: ExprStatement): void
  visit(s: FunctionalExpression): void
  visit(s: IfStatement): void
  visit(s: MapExpression): void
  visit(s: MatchExpression): void
  visit(s: LogStatement): void
  visit(s: ReturnStatement): void
  visit(s: TernaryExpression): void
  visit(s: UnaryExpression): void
  visit(s: ValueExpression): void
  visit(s: VariableExpression): void
  visit(s: WhileStatement): void
  visit(s: UseStatement): void
}
