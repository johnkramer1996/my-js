import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'

export default class StdNextFrame implements Function {
  execute(...args: IValue[]): IValue {
    const func = args[0] instanceof FunctionValue ? args[0].getValue() : new FunctionValue({ execute: () => BooleanValue.FALSE }).getValue()

    requestAnimationFrame(() => {
      func.execute()
    })

    // setTimeout(() => {}, 25)

    return BooleanValue.TRUE
  }
}
