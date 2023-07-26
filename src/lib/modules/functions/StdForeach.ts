import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import ArrayValue from '@lib/ArrayValue'
import MapValue from '@lib/MapValue'
import StringValue from '@lib/StringValue'

export default class StdForeach implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length != 2) return BooleanValue.FALSE

    if (!(args[1] instanceof FunctionValue)) return BooleanValue.FALSE

    const func = args[1].getValue()
    const container = args[0]
    if (container instanceof ArrayValue) {
      const array = container
      for (const element of array) func.execute(element)
      return BooleanValue.FALSE
    }
    if (container instanceof MapValue) {
      const map = container
      const iterator = container[Symbol.iterator]()
      // iterator.
      for (const [key, value] of map) func.execute(new StringValue(key), value)
      return BooleanValue.FALSE
    }
    return BooleanValue.FALSE
  }
}
