import { IStatement } from './IStatement'

export default class BreakStatement implements IStatement {
  public execute(): void {
    throw this
  }

  public toString(): string {
    return 'break'
  }
}
