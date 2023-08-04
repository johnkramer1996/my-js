import Token, { IToken } from './Token'
import TokenType from './TokenType'
import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import LogStatement from '@ast/LogStatement'
import ValueExpression from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression from '@ast/BinaryExpression'
import UnaryExpression from '@ast/UnaryExpression'
import TernaryExpression from '@ast/TernarExpression'
import ConditionalExpression from '@ast/ConditionalExpression'
import VariableExpression from '@ast/VariableExpression'
import IfStatement from '@ast/IfStatement'
import WhileStatement from '@ast/WhileStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import ForStatement from '@ast/ForStatement'
import AssignmentStatement from '@ast/AssignmentStatement'
import BreakStatement from '@ast/BreakStatement'
import ContinueStatement from '@ast/ContinueStatement'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import ExprStatement from '@ast/ExprStatement'
import FunctionalExpression from '@ast/FunctionalExpression'
import UseStatement from '@ast/UseStatement'
import ReturnStatement from '@ast/ReturnStatement'
import ArrayExpression from '@ast/ArrayExpression'
import ArrayAccessExpression from '@ast/ArrayAccessExpression'
import ArrayAssignmentStatement from '@ast/ArrayAssignmentStatement'
import ParserException from './ParserException'
import CommaExpression from '@ast/CommaExpresstion'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import MapExpression from '@ast/MapExpression'
import FunctionReferenceExpression from '@ast/FunctionReferenceExpression'
import ForeachStatement from '@ast/ForeachStatement'
import AssignmentExpression from '@ast/AssignmentExpression'
import MatchExpression, { ConstantPattern, Pattern, VariablePattern } from '@ast/MatchExpression'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'

// TODO add AssignInicialization

type ConditionalExpressionWithoutOperatorConsturctor = new (expr1: IExpression, expr2: IExpression) => ConditionalExpression
type BinaryExpressionWithoutOperatorConsturctor = new (expr1: IExpression, expr2: IExpression) => BinaryExpression

type Binary =
  | {
      name: string
      list: { token: TokenType; class: ConditionalExpressionWithoutOperatorConsturctor }[]
    }
  | {
      name: string
      list: { token: TokenType; class: BinaryExpressionWithoutOperatorConsturctor }[]
    } // TODO make a general class

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
      while (this.match(TokenType.SEMIKOLON));
    }
    return mainBlock
  }

  private statementOrBlock(): IStatement {
    return this.lookMatch(0, TokenType.LBRACE) ? this.block() : this.statement()
  }

  private block(): IStatement {
    const block = new BlockStatement()
    this.consume(TokenType.LBRACE)
    while (!this.match(TokenType.RBRACE)) {
      block.add(this.statement())
      while (this.match(TokenType.SEMIKOLON));
    }
    return block
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    if (this.match(TokenType.PRINT)) return new LogStatement(this.expression())
    if (this.match(TokenType.PRINTLN)) return new LogStatement(this.expression(), true)
    if (this.match(TokenType.IF)) return this.ifElseStatement()
    if (this.match(TokenType.WHILE)) return this.whileStatement()
    if (this.match(TokenType.DO)) return this.doWhileStatement()
    if (this.match(TokenType.FOR)) return this.forStatement()
    if (this.match(TokenType.BREAK)) return new BreakStatement()
    if (this.match(TokenType.CONTINUE)) return new ContinueStatement()
    if (this.match(TokenType.DEF)) return this.functionDefine()
    if (this.match(TokenType.RETURN)) return new ReturnStatement(this.expression())
    if (this.match(TokenType.USE)) return new UseStatement(this.expression())
    if (this.match(TokenType.MATCH)) return new ExprStatement(this.matchExpression())
    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.LPAREN)) return new ExprStatement(this.function(this.qualifiedName()))
    if (this.lookMatch(0, TokenType.WORD)) return this.assignmentStatement()

    throw this.error('Unknown statement ' + this.get())
  }

  private ifElseStatement(): IStatement {
    const condition = this.expression()
    const ifStatement = this.statementOrBlock()
    const elseStatement = this.match(TokenType.ELSE) ? this.statementOrBlock() : null

    return new IfStatement(condition, ifStatement, elseStatement)
  }

  private whileStatement(): IStatement {
    const condition = this.expression()
    const statement = this.statementOrBlock()
    return new WhileStatement(condition, statement)
  }

  private doWhileStatement(): IStatement {
    const statement = this.statementOrBlock()
    this.consume(TokenType.WHILE)
    const condition = this.expression()
    return new DoWhileStatement(condition, statement)
  }

  private forStatement(): IStatement {
    const foreachIndex = this.lookMatch(0, TokenType.LPAREN) ? 1 : 0
    if (this.lookMatch(foreachIndex, TokenType.WORD) && this.lookMatch(foreachIndex + 1, TokenType.COLON)) return this.foreachArrayStatement()
    if (
      this.lookMatch(foreachIndex, TokenType.WORD) &&
      this.lookMatch(foreachIndex + 1, TokenType.COMMA) &&
      this.lookMatch(foreachIndex + 2, TokenType.WORD) &&
      this.lookMatch(foreachIndex + 3, TokenType.COLON)
    )
      return this.foreachMapStatement()

    return this.simpleForStatement()
  }

  private foreachArrayStatement(): ForeachStatement {
    const openParen = this.match(TokenType.LPAREN)
    const variable = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COLON)
    const container = this.expression()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForeachStatement(container, statement, variable)
  }

  private foreachMapStatement(): ForeachStatement {
    const openParen = this.match(TokenType.LPAREN)
    const key = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COMMA)
    const value = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COLON)
    const container = this.expression()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForeachStatement(container, statement, key, value)
  }

  private simpleForStatement(): ForStatement {
    const openParen = this.match(TokenType.LPAREN)
    const initialization = this.assignmentStatement()
    this.consume(TokenType.COMMA)
    const termination = this.expression()
    this.consume(TokenType.COMMA)
    const increment = this.assignmentStatement()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForStatement(initialization, termination, increment, statement)
  }

  private assignmentStatement(): IStatement {
    if (this.lookMatch(1, TokenType.EQ)) {
      const variable = this.consume(TokenType.WORD).getText()
      this.consume(TokenType.EQ)
      return new AssignmentStatement(variable, this.expression())
    }
    if (this.lookMatch(1, TokenType.LBRACKET)) {
      const array = this.bracketNotation()
      this.consume(TokenType.EQ)
      return new ArrayAssignmentStatement(array, this.expression())
    }
    const variable = this.consume(TokenType.WORD).getText()
    return new AssignmentStatement(variable, new ValueExpression(0))
  }

  private functionDefine(): FunctionDefineStatement {
    const name = this.consume(TokenType.WORD).getText()
    return new FunctionDefineStatement(name, new UserDefinedFunction(this.getArguments(), this.getBody()))
  }

  private function(qualifiedNameExpr: IExpression): FunctionalExpression {
    this.consume(TokenType.LPAREN)
    const args: IExpression[] = []
    while (!this.match(TokenType.RPAREN)) {
      args.push(this.expression())
      this.match(TokenType.COMMA)
    }
    return new FunctionalExpression(qualifiedNameExpr, args)
  }

  private array(): IExpression {
    this.consume(TokenType.LBRACKET)
    const elements: IExpression[] = []
    while (!this.match(TokenType.RBRACKET)) {
      elements.push(this.expression())
      this.match(TokenType.COMMA)
    }
    return new ArrayExpression(elements)
  }

  private map(): IExpression {
    this.consume(TokenType.LBRACE)
    const elements: Map<IExpression, IExpression> = new Map()
    while (!this.match(TokenType.RBRACE)) {
      const key = this.value()
      this.consume(TokenType.COLON)
      elements.set(key, this.expression())
      this.match(TokenType.COMMA)
    }
    return new MapExpression(elements)
  }

  private bracketNotation(): ArrayAccessExpression {
    const variable = this.consume(TokenType.WORD).getText()
    const indices: IExpression[] = []
    do {
      this.consume(TokenType.LBRACKET)
      indices.push(this.expression())
      this.consume(TokenType.RBRACKET)
    } while (this.lookMatch(0, TokenType.LBRACKET))
    return new ArrayAccessExpression(variable, indices)
  }

  private dotNotation(): ArrayAccessExpression {
    const variable = this.consume(TokenType.WORD).getText()
    const indices: IExpression[] = []
    while (this.match(TokenType.DOT)) {
      const key = new ValueExpression(this.consume(TokenType.WORD).getText())
      indices.push(key)
    }
    return new ArrayAccessExpression(variable, indices)
  }

  private matchExpression(): MatchExpression {
    // match expression {
    //  case pattern1: result1
    //  case pattern2 if extr: result2
    // }
    const expression = this.expression()
    this.consume(TokenType.LBRACE)
    const patterns: Pattern[] = []
    do {
      this.consume(TokenType.CASE)
      let pattern: Pattern | null = null
      const current = this.get(0)
      if (this.match(TokenType.NUMBER)) pattern = new ConstantPattern(new NumberValue(Number(current.getText())))
      else if (this.match(TokenType.HEX_NUMBER)) pattern = new ConstantPattern(new NumberValue(Number.parseInt(current.getText(), 16)))
      else if (this.match(TokenType.TEXT)) pattern = new ConstantPattern(new StringValue(current.getText()))
      else if (this.match(TokenType.WORD)) pattern = new VariablePattern(current.getText())
      if (pattern === null) throw new ParserException('Wrong pattern in match expression: ' + current)
      if (this.match(TokenType.IF)) pattern.optCondition = this.expression()
      this.consume(TokenType.COLON)
      pattern.result = new ReturnStatement(this.expression())
      patterns.push(pattern)
    } while (!this.match(TokenType.RBRACE))

    return new MatchExpression(expression, patterns)
  }

  private expression(): IExpression {
    return this.comma()
  }

  private comma(): IExpression {
    const result = this.ternary()

    if (this.lookMatch(0, TokenType.COMMA) && this.lookMatch(1, TokenType.COMMA)) {
      this.consume(TokenType.COMMA)
      this.consume(TokenType.COMMA)
      const right = this.expression()
      return new CommaExpression(result, right)
    }

    if (result instanceof ArrayAccessExpression && this.match(TokenType.EQ)) {
      const expression = this.expression()
      return new AssignmentExpression(result, expression)
    }

    return result
  }

  private ternary(): IExpression {
    const result = this.binary()

    if (this.match(TokenType.QUESTION)) {
      const trueExpr = this.expression()
      this.consume(TokenType.COLON)
      const falseExpr = this.expression()
      return new TernaryExpression(result, trueExpr, falseExpr)
    }

    return result
  }

  private binary(priority: number = 0): IExpression {
    const currentPriority = priority++
    const binary: Binary[] = [
      {
        name: 'logicalOr',
        list: [{ token: TokenType.BARBAR, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.OR) }],
      },
      {
        name: 'logicalAnd',
        list: [{ token: TokenType.AMPAMP, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.AND) }],
      },
      {
        name: 'bitwiseOr',
        list: [{ token: TokenType.BAR, class: BinaryExpression.bind(null, BinaryExpression.Operator.OR) }],
      },
      {
        name: 'bitwiseXor',
        list: [{ token: TokenType.CARET, class: BinaryExpression.bind(null, BinaryExpression.Operator.XOR) }],
      },
      {
        name: 'bitwiseAnd',
        list: [{ token: TokenType.AMP, class: BinaryExpression.bind(null, BinaryExpression.Operator.AND) }],
      },
      {
        name: 'equality',
        list: [
          { token: TokenType.EQEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.EQUALS) },
          { token: TokenType.EXCLEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.NOT_EQUALS) },
        ],
      },
      {
        name: 'conditional',
        list: [
          { token: TokenType.LT, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.LT) },
          { token: TokenType.LTEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.LTEQ) },
          { token: TokenType.GT, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.GT) },
          { token: TokenType.GTEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.GTEQ) },
        ],
      },
      {
        name: 'shift',
        list: [
          { token: TokenType.LTLT, class: BinaryExpression.bind(null, BinaryExpression.Operator.LSHIFT) },
          { token: TokenType.GTGT, class: BinaryExpression.bind(null, BinaryExpression.Operator.RSHIFT) },
          { token: TokenType.GTGTGT, class: BinaryExpression.bind(null, BinaryExpression.Operator.URSHIFT) },
        ],
      },
      {
        name: 'additive',
        list: [
          { token: TokenType.PLUS, class: BinaryExpression.bind(null, BinaryExpression.Operator.ADD) },
          { token: TokenType.MINUS, class: BinaryExpression.bind(null, BinaryExpression.Operator.SUBTRACT) },
          { token: TokenType.COLONCOLON, class: BinaryExpression.bind(null, BinaryExpression.Operator.PUSH) },
        ],
      },
      {
        name: 'multiplicative',
        list: [
          { token: TokenType.STAR, class: BinaryExpression.bind(null, BinaryExpression.Operator.MULTIPLY) },
          { token: TokenType.SLASH, class: BinaryExpression.bind(null, BinaryExpression.Operator.DIVIDE) },
          { token: TokenType.PERCENT, class: BinaryExpression.bind(null, BinaryExpression.Operator.REMAINDER) },
        ],
      },
    ]
    const current = binary[currentPriority]
    const isLast = currentPriority === binary.length - 1
    const next = !isLast ? this.binary.bind(this, priority) : this.unary.bind(this)
    let result = next()

    while (true) {
      const coincidence = current.list.some((i) => {
        return this.match(i.token) ? ((result = new i.class(result, next())), true) : false
      })
      if (coincidence) continue
      break
    }

    return result
  }

  private unary(): IExpression {
    // DELETE
    // VOID
    // TYPEOF
    if (this.match(TokenType.PLUS)) return new UnaryExpression(UnaryExpression.Operator.PLUS, this.primary())
    if (this.match(TokenType.MINUS)) return new UnaryExpression(UnaryExpression.Operator.NEGATION, this.primary())
    if (this.match(TokenType.TILDE)) return new UnaryExpression(UnaryExpression.Operator.BITWISE_NOT, this.primary())
    if (this.match(TokenType.EXCL)) return new UnaryExpression(UnaryExpression.Operator.LOGICAL_NOT, this.primary())
    // AWAIT

    return this.primary()
  }

  private primary(): IExpression {
    if (this.match(TokenType.COLONCOLON)) return new FunctionReferenceExpression(this.consume(TokenType.WORD).getText())
    if (this.match(TokenType.MATCH)) return this.matchExpression()
    if (this.match(TokenType.DEF)) return new ValueExpression(new UserDefinedFunction(this.getArguments(), this.getBody()))
    if (this.lookMatch(0, TokenType.LPAREN)) return this.nested()

    return this.variable()
  }

  private variable(): IExpression {
    // variable(args)
    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.LPAREN)) return this.function(new ValueExpression(this.consume(TokenType.WORD).getText()))

    if (this.lookMatch(0, TokenType.WORD)) {
      // arr["key"](args) || obj.key(args) || arr || obj
      const qualifiedNameExpr = this.qualifiedName()
      return this.lookMatch(0, TokenType.LPAREN) ? this.function(qualifiedNameExpr) : qualifiedNameExpr
    }

    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.EQ)) {
      const variable = this.consume(TokenType.WORD).getText()
      this.consume(TokenType.EQ)
      return new AssignmentExpression(variable, this.expression())
    }

    if (this.lookMatch(0, TokenType.LBRACKET)) return this.array()
    if (this.lookMatch(0, TokenType.LBRACE)) return this.map()

    return this.value()
  }

  private qualifiedName(): IExpression {
    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.LBRACKET)) return this.bracketNotation()
    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.DOT)) return this.dotNotation()
    const variable = this.consume(TokenType.WORD).getText()
    return new VariableExpression(variable)
  }

  private value(): IExpression {
    const current = this.get()

    if (this.match(TokenType.NUMBER)) return new ValueExpression(Number(current.getText()))
    if (this.match(TokenType.HEX_NUMBER)) return new ValueExpression(Number.parseInt(current.getText(), 16))
    if (this.match(TokenType.TEXT)) return new ValueExpression(current.getText())
    if (this.match(TokenType.WORD)) return new ValueExpression(current.getText())

    throw this.error('Unknown expression ' + current)
  }

  private nested(): IExpression {
    this.consume(TokenType.LPAREN)
    const result = this.expression()
    this.consume(TokenType.RPAREN)
    return result
  }

  private getArguments(): string[] {
    this.consume(TokenType.LPAREN)
    const argNames: string[] = []
    while (!this.match(TokenType.RPAREN)) {
      argNames.push(this.consume(TokenType.WORD).getText())
      this.match(TokenType.COMMA)
    }
    return argNames
  }

  private getBody(): IStatement {
    return this.lookMatch(0, TokenType.EQ) ? (this.match(TokenType.EQ), new ReturnStatement(this.expression())) : this.statementOrBlock()
  }

  private consume(type: TokenType): IToken {
    const current = this.get()
    if (current.getType() !== type) throw this.error('Token ' + current + " doesn't match " + TokenType[type])
    ++this.position
    return current
  }

  private match(type: TokenType): boolean {
    return type === this.get().getType() ? (++this.position, true) : false
  }

  private lookMatch(pos: number, type: TokenType): boolean {
    return this.get(pos).getType() === type
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.size) return new Token(TokenType.EOF, '', -1, -1)
    return this.tokens[position]
  }

  private error(text: string): Error {
    return new ParserException(text)
  }
}
