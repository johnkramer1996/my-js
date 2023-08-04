import ArrayValue from '@lib/ArrayValue'
import FunctionValue from '@lib/FunctionValue'
import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import TypeException from '@exceptions/TypeException'

export default class StdSort implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 1) throw new ArgumentsMismatchException('At least one argument expected')
    if (!(args[0] instanceof ArrayValue)) throw new TypeException('Array expected in first argument')

    const elements: IValue[] = args[0].getCopyElements()
    switch (args.length) {
      case 1:
        elements.sort()
        break
      case 2:
        if (!(args[1] instanceof FunctionValue)) throw new TypeException('Function expected in second argument')
        const comparator = args[1].getValue()
        elements.sort((a, b) => {
          return comparator.execute(a, b).asNumber()
        })
        break
      default:
        throw new ArgumentsMismatchException('Wrong number of arguments')
    }

    return new ArrayValue(elements)
  }
}
