import IValue from './IValue'
import BooleanValue from './BooleanValue'
import FunctionValue from './FunctionValue'
import SyntaxError from '@exceptions/SyntaxError'
import ReferenceError from '@exceptions/ReferenceError'
import UndefinedValue from './UndefinedValue'
import MapValue from './MapValue'

const uninitialized = '<uninitialized>'

type Variable = { value: IValue | typeof uninitialized; kind: string }

export class Scope {
  public variables: Map<String, Variable> = new Map()

  constructor(public parent: Scope | null = null) {}
}

class ScopeFindData {
  constructor(public scope: Scope, public isFound: boolean) {}
}

export default class Variables {
  public static scope: Scope = new Scope()

  static {
    this.scope.variables.clear()
    this.scope.variables.set('console', {
      value: new MapValue({
        log: new FunctionValue({ execute: (...values: IValue[]) => (console.log(values.toString()), UndefinedValue.UNDEFINED) }),
      }),
      kind: 'conts',
    })
  }

  public static push(scope?: Scope): void {
    this.scope = scope ?? new Scope(this.scope)
  }

  public static pop(): Scope {
    const scope = this.scope
    if (this.scope.parent) this.scope = this.scope.parent
    return scope
  }

  public static isExists(key: string): boolean {
    return this.loopUp(key).isFound
  }

  public static get(key: string): IValue {
    const scopeData = this.loopUp(key)
    if (!scopeData.isFound) throw new ReferenceError(`${key} is not defined`)
    const variable = scopeData.scope.variables.get(key)
    if (variable?.value === uninitialized) throw new ReferenceError(`"Cannot access '${key}' before initialization`)
    return (scopeData.scope.variables.get(key) as Variable).value as IValue
  }

  public static set(key: string, value: IValue): IValue {
    const scopeData = this.loopUp(key)
    if (!scopeData.isFound) throw new ReferenceError(`${key} is not defined`)
    const variable = scopeData.scope.variables.get(key)
    if (variable?.value === uninitialized) throw new ReferenceError(`"Cannot access '${key}' before initialization`)
    if (!variable) throw new ReferenceError('Varaible undefined' + key)
    if (variable.kind === 'const') throw new SyntaxError(`Cannot assign to '${key}' because it is a constant.`)
    variable.value = value
    // if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
    return value
  }

  public static define(key: string, value: IValue): IValue {
    const variable = this.scope.variables.get(key)
    if (!variable) throw new ReferenceError('Variable undefined ' + key)
    if (!(variable.value === uninitialized) && variable.kind === 'func') return variable.value
    variable.value = value
    return value
  }

  public static hoisting(key: string, kind: string, value: IValue = UndefinedValue.UNDEFINED) {
    const variable = this.scope.variables.get(key)
    if (variable?.value === uninitialized) throw new SyntaxError(`Identifier '${key}' has already been declared. `)
    this.scope.variables.set(key, { value: kind === 'func' || kind === 'var' ? value : uninitialized, kind })
    if (value instanceof FunctionValue) {
      value.setScope(Variables.scope)
    }
  }

  public static remove(key: string) {
    this.loopUp(key).scope.variables.delete(key)
  }

  private static loopUp(variable: string): ScopeFindData {
    let current: Scope | null = this.scope
    do {
      if (!current.variables.has(variable)) continue
      return new ScopeFindData(current, true)
    } while ((current = current.parent))

    return new ScopeFindData(this.scope, false)
  }
}
