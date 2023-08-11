import { Location } from 'parser/Parser'
import IVisitor from './IVisitor'

export interface INode {
  location: Location
  accept(visitor: IVisitor): void
}
