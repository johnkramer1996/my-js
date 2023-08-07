import IValue from './IValue'
import BooleanValue from './BooleanValue'
import FunctionValue from './FunctionValue'
import StringValue from './StringValue'

export class Scope {
  public variables: Map<String, IValue> = new Map()

  constructor(public parent: Scope | null = null) {}
}

class ScopeFindData {
  constructor(public scope: Scope, public isFound: boolean = false) {}
}

export default class Variables {
  public static scope: Scope = new Scope()

  static {
    this.scope.variables.clear()
    this.scope.variables.set('true', BooleanValue.TRUE)
    this.scope.variables.set('false', BooleanValue.FALSE)
  }

  public static push(scope?: Scope): void {
    this.scope = scope ?? new Scope(this.scope)
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
    const scopeData = this.findScope(key)
    if (!scopeData.isFound) throw new Error('Varaible undefined')
    scopeData.scope.variables.set(key, value)
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
  }

  public static define(key: string, value: IValue): void {
    if (this.scope.variables.get(key) && (this.scope.variables.get(key) !== StringValue.EMPTY || value === StringValue.EMPTY)) throw new Error(`Cannot redeclare block-scoped variable '${key}'`)
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
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
