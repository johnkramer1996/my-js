import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'

export default class MapExpression implements IExpression {
  constructor(public elements: Map<IExpression, IExpression>) {}

  public eval(): IValue {
    const map = new MapValue()
    for (const [key, value] of this.elements.entries()) map.set(key.eval().asString(), value.eval())
    return map
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.elements.toString()
  }
}
