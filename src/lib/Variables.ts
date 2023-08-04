import NumberValue from './NumberValue'
import IValue from './IValue'
import BooleanValue from './BooleanValue'

class Scope {
  public variables: Map<String, IValue> = new Map()

  constructor(public parent: Scope | null = null) {}
}

class ScopeFindData {
  constructor(public scope: Scope, public isFound: boolean = false) {}
}

export default class Variables {
  private static scope: Scope = new Scope()

  static {
    this.scope.variables.clear()
    this.scope.variables.set('true', BooleanValue.TRUE)
    this.scope.variables.set('false', BooleanValue.FALSE)
  }

  public static push(): void {
    this.scope = new Scope(this.scope)
  }

  public static pop(): void {
    if (this.scope.parent) this.scope = this.scope.parent
  }

  public static isExists(key: string): boolean {
    return this.findScope(key).isFound
  }

  public static get(key: string): IValue {
    const scopeData = this.findScope(key)
    if (scopeData.isFound) return scopeData.scope.variables.get(key) as IValue
    return BooleanValue.FALSE
  }

  public static set(key: string, value: IValue): void {
    this.findScope(key).scope.variables.set(key, value)
  }

  public static define(key: string, value: IValue): void {
    this.scope.variables.set(key, value)
  }

  public static remove(key: string) {
    this.findScope(key).scope.variables.delete(key)
  }

  private static findScope(variable: string): ScopeFindData {
    const result = new ScopeFindData(this.scope)

    let current: Scope | null = this.scope
    do {
      if (!current.variables.has(variable)) continue
      result.isFound = true
      result.scope = current
      return result
    } while ((current = current.parent))

    return result
  }
}
