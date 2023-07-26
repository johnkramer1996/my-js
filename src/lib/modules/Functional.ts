import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import FunctionalReduce from './functions/FunctionalReduce'
import FunctionalFilter from './functions/FunctionalFilter'
import FunctionalForEach from './functions/FunctionalForEach'
import FunctionalMap from './functions/FunctionalMap'

export default class Functional implements IModule {
  public init(): void {
    Functions.set('foreach', new FunctionalForEach())
    Functions.set('map', new FunctionalMap())
    Functions.set('reduce', new FunctionalReduce())
    Functions.set('filter', new FunctionalFilter())
  }
}
