import ArrayValue from '@lib/ArrayValue'
import Function from '@lib/Functions'
import IValue from '@lib/IValue'

export default class StdArray implements Function {
  execute(...args: IValue[]): IValue {
    return new ArrayValue(args)
  }
}
