import Function from '@lib/Functions'
import IValue from '@lib/IValue'
import BooleanValue from '@lib/BooleanValue'
import ArrayValue from '@lib/ArrayValue'

export default class StdNewArray implements Function {
  execute(...args: IValue[]): IValue {
    return this.createArr(args, 0)
  }

  createArr(args: IValue[], index: number = 0) {
    const size = args[index].asNumber()
    const last = args.length - 1
    const arr = new ArrayValue(size)
    for (let i = 0; i < size; i++) arr.set(i, index === last ? BooleanValue.FALSE : this.createArr(args, index + 1))
    return arr
  }
}
