import Functions, { Function } from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import Types from '@lib/Types'
import FunctionValue from '@lib/FunctionValue'
import Variables from '@lib/Variables'
import FunctionalReduce from './functions/FunctionalReduce'
import FunctionalFilter from './functions/FunctionalFilter'
import FunctionalForEach from './functions/FunctionalForEach'
import FunctionalMap from './functions/FunctionalMap'
import FunctionalFlatMap from './functions/FunctionalFlatMap'
import FunctionalCombine from './functions/FunctionalCombine'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import TypeException from '@exceptions/TypeException'
import ArrayValue from '@lib/ArrayValue'

export class FunctionalSortBy implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length != 2) throw new ArgumentsMismatchException('Two arguments expected')
    if (!(args[0] instanceof ArrayValue)) throw new TypeException('Array expected in first argument')
    if (!(args[1] instanceof FunctionValue)) throw new TypeException('Function expected in second argument')

    const elements = args[0].getCopyElements()
    const comparator = args[1].getValue()

    elements.sort((a, b) => comparator.execute(a).compareTo(comparator.execute(b)))
    return new ArrayValue(elements)
  }
}

export default class Functional implements IModule {
  public init(): void {
    Functions.set('foreach', new FunctionalForEach())
    Functions.set('map', new FunctionalMap())
    Functions.set('reduce', new FunctionalReduce())
    Functions.set('filter', new FunctionalFilter())
    Functions.set('flatmap', new FunctionalFlatMap())
    Functions.set('combine', new FunctionalCombine())
    Functions.set('sortby', new FunctionalSortBy())

    Variables.set('IDENTITY', new FunctionValue({ execute: (arg: IValue) => arg }))
  }
}
