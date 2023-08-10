import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import Function from '@lib/Functions'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'

export default class StdNextFrame implements Function {
  execute(...args: IValue[]): IValue {
    // const func = args[0] instanceof FunctionValue ? args[0].getValue() : new FunctionValue({ execute: () => BooleanValue.FALSE }).getValue()
    // const time = args[1] instanceof NumberValue ? args[1].asNumber() : 1000

    // setTimeout(() => {
    //   func.execute()
    // }, time)

    return BooleanValue.TRUE
  }
}
