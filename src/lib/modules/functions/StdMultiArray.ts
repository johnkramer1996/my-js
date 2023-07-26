import ArrayValue from '@lib/ArrayValue'
import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'

export default class StdMultiArray implements Function {
  execute(...args: IValue[]): IValue {
    return this.createArr(args.splice(0, args.length - 1), args[args.length - 1], 0)
  }

  createArr(args: IValue[], value: IValue = new NumberValue(0), index: number = 0) {
    const size = args[index].asNumber()
    const last = args.length - 1
    const arr = new ArrayValue(size)
    for (let i = 0; i < size; i++) arr.set(i, index === last ? value : this.createArr(args, value, index + 1))
    return arr
  }
}
