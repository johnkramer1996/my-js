import Functions, { Function } from '@lib/Functions'
import IModule from '@lib/IModule'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'
import StdNewArray from './functions/StdNewArray'
import StdNextFrame from './functions/StdNextFrame'
import StdThread from './functions/StdThread'
import StdLength from './functions/StdLength'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import ArrayValue from '@lib/ArrayValue'
import { ArgumentsMismatchException, TypeException } from 'exceptions/ArgumentsMismatchException'
import FunctionValue from '@lib/FunctionValue'
import BooleanValue from '@lib/BooleanValue'

export class StdSort implements Function {
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

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('newarray', new StdNewArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('length', new StdLength())
    Functions.set('rand', new StdRand())
    Functions.set('nextFrame', new StdNextFrame())
    Functions.set('thread', new StdThread())
    Functions.set('sort', new StdSort())
  }
}
