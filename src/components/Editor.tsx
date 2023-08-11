import Lexer from 'parser/Lexer'
import { IToken } from 'parser/Token'
import TokenType from 'parser/TokenType'
import { useEffect, useState } from 'react'
import { Console } from './App'

type Lyxema = { space: string; text: string; className: string }

const getCode = (program: string, tokens: IToken[]) => {
  const original = program
  let lastEnd = 0
  const codes: Lyxema[] = []
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

const Editor = ({ program, tokens, execute }: { program: string; tokens: IToken[]; execute: (str: string) => void }) => {
  const [input, setInput] = useState<string>(program)
  const [code, setCode] = useState<Lyxema[]>([])

  useEffect(() => {
    setCode(getCode(program, tokens))
  }, [program, tokens])

  const onChange = (value: string) => {
    setInput(value)
    execute(value)
  }

  return (
    <>
      <div className="text">
        {code.map(({ space, text, className }, i) => {
          return (
            <>
              {space}
              <span className={className}>{text}</span>
            </>
          )
        })}
      </div>
      <textarea className="textarea" value={input} onChange={(e) => onChange(e.target.value)} spellCheck={false}></textarea>
    </>
  )
}

export default Editor
