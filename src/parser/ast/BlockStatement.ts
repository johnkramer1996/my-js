import Variables from '@lib/Variables'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import AssignValidator from '@visitors/AssignValidator'

export default class BlockStatement implements IStatement {
  public statements: IStatement[] = []

  public execute(): void {
    Variables.push()
    this.accept(new AssignValidator(this))
    for (const statement of this.statements) statement.execute()
    Variables.pop()
  }

  public add(statement: IStatement) {
    this.statements.push(statement)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const result: string[] = ['{\n']
    for (const statement of this.statements) {
      result.push(statement.toString())
      result.push('\n')
    }
    result.push('}')
    return result.join('')
  }
}
