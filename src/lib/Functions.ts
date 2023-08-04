import { UnknownFunctionException } from '@exceptions/UnknownFunctionException'
import IValue from './IValue'

export type Function = { execute: (...args: IValue[]) => IValue }

export default class Functions {
  private static functions = new Map<string, Function>([])

  public static isExists(key: string): boolean {
    return Functions.functions.has(key)
  }

  public static get(key: string): Function {
    if (this.isExists(key)) return Functions.functions.get(key) as Function
    throw new UnknownFunctionException(key)
  }

  public static set(key: string, value: Function) {
    Functions.functions.set(key, value)
  }
}
