import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import ArrayValue from '@lib/ArrayValue'
import FunctionValue from '@lib/FunctionValue'
import { ArgumentsMismatchException, TypeException } from 'exceptions/ArgumentsMismatchException'

export default class FunctionalFlatMap implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 2) throw new ArgumentsMismatchException('At least two arguments expected')
    if (!(args[0] instanceof ArrayValue)) throw new TypeException('Array expected in first argument')
    if (!(args[1] instanceof FunctionValue)) throw new TypeException('Function expected in second argument')

    const mapper = args[1].getValue()
    return this.flatMapArray(args[0], mapper)
  }

  private flatMapArray(array: ArrayValue, mapper: Function): ArrayValue {
    const values: IValue[] = []
    for (const el of array)
      if (el instanceof ArrayValue) for (const item of this.flatMapArray(el, mapper)) values.push(item)
      else values.push(el)
    return new ArrayValue(values)
  }
}
