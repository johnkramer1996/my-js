import Functions from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import { IStatement } from './IStatement'
import Variables from '@lib/Variables'
import NumberValue from '@lib/NumberValue'

export default class FunctionDefineStatement implements IStatement {
  constructor(private name: string, private argNames: string[], private body: IStatement) {}

  public execute(): void {
    Functions.set(this.name, new UserDefinedFunction(this.argNames, this.body))

    //test
    Variables.push()
    Variables.set('one', new NumberValue(1))
    Variables.set('two', new NumberValue(2))
    Functions.get(this.name).execute()
    Variables.pop()
  }
}
