export class UnknownFunctionException extends Error {
  constructor(private functionName: string) {
    super('Unknown function ' + functionName)
  }

  public getFunctionName(): string {
    return this.functionName
  }
}
