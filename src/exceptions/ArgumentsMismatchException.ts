export class ArgumentsMismatchException extends Error {}
export class OperationIsNotSupportedException extends Error {}
export class PatternMatchingException extends Error {}
export class TypeException extends Error {}

export class UnknownFunctionException extends Error {
  constructor(private functionName: string) {
    super('Unknown function ' + functionName)
  }

  public getFunctionName(): string {
    return this.functionName
  }
}

export class VariableDoesNotExistsException extends Error {
  constructor(private variable: string) {
    super('Unknown variable ' + variable)
  }

  public getVariable(): string {
    return this.variable
  }
}
