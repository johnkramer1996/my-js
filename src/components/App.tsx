import { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import IExpression, { isIExpression } from '@ast/IExpression'
import IStatement, { isIStatement } from '@ast/IStatement'
import { Identifier } from '@ast/Identifier'
import Literal from '@ast/Literal'
import Program from '@ast/Program'
import LexerException from '@exceptions/LexerException'
import ParserException from '@exceptions/ParseException'
import CallStack from '@lib/CallStack'
import Value from '@lib/Value'
import Variables from '@lib/Variables'
import HighLightVisitor from '@visitors/HighLightVisitor'
import Lexer from 'parser/Lexer'
import Parser, { Location } from 'parser/Parser'
import { IToken } from 'parser/Token'
import TokenType from 'parser/TokenType'
import React, { useEffect, useState } from 'react'

const program = `10 `

export class Console {
  public static results: string[] = []
  public static errors: [number, number][] = []
  public static log(str: string) {
    this.results.push(str)
  }
  public static error(str: string, row: number, col: number) {
    this.results.push(str)
    this.errors.push([row, col])
  }
}

type code = { space: string; text: string; className: string }

const getTokens = (text: string) => {
  const lexer = new Lexer(text)
  return lexer.tokenize()
}

const getAst = (tokens: IToken[]) => {
  const parser = new Parser(tokens)
  return parser.parse()
}

const getCode = (program: string, tokens: IToken[]) => {
  const original = program
  let lastEnd = 0
  const codes: code[] = []
  for (const item of tokens) {
    const start = item.getStart()
    const end = item.getEnd()
    const type = item.getType()
    let text = item.getRaw()
    const col = item.getCol()
    const row = item.getRow()
    const space = original.slice(lastEnd, start)
    lastEnd = end
    const isKeyWord = Lexer.KEYWORDS.has(text)

    let className = ''
    if (type === TokenType.NUMBER) className = 'number'
    else if (type === TokenType.TEXT) className = 'string'
    else if (type === TokenType.FUNCTION) className = 'def'
    else if (isKeyWord) className = 'keyword'

    for (const [r, c] of Console.errors) {
      // if (r === row && c === col) className += ' error'
    }

    codes.push({ space, text, className })
  }
  return codes
}

// : {ast: IStatement | IExpression | null}
type myType = { [ast: string]: IStatement | IExpression | null }

const createNode = (node: IStatement | IExpression) => {}

const Node = (props: myType): JSX.Element => {
  const { ast } = props
  if (!ast) return <></>
  const name = Object.getPrototypeOf(ast).constructor.name
  const [visible, setVisible] = useState(true || name === 'Program')
  const arr = []

  for (const [key, value] of Object.entries(ast)) {
    if (value instanceof Location) {
      arr.push(['start', value.start])
      arr.push(['end', value.end])
    } else if (value instanceof Value) {
      arr.push([key, value.getValue()])
    } else if (Array.isArray(value)) {
      arr.push([key, value.map((el) => <Node ast={el} />)])
    } else if (typeof value === 'object') {
      arr.push([key, <Node ast={value} />])
    } else arr.push([key, value])
  }

  return (
    <>
      <span className="ast__title" onClick={() => setVisible(!visible)}>
        {name}
      </span>
      <span className="ast__notation">&#123;</span>
      <ul className={`ast__list ${visible ? '' : 'hidden'}`}>
        <li>
          <span className="ast__key">Type</span>
          <span className="ast__dot">:</span>
          <span className="ast__value">"{Object.getPrototypeOf(ast).constructor.name}"</span>
        </li>
        {arr
          // .sort(([, a], [, b]) => (typeof a === 'object' ? 1 : typeof b === 'object' ? -1 : 0))
          .map(([key, value]) => {
            const isArray = Array.isArray(value)
            const isObject = typeof value === 'object'
            const isPrimary = !(isArray || isObject)
            const [visible, setVisible] = useState(true)
            return (
              <li className={`ast__entry`}>
                <span className="ast__key" onClick={() => setVisible(!visible)}>
                  {key}
                  <span className="ast__dot">:</span> <span className="ast__notation">{isArray ? '[' : isObject ? '{' : ''}</span>
                </span>
                {isPrimary ? (
                  <>
                    <span className="ast__dot">:</span>
                    <span className="ast__value">{value}</span>
                  </>
                ) : isArray ? (
                  <>
                    <>
                      <div className={`ast__value ${visible ? '' : 'hidden'}`}>{value}</div>
                      <span className="ast__notation">{isArray ? ']' : isObject ? '}' : ''}</span>
                    </>
                  </>
                ) : (
                  <>
                    <span className="ast__dot">:</span>
                    {/* <span className="ast__notation">{isArray ? '[' : isObject ? '{' : ''}</span> */}
                    <span className={`ast__value ${visible ? '' : 'hidden'}`}>{value}</span>
                    {/* <span className="ast__notation">{isArray ? ']' : isObject ? '}' : ''}</span> */}
                  </>
                )}
              </li>
            )
          })}
      </ul>
      <span className="ast__notation">&#125;</span>
    </>
  )
}

const App = () => {
  const [code, setCode] = useState<code[]>([])
  const [log, setConsole] = useState<string[]>([])
  const [ast, setAst] = useState<IStatement | IExpression | null>(null)
  const [input, setInput] = useState<string>(program)
  useEffect(() => {
    execute(program)
  }, [])

  const execute = (program: string) => {
    Variables.init()
    const tokens: IToken[] = getTokens(program)
    setCode(getCode(program, tokens))
    const ast = getAst(tokens)
    setConsole(Console.results)
    Console.results = []

    setAst(ast)
    console.log(createNode(ast))

    ast.accept(new HighLightVisitor())
  }

  const onChange = (value: string) => {
    setInput(value)
    execute(value)
  }

  return (
    <>
      <div className="left">
        <div className="text">
          {code.map(({ space, text, className }, i) => {
            return (
              <React.Fragment key={i}>
                {space}
                <span className={className}>{text}</span>
              </React.Fragment>
            )
          })}
        </div>
        <textarea className="textarea" value={input} onChange={(e) => onChange(e.target.value)} spellCheck={false}></textarea>
      </div>
      <div className="right">
        <div className="ast">{<Node ast={ast}></Node>}</div>
        {/* <div className="errors" style={{ color: 'red' }}>
          {log.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div> */}
      </div>
    </>
  )
}

export default App
