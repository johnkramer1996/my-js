import Variables from '@lib/Variables'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import Hoisting from '@visitors/Hoisting'
import FunctionDefineStatement from './FunctionDefineStatement'
import { VaraibleDeclaration, VariableDeclarator } from './AssignmentExpression'
import StringValue from '@lib/StringValue'
import CallStack from '@lib/CallStack'
import { Location } from 'parser/Parser'
import { Console } from 'components/App'

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
  start: number
  end: number
  constructor(public body: IStatement[]) {
    this.start = 0
    this.end = Location.getPosition().end
  }

  // Phase execute
  public execute(): void {
    this.creation()
    for (const statement of this.body) {
      try {
        statement.execute()
      } catch (e) {
        console.log(e)
        if (e instanceof Error) {
          // Console.error(`${e.name}: ${e.message}`, 0, 0)
        }
      }
    }
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
    for (const statement of this.body) {
      if (statement instanceof VaraibleDeclaration || statement instanceof FunctionDefineStatement) statement.hoisting()
    }
  }

  private bindThis() {
    // this
    // 3. Setting the value of the this keyword
    Variables.scope.variables.set('this', { value: new StringValue('window'), kind: 'const' })
  }

  public add(statement: IStatement) {
    this.body.push(statement)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const result: string[] = []
    for (const statement of this.body) {
      result.push(statement.toString() + '\n')
    }
    return result.join('')
  }
}
