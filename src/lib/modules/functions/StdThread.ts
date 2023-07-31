import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import Functions, { Function } from '@lib/Functions'
import IValue from '@lib/IValue'

export default class StdThread implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length == 0) throw new Error('At least one arg expected')

    const body = args[0] instanceof FunctionValue ? args[0].getValue() : Functions.get(args[0].asString())
    setTimeout(() => body.execute(...args.splice(1)), 0)

    return BooleanValue.TRUE
  }
}
