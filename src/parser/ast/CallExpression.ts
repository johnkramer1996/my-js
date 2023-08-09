import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import CallStack from '@lib/CallStack'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables, { Scope } from '@lib/Variables'
import MapValue from '@lib/MapValue'

export default class CallExpression implements IExpression {
  constructor(public functionExpr: IExpression, public args: IExpression[]) {}

  public eval(): IValue {
    const value = this.functionExpr.eval()
    if (!(value instanceof FunctionValue)) throw new Error('expect function' + value)

    const func = value.getValue()

    // function execution context.
    // this.createFEC()
    // this.hoisting()
    // this.bindThis()

    const values = this.args.map((v) => v.eval())
    Variables.push()
    Variables.scope.variables.set('this', { value: new MapValue(values), kind: 'const' })
    Variables.scope.variables.set('arguments', { value: new MapValue(values), kind: 'const' })
    if (func instanceof UserDefinedFunction) func.hoisting()
    CallStack.enter('FUNC')
    const result = func.execute(...values)
    const scope = Variables.pop()
    if (result instanceof FunctionValue) {
      const func = result.getValue()
      if (func instanceof UserDefinedFunction) func.outer = scope
    }
    CallStack.exit()
    return result
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.functionExpr + '(' + this.args.toString() + ')'
  }
}
