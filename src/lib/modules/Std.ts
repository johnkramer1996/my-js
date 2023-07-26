import Functions, { Function } from '@lib/Functions'
import IModule from '@lib/IModule'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'
import IValue from '@lib/IValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import ArrayValue from '@lib/ArrayValue'
import MapValue from '@lib/MapValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'

class stdForeach implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length != 2) return BooleanValue.FALSE

    if (!(args[1] instanceof FunctionValue)) return BooleanValue.FALSE

    const func = args[1].getValue()
    const container = args[0]
    if (container instanceof ArrayValue) {
      const array = container
      for (const element of array) {
        func.execute(element)
      }
      return BooleanValue.FALSE
    }
    if (container instanceof MapValue) {
      const map = container
      for (const [key, value] of map) {
        func.execute(new StringValue(key), value)
      }

      return BooleanValue.FALSE
    }
    return BooleanValue.FALSE
  }
}

export class StdNewArray implements Function {
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

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('newarray', new StdNewArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('rand', new StdRand())
    Functions.set('foreach', new stdForeach())
  }
}
