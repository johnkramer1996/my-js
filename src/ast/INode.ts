import IVisitor from './IVisitor'

export interface INode {
  accept(visitor: IVisitor): void
}
