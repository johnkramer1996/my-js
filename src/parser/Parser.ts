import Token, { IToken, KeyWord } from './Token'
import TokenType from './TokenType'
import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import LogStatement from '@ast/LogStatement'
import Literal from '@ast/Literal'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression, { BinaryOperator } from '@ast/BinaryExpression'
import UnaryExpression from '@ast/UnaryExpression'
import TernaryExpression from '@ast/TernarExpression'
import ConditionalExpression from '@ast/ConditionalExpression'
import IfStatement from '@ast/IfStatement'
import WhileStatement from '@ast/WhileStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import ForStatement from '@ast/ForStatement'
import BreakStatement from '@ast/BreakStatement'
import ContinueStatement from '@ast/ContinueStatement'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import ExpressionStatement from '@ast/ExpressionStatement'
import CallExpression from '@ast/CallExpression'
import UseStatement from '@ast/UseStatement'
import ReturnStatement from '@ast/ReturnStatement'
import ArrayExpression from '@ast/ArrayExpression'
import ContainerAccessExpression from '@ast/ContainerAccessExpression'
import { IAccessible } from '@ast/IAccessible'
import { Identifier } from '@ast/Identifier'
import { ArrayPattern } from '@ast/ArrayPattern'
import { Params } from '@ast/Params'
import ParseException from '@exceptions/ParseException'
import CommaExpression from '@ast/CommaExpresstion'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import MapExpression from '@ast/MapExpression'
import FunctionReferenceExpression from '@ast/FunctionReferenceExpression'
import ForeachStatement from '@ast/ForeachStatement'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import MatchExpression, { ConstantPattern, Pattern, VariablePattern } from '@ast/MatchExpression'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import Program from '@ast/Program'
import ThisExpression from '@ast/ThisExpression'
import Lexer from './Lexer'
import DebuggerStatement from '@ast/DebuggerStatement'
import BooleanValue from '@lib/BooleanValue'
import { AssignmentPattern } from '@ast/AssignmentPattern'
import FunctionExpression from '@ast/FunctionExpression'
import { Console } from 'components/App'
import UpdateExpression from '@ast/UpdateExpression'

// TODO add AssignInicialization

type ConditionalExpressionWithoutOperatorConsturctor = new (left: IExpression, right: IExpression) => ConditionalExpression
type BinaryExpressionWithoutOperatorConsturctor = new (left: IExpression, right: IExpression) => BinaryExpression

type Binary =
  | {
      name: string
      list: { token: TokenType; class: ConditionalExpressionWithoutOperatorConsturctor }[]
    }
  | {
      name: string
      list: { token: TokenType; class: BinaryExpressionWithoutOperatorConsturctor }[]
    } // TODO make a general class

export class Location {
  static token: IToken
  static prevToken: IToken
  static blocks: IToken[] = []
  static statements: IToken[] = []
  static setToken(token: IToken) {
    if (token.getType() === TokenType.EOF && this.token.getType() === TokenType.EOF) return
    this.prevToken = this.token
    this.token = token
  }
  static getPrevToken() {
    return this.prevToken
  }
  static getCurrentToken() {
    return this.token
  }
  static startStatement() {
    this.statements.push(this.token)
  }
  static endStatement() {
    const startToken = this.statements.pop()
    if (!startToken) throw new Error('startToken')
    return startToken
  }
  static startBlock() {
    this.blocks.push(this.token)
  }
  static endBlock() {
    const startToken = this.blocks.pop()
    if (!startToken) throw new Error('startToken')
    return startToken
  }
}

export default class Parser {
  public errors: ParseException[] = []
  private tokens: IToken[]
  private position = 0
  private size: number
  private brackets = [
    {
      openParent: TokenType.LPAREN,
      closeParent: TokenType.RPAREN,
    },
    {
      openParent: TokenType.LBRACKET,
      closeParent: TokenType.RBRACKET,
    },
    {
      openParent: TokenType.LBRACE,
      closeParent: TokenType.RBRACE,
    },
  ]
  private assignOperator = new Map([
    [TokenType.EQ, null],
    [TokenType.PLUSEQ, BinaryExpression.Operator.ADD],
    [TokenType.MINUSEQ, BinaryExpression.Operator.SUBTRACT],
    [TokenType.STAREQ, BinaryExpression.Operator.MULTIPLY],
    [TokenType.SLASHEQ, BinaryExpression.Operator.DIVIDE],
    [TokenType.PERCENTEQ, BinaryExpression.Operator.REMAINDER],
    [TokenType.AMPEQ, BinaryExpression.Operator.AND],
    [TokenType.CARETEQ, BinaryExpression.Operator.XOR],
    [TokenType.BAREQ, BinaryExpression.Operator.OR],
    [TokenType.COLONCOLONEQ, BinaryExpression.Operator.PUSH],
    [TokenType.LTLTEQ, BinaryExpression.Operator.LSHIFT],
    [TokenType.GTGTEQ, BinaryExpression.Operator.RSHIFT],
    [TokenType.GTGTGTEQ, BinaryExpression.Operator.URSHIFT],
  ])

  constructor(tokens: IToken[]) {
    this.tokens = tokens
    this.size = tokens.length
  }

  public parse(): Program {
    Location.setToken(this.get())
    Location.startBlock()
    const statements: IStatement[] = []
    while (!this.match(TokenType.EOF)) {
      try {
        statements.push(this.statementOrBlock())
        while (this.match(TokenType.SEMIKOLON));
      } catch (e) {
        if (e instanceof ParseException) {
          Console.error(`${e.name}: ${e.message}`, e.row, e.col)
        }
        console.log(e)
        this.position++
        return new Program(statements)
      }
    }
    return new Program(statements)
  }

  private statementOrBlock(): IStatement {
    return this.lookMatch(0, TokenType.LBRACE) ? this.block() : this.statement()
  }

  private block(): IStatement {
    Location.startBlock()
    const statements: IStatement[] = []
    this.consume(TokenType.LBRACE)
    while (!this.match(TokenType.RBRACE)) {
      statements.push(this.statementOrBlock())
      while (this.match(TokenType.SEMIKOLON));
    }
    return new BlockStatement(statements)
  }

  private statement(): IStatement {
    Location.startStatement()

    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    if (this.match(TokenType.IF)) return this.ifElseStatement()
    if (this.match(TokenType.WHILE)) return this.whileStatement()
    if (this.match(TokenType.DO)) return this.doWhileStatement()
    if (this.match(TokenType.FOR)) return this.forStatement()
    if (this.match(TokenType.BREAK)) return new BreakStatement()
    if (this.match(TokenType.CONTINUE)) return new ContinueStatement()
    if (this.match(TokenType.FUNCTION)) return this.functionDefine()
    if (this.match(TokenType.RETURN)) return new ReturnStatement(this.expression())
    if (this.match(TokenType.USE)) return new UseStatement(this.expression())
    // if (this.match(TokenType.MATCH)) return new ExpressionStatement(this.matchExpression())
    if (this.match(TokenType.DEBUGGER)) return new DebuggerStatement()
    if (this.lookMatch(0, TokenType.CONST) || this.lookMatch(0, TokenType.LET) || this.lookMatch(0, TokenType.VAR)) return this.variableDeclaration()
    try {
      return new ExpressionStatement(this.expression())
    } catch (e) {
      if (e instanceof Error) {
        throw this.error(e.message)
        // throw this.error('Unknown statement ' + current + this.get())
        // }
      }
      throw 123
    }
  }

  public variableDeclaration() {
    const kind = this.get().getText()
    this.match(TokenType.CONST) || this.match(TokenType.LET) || this.match(TokenType.VAR)
    const declarations: VariableDeclarator[] = []
    do {
      const identifier = new Identifier(this.consume(TokenType.WORD).getText())
      if (this.match(TokenType.EQ)) {
        declarations.push(new VariableDeclarator(identifier, this.expression()))
      } else if (kind === 'let' || kind === 'var') {
        declarations.push(new VariableDeclarator(identifier, null))
      } else throw new SyntaxError('Missing initializer in const declaration')
    } while (this.match(TokenType.COMMA))

    return new VaraibleDeclaration(declarations, kind)
  }

  private callExpression(qualifiedNameExpr: IExpression): CallExpression {
    this.consume(TokenType.LPAREN)
    const args: IExpression[] = []
    while (!this.match(TokenType.RPAREN)) {
      args.push(this.expression())
      if (!this.match(TokenType.COMMA)) {
        this.consume(TokenType.RPAREN)
        break
      }
    }

    const call = new CallExpression(qualifiedNameExpr, args)
    return this.lookMatch(0, TokenType.LPAREN) ? this.callExpression(call) : call
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

  private foreachArrayStatement(): IStatement {
    const openParen = this.match(TokenType.LPAREN)
    const variable = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COLON)
    const container = this.expression()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForeachStatement(container, statement, variable)
  }

  private foreachMapStatement(): IStatement {
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

  private simpleForStatement(): IStatement {
    const openParen = this.match(TokenType.LPAREN)

    Location.startStatement()
    const init = this.variableDeclaration()
    // new ExpressionStatement(this.assignmentExpression())
    this.consume(TokenType.SEMIKOLON)
    const test = this.expression()
    this.consume(TokenType.SEMIKOLON)
    Location.startStatement()
    const update = new ExpressionStatement(this.expression())
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForStatement(init, test, update, statement)
  }

  private assignmentExpression(qualifiedNameExpr: IAccessible = this.qualifiedName()): IExpression {
    // this.consume(TokenType.EQ)
    const current = this.get()
    const binary = this.assignOperator.get(this.get().getType())
    if (binary === undefined) throw new Error('undefiner')
    this.match(this.get(0).getType())
    return new AssignmentExpression(binary, qualifiedNameExpr, this.expression())
  }

  private functionDefine(): IStatement {
    const name = new Identifier(this.consume(TokenType.WORD).getText())

    return new FunctionDefineStatement(name, this.params(), this.block())
  }

  private array(): IExpression {
    let index = 1
    let bracket = 0
    let type = this.get(index).getType()
    for (; (type !== TokenType.RBRACKET && type !== TokenType.EOF) || bracket !== 0; type = this.get(++index).getType()) {
      if (type === TokenType.LBRACKET) ++bracket
      if (type === TokenType.RBRACKET) --bracket
    }
    if (this.get(index + 1).getType() !== TokenType.EQ) return this.arrayExprestion()
    const arrayPattern = this.arrayPattern()
    this.consume(TokenType.EQ)

    const arrayExprestion = this.expression()
    return new AssignmentExpression(null, arrayPattern, arrayExprestion)
  }

  private arrayPattern(): ArrayPattern {
    this.consume(TokenType.LBRACKET)
    const items: IAccessible[] = []
    while (!this.match(TokenType.RBRACKET)) {
      const name = this.identifier()
      const expr = this.match(TokenType.EQ) ? this.expression() : null
      items.push(expr ? new AssignmentPattern(name, expr) : name)
      this.match(TokenType.COMMA)
    }
    return new ArrayPattern(items)
  }

  private identifier(): IAccessible {
    if (this.lookMatch(0, TokenType.WORD)) return new Identifier(this.consume(TokenType.WORD).getText())
    return this.arrayPattern()
  }

  private arrayExprestion(): IExpression {
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

  private dotOrBracketNotation(): IExpression[] {
    const indices: IExpression[] = []
    while (this.lookMatch(0, TokenType.DOT) || this.lookMatch(0, TokenType.LBRACKET)) {
      if (this.match(TokenType.DOT)) {
        const current = this.get()
        const keywords = [...Lexer.KEYWORDS.values()]
        const isKeyword = keywords.find((k) => k === current.getType())
        const key = new Literal(this.consume(isKeyword ? current.getType() : TokenType.WORD).getText(), current.getRaw())
        indices.push(key)
      }
      if (this.match(TokenType.LBRACKET)) {
        indices.push(this.expression())
        this.consume(TokenType.RBRACKET)
      }
    }
    return indices
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
      if (pattern === null) throw this.error('Wrong pattern in match expression: ' + current)
      if (this.match(TokenType.IF)) pattern.optCondition = this.expression()
      this.consume(TokenType.COLON)
      pattern.result = new ReturnStatement(this.expression())
      patterns.push(pattern)
    } while (!this.match(TokenType.RBRACE))

    return new MatchExpression(expression, patterns)
  }

  private expression(): IExpression {
    const expr = this.comma()
    return expr
  }

  private comma(): IExpression {
    const result = this.assignment()

    if (this.lookMatch(0, TokenType.COMMA) && this.lookMatch(1, TokenType.COMMA)) {
      this.consume(TokenType.COMMA)
      this.consume(TokenType.COMMA)
      const right = this.expression()
      return new CommaExpression(result, right)
    }

    return result
  }

  private assignment(): IExpression {
    const pos = this.position
    if (this.lookMatch(0, TokenType.WORD)) {
      const identifier = this.qualifiedName()
      if (this.assignOperator.has(this.get().getType())) return this.assignmentExpression(identifier)
    }
    this.position = pos

    return this.ternary()
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
    //UpdateExpression
    if (this.match(TokenType.PLUSPLUS)) return new UpdateExpression(UpdateExpression.Operator.INCREMENT, this.primary())
    if (this.match(TokenType.MINUSMINUS)) return new UpdateExpression(UpdateExpression.Operator.DECREMENT, this.primary())

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
    if (this.lookMatch(0, TokenType.LPAREN)) return this.nested()

    return this.variable()
  }

  private variable(): IExpression {
    if (this.lookMatch(0, TokenType.WORD)) {
      const qualifiedNameExpr = this.qualifiedName()
      if (this.lookMatch(0, TokenType.LPAREN)) return this.callExpression(qualifiedNameExpr)

      //UpdateExpression
      if (this.match(TokenType.PLUSPLUS)) return new UpdateExpression(UpdateExpression.Operator.INCREMENT, qualifiedNameExpr, false)
      if (this.match(TokenType.MINUSMINUS)) return new UpdateExpression(UpdateExpression.Operator.DECREMENT, qualifiedNameExpr, false)
      return qualifiedNameExpr
    }

    return this.value()
  }

  private value(): IExpression {
    const current = this.get()

    if (this.lookMatch(0, TokenType.LBRACKET)) return this.array()
    if (this.lookMatch(0, TokenType.LBRACE)) return this.map()
    //FunctionExpression
    //ArrowFunctionExpression
    if (this.match(TokenType.FUNCTION)) return new FunctionExpression(this.params(), this.body())
    if (this.match(TokenType.NUMBER)) return new Literal(Number(current.getText()), current.getRaw())
    if (this.match(TokenType.HEX_NUMBER)) return new Literal(Number.parseInt(current.getText(), 16), current.getRaw())
    if (this.match(TokenType.TEXT)) return new Literal(current.getText(), current.getRaw())
    if (this.match(TokenType.WORD)) return new Literal(current.getText(), current.getRaw())
    if (this.match(TokenType.LOG)) return new Literal(current.getText(), current.getRaw())
    if (this.match(TokenType.THIS)) return new ThisExpression()
    if (this.match(TokenType.TRUE)) return new Literal(BooleanValue.TRUE, current.getRaw())
    if (this.match(TokenType.FALSE)) return new Literal(BooleanValue.FALSE, current.getRaw())

    throw this.error('Expression expected instead get ' + current)
  }

  private qualifiedName(): IAccessible {
    if (this.lookMatch(0, TokenType.WORD) && (this.lookMatch(1, TokenType.LBRACKET) || this.lookMatch(1, TokenType.DOT)))
      return new ContainerAccessExpression(this.consume(TokenType.WORD).getText(), this.dotOrBracketNotation())
    return new Identifier(this.consume(TokenType.WORD).getText())
  }

  private nested(): IExpression {
    this.consume(TokenType.LPAREN)
    const result = this.expression()
    this.consume(TokenType.RPAREN)
    return result
  }

  private params(): Params {
    this.consume(TokenType.LPAREN)
    const paramsNames = new Params()
    while (!this.match(TokenType.RPAREN)) {
      const value = this.identifier()

      paramsNames.add(value, this.match(TokenType.EQ) ? this.expression() : null)
      this.match(TokenType.COMMA)
    }
    return paramsNames
  }

  private body(): IStatement {
    return this.match(TokenType.EQ) ? new ReturnStatement(this.expression()) : this.statementOrBlock()
  }

  private addPosition() {
    this.position++
    Location.setToken(this.get())
  }

  private consume(type: TokenType): IToken {
    const current = this.get()
    if (current.getType() !== type) throw this.error('Token ' + current + " doesn't match " + TokenType[type])
    this.addPosition()
    return current
  }

  private match(type: TokenType): boolean {
    return type === this.get().getType() ? (this.addPosition(), true) : false
  }

  private lookMatch(pos: number, type: TokenType): boolean {
    return this.get(pos).getType() === type
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.size) return new Token(TokenType.EOF, '', '', -1, -1, -1, -1)
    return this.tokens[position]
  }

  private getPrev(relativePosition: number = 1): IToken {
    return this.tokens[this.position - relativePosition]
  }

  private error(text: string): Error {
    const current = this.get()
    return new ParseException(text, current.getRow(), current.getCol())
  }
}
