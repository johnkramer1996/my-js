export default class VariableDoesNotExistsException extends Error {
  constructor(private variable: string) {
    super('Unknown variable ' + variable)
  }

  public getVariable(): string {
    return this.variable
  }
}
