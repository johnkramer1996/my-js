import { process } from '@ast/LogStatement'
import BooleanValue from '@lib/BooleanValue'
import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'

export default class StdEcho implements Function {
  execute(...args: IValue[]): IValue {
    process.stdout.write(args.map((val) => val.asString()).join(' '))
    process.stdout.write('\n')
    return BooleanValue.FALSE
  }
}
