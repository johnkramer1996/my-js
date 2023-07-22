import Token, { IToken } from 'Token'
import TokenType from 'TokenType'
import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'
import { LogStatement } from '@ast/LogStatement'
import { ValueExpression } from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression from '@ast/BinaryExpression'
import UnaryExpression from '@ast/UnaryExpression'
import TernaryExpression from '@ast/TernarExpression'

export default class Parser {
  private tokens: IToken[]
  private position = 0
  private size: number

  constructor(tokens: IToken[]) {
    this.tokens = tokens
    this.size = tokens.length
  }

  public parse(): IStatement {
    const mainBlock = new BlockStatement()
    while (!this.match(TokenType.EOF)) {
      mainBlock.add(this.statement())
      this.consume(TokenType.SEMIKOLON)
      while (this.match(TokenType.SEMIKOLON));
    }
    return mainBlock
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    throw new Error('Unknown statement' + this.get().getText())
  }

  private expression(): IExpression {
    return this.ternary()
  }

  private ternary(): IExpression {
    const result = this.bitwiseOr()

    if (this.match(TokenType.QUESTION)) {
      const trueExpr = this.expression()
      this.consume(TokenType.COLON)
      const falseExpr = this.expression()
      return new TernaryExpression(result, trueExpr, falseExpr)
    }

    return result
  }

  private bitwiseOr(): IExpression {
    const result = this.bitwiseXor()

    if (this.match(TokenType.BAR)) return new BinaryExpression(BinaryExpression.Operator.OR, result, this.bitwiseOr())

    return result
  }

  private bitwiseXor(): IExpression {
    const result = this.bitwiseAnd()

    if (this.match(TokenType.CARET)) return new BinaryExpression(BinaryExpression.Operator.XOR, result, this.bitwiseXor())

    return result
  }

  private bitwiseAnd(): IExpression {
    const result = this.shift()

    if (this.match(TokenType.AMP)) return new BinaryExpression(BinaryExpression.Operator.AND, result, this.bitwiseAnd())

    return result
  }

  private shift(): IExpression {
    const result = this.additive()

    if (this.match(TokenType.LTLT)) return new BinaryExpression(BinaryExpression.Operator.LSHIFT, result, this.additive())
    if (this.match(TokenType.GTGT)) return new BinaryExpression(BinaryExpression.Operator.RSHIFT, result, this.additive())
    if (this.match(TokenType.GTGTGT)) return new BinaryExpression(BinaryExpression.Operator.URSHIFT, result, this.additive())

    return result
  }

  private additive(): IExpression {
    const result = this.multiplicative()

    if (this.match(TokenType.PLUS)) return new BinaryExpression(BinaryExpression.Operator.ADD, result, this.additive())
    if (this.match(TokenType.MINUS)) return new BinaryExpression(BinaryExpression.Operator.SUBTRACT, result, this.additive())

    return result
  }

  private multiplicative(): IExpression {
    const result = this.unary()

    if (this.match(TokenType.STAR)) return new BinaryExpression(BinaryExpression.Operator.MULTIPLY, result, this.multiplicative())
    if (this.match(TokenType.SLASH)) return new BinaryExpression(BinaryExpression.Operator.DIVIDE, result, this.multiplicative())

    return result
  }

  private unary(): IExpression {
    // DELETE
    // VOID
    // TYPEOF
    if (this.match(TokenType.PLUS)) return new UnaryExpression(UnaryExpression.Operator.PLUS, this.unary())
    if (this.match(TokenType.MINUS)) return new UnaryExpression(UnaryExpression.Operator.NEGATION, this.unary())
    if (this.match(TokenType.TILDE)) return new UnaryExpression(UnaryExpression.Operator.BITWISE_NOT, this.unary())
    if (this.match(TokenType.EXCL)) return new UnaryExpression(UnaryExpression.Operator.LOGICAL_NOT, this.unary())
    // AWAIT

    return this.primary()
  }

  private primary(): IExpression {
    const current = this.get()

    if (this.match(TokenType.TEXT)) return new ValueExpression(current.getText())
    if (this.match(TokenType.NUMBER)) return new ValueExpression(current.getText())
    if (this.match(TokenType.HEX_NUMBER)) return new ValueExpression(String(Number.parseInt(current.getText(), 16)))

    throw new Error('Unknown expression ' + TokenType[current.getType()])
  }

  private consume(type: TokenType): IToken {
    const current = this.get()
    if (current.getType() !== type) throw new Error('Token ' + TokenType[current.getType()] + " doesn't match " + TokenType[type])
    ++this.position
    return current
  }

  private match(type: TokenType): boolean {
    return type === this.get().getType() ? (++this.position, true) : false
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.size) return new Token(TokenType.EOF, '')

    return this.tokens[position]
  }
}
