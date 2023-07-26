import ArrayValue from './ArrayValue'
import IValue from './IValue'
import NumberValue from './NumberValue'
import UserDefinedFunction from './UserDefinedFunction'

// (...args: IValue[]) => IValue |
export type Function = { execute: (...args: IValue[]) => IValue }

export type MultiFunction = UserDefinedFunction | Function

export default class Functions {
  private static functions = new Map<string, Function>([
    // [
    //   'Array',
    //   (...args: IValue[]): IValue => {
    //     return new ArrayValue(args)
    //   },
    // ],
    // [
    //   'ArrayMulti',
    //   (() => {
    //     const func = (...args: IValue[]): IValue => {
    //       return func.createArr(args.splice(0, args.length - 1), args[args.length - 1], 0)
    //     }
    //     func.createArr = (args: IValue[], value: IValue = new NumberValue(0), index: number = 0) => {
    //       const size = args[index].asNumber()
    //       const last = args.length - 1
    //       const arr = new ArrayValue(size)
    //       for (let i = 0; i < size; i++) arr.set(i, index === last ? value : func.createArr(args, value, index + 1))
    //       return arr
    //     }
    //     return func
    //   })(),
    // ],
  ])

  public static isExists(key: string): boolean {
    return Functions.functions.has(key)
  }

  public static get(key: string): Function {
    if (this.isExists(key)) return Functions.functions.get(key) as Function
    throw new Error('Unknown function ' + key)
  }

  public static set(key: string, value: Function) {
    Functions.functions.set(key, value)
  }
}
