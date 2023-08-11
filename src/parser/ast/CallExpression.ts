import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import CallStack from '@lib/CallStack'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables, { Scope } from '@lib/Variables'
import MapValue from '@lib/MapValue'
import UndefinedValue from '@lib/UndefinedValue'
import { Location } from 'parser/Parser'

// function execution context.
// this.createFEC()
// this.hoisting()
// this.bindThis()

export default class CallExpression implements IExpression {
  public start: number
  public end: number
  constructor(public callee: IExpression, public args: IExpression[]) {
    this.start = callee.start
    this.end = Location.getPrevToken().end
  }

  public eval(): IValue {
    const func = this.callee.eval()
    if (!(func instanceof FunctionValue)) throw new Error('expect function' + func)

    const values = this.args.map((v) => v.eval())
    Variables.push()
    // if (func instanceof UserDefinedFunction) func.hoisting()
    CallStack.enter('FUNC')
    Variables.scope.variables.set('this', { value: new MapValue(values), kind: 'const' })
    Variables.scope.variables.set('arguments', { value: new MapValue(values), kind: 'const' })
    const result = func.execute(...values)
    const scope = Variables.pop()
    if (result instanceof FunctionValue) result.setScope(scope)
    CallStack.exit()
    return result
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.callee + '(' + this.args.toString() + ')'
  }
}
