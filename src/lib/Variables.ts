import NumberValue from './NumberValue'
import IValue from './IValue'
import BooleanValue from './BooleanValue'

export default class Variables {
  private static stack: Map<string, IValue>[] = []
  private static variables = new Map<string, IValue>([
    ['true', BooleanValue.TRUE],
    ['false', BooleanValue.FALSE],
  ])

  public static push(): void {
    this.stack.push(new Map(this.variables))
  }

  public static pop(): void {
    this.variables = this.stack.pop() as Map<string, IValue>
  }

  public static isExists(key: string): boolean {
    return Variables.variables.has(key)
  }

  public static get(key: string): IValue {
    return Variables.variables.get(key) || BooleanValue.FALSE
  }

  public static set(key: string, value: IValue) {
    Variables.variables.set(key, value)
  }
}
