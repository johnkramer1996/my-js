import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Variables from '@lib/Variables'
import Lexer from 'parser/Lexer'
import Parser from 'parser/Parser'
import { IToken } from 'parser/Token'
import { useEffect, useState } from 'react'
import Node from './Node'
import Editor from './Editor'

const program = `i++; --i`

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

  public static clear() {
    Console.results = []
  }
}

const App = () => {
  const [log, setConsole] = useState<string[]>([])
  const [ast, setAst] = useState<IStatement | IExpression | null>(null)
  const [tokens, setTokens] = useState<IToken[]>([])
  useEffect(() => {
    execute(program)
  }, [])

  const execute = (program: string) => {
    Variables.init()
    const lexer = new Lexer(program)
    const tokens = lexer.tokenize()
    const parser = new Parser(tokens)
    const ast = parser.parse()
    //get errors

    setTokens(tokens)
    setAst(ast)
    setConsole(Console.results)
    Console.clear()
  }

  return (
    <>
      <h1>AST Explorer</h1>
      <div className="left">
        <Editor program={program} tokens={tokens} execute={execute} />
      </div>
      <div className="right">
        <div className="ast">{<Node ast={ast} />}</div>
        <div className="errors" style={{ color: 'red' }}>
          {log.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
