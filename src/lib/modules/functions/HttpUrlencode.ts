import Function from '@lib/Functions'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'

export class HttpUrlencode implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length == 0) throw new ArgumentsMismatchException('At least one arg expected')

    // const charset = args.length >= 2 ? args[1].asString() : 'UTF-8'
    try {
      const result = JSON.parse(args[0].asString())
      return new StringValue(result)
    } catch (ex) {
      return args[0]
    }
  }
}
