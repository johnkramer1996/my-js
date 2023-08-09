import Variables from '@lib/Variables'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import Hoisting from '@visitors/Hoisting'
import FunctionDefineStatement from './FunctionDefineStatement'
import { VaraibleDeclaration, VariableDeclarator } from './AssignmentExpression'
import StringValue from '@lib/StringValue'
import CallStack from '@lib/CallStack'

//(this binding)
//LexicalEnvironment = {
//   Environment Record {
// a : <uninit>
// a : <uninit>
//}
// outer
// }
//VariableEnvironment

// ExecutionContext = {
//   LexicalEnvironment = <ref. to LexicalEnvironment in memory>,
//   VariableEnvironment = <ref. to VariableEnvironment in  memory>,
// }
// Environment Record
// Reference to the outer environment,
// This binding.

export default class Program implements IStatement {
  public statements: IStatement[] = []

  // Phase execute
  public execute(): void {
    for (const statement of this.statements) statement.execute()
  }

  // Phase creation
  public creation() {
    CallStack.enter('GLOBAL')
    this.glovalExecuteContext()
    this.hosting()
    this.bindThis()
  }

  private glovalExecuteContext() {}

  private hosting() {
    // 1. Creation of the Variable Object (VO)
    // Hoisting in JavaScript
    for (const statement of this.statements) {
      if (statement instanceof VaraibleDeclaration || statement instanceof FunctionDefineStatement) statement.hoisting()
    }
  }

  private bindThis() {
    // this
    // 3. Setting the value of the this keyword
    Variables.scope.variables.set('this', { value: new StringValue('window'), kind: 'const' })
  }

  public add(statement: IStatement) {
    this.statements.push(statement)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const result: string[] = []
    for (const statement of this.statements) {
      result.push(statement.toString())
      result.push('\n')
    }
    return result.join('')
  }
}
