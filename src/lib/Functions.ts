import IValue from './IValue'
import UserDefinedFunction from './UserDefinedFunction'

type Function = (...args: IValue[]) => IValue

type MultiFunction = UserDefinedFunction | Function

export default class Functions {
  private static functions = new Map<string, MultiFunction>()

  public static isExist(key: string): boolean {
    return Functions.functions.has(key)
  }

  public static get(key: string): MultiFunction {
    if (this.isExist(key)) return Functions.functions.get(key) as MultiFunction
    throw new Error('Unknown function ' + key)
  }

  public static set(key: string, value: MultiFunction) {
    Functions.functions.set(key, value)
  }
}
