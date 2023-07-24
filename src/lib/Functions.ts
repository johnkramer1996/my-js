import UserDefinedFunction from './UserDefinedFunction'

export default class Functions {
  private static functions = new Map<string, UserDefinedFunction>()

  public static isExist(key: string): boolean {
    return Functions.functions.has(key)
  }

  public static get(key: string): UserDefinedFunction {
    if (this.isExist(key)) return Functions.functions.get(key) as UserDefinedFunction
    throw new Error('Unknown function ' + key)
  }

  public static set(key: string, value: UserDefinedFunction) {
    Functions.functions.set(key, value)
  }
}
