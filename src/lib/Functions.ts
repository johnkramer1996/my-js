import ArrayValue from './ArrayValue'
import BooleanValue from './BooleanValue'
import IValue from './IValue'
import NumberValue from './NumberValue'
import StringValue from './StringValue'
import UserDefinedFunction from './UserDefinedFunction'

type Function = (...args: IValue[]) => IValue

type MultiFunction = UserDefinedFunction | Function | { (): IValue }

export default class Functions {
  private static functions = new Map<string, MultiFunction>([
    [
      'Array',
      (...args: IValue[]): IValue => {
        return new ArrayValue(args)
      },
    ],
    [
      'ArrayMulti',
      (() => {
        const func = (...args: IValue[]): IValue => {
          return func.createArr(args, 0)
        }
        func.createArr = (args: IValue[], index: number) => {
          const size = args[index].asNumber()
          const last = args.length - 1
          const arr = new ArrayValue(size)
          for (let i = 0; i < size; i++) arr.set(i, index === last ? BooleanValue.FALSE : func.createArr(args, index + 1))
          return arr
        }

        return func
      })(),
    ],
  ])

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
