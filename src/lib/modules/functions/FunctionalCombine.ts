import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import FunctionValue from '@lib/FunctionValue'
import { ArgumentsMismatchException, TypeException } from 'exceptions/ArgumentsMismatchException'

export default class FunctionalCombine implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 1) throw new ArgumentsMismatchException('At least one arg expected')

    let result!: Function
    for (const arg of args) {
      if (!(arg instanceof FunctionValue)) throw new TypeException(arg.toString() + ' is not a function')

      const current: Function | null = result
      const next = arg.getValue()
      result = {
        execute: (...fArgs: IValue[]): IValue => {
          if (current == null) return next.execute(...fArgs)
          return next.execute(current.execute(...fArgs))
        },
      }
    }

    return new FunctionValue(result)
  }
}
