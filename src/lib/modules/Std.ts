import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'
import StdNewArray from './functions/StdNewArray'
import StdForeach from './functions/stdForeach'

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('newarray', new StdNewArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('rand', new StdRand())
    Functions.set('foreach', new StdForeach())
  }
}
