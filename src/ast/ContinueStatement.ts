import { IStatement } from './IStatement'

export default class ContinueStatement implements IStatement {
  public execute(): void {
    throw this
  }
}
