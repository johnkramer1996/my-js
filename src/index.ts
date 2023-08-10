import AssignValidator from '@visitors/Hoisting'
import Lexer from 'parser/Lexer'
import Parser, { Location } from 'parser/Parser'
import CallStack from '@lib/CallStack'
import program from '../scope.my-js'
import './style/main.scss'
import TokenType from 'parser/TokenType'
import Token, { IToken } from 'parser/Token'
import Program from '@ast/Program'

// for node.js
// import { readFileSync } from 'fs'
// const program = readFileSync('program.my-js', 'utf8')

class View {
  body: HTMLBodyElement
  mainContainer: HTMLElement
  textarea: HTMLTextAreaElement
  textDiv: HTMLElement
  ast: HTMLElement
  constructor(str: string) {
    this.body = document.querySelector('body') as HTMLBodyElement
    this.mainContainer = document.createElement('div')
    this.textarea = document.createElement('textarea')
    this.textDiv = document.createElement('div')
    this.ast = document.createElement('div')

    this.textarea.spellcheck = false
    this.textarea.value = str

    this.mainContainer.classList.add('mainContainer')
    this.textarea.classList.add('textarea')
    this.textDiv.classList.add('text')
    this.ast.classList.add('ast')

    // left
    const left = document.createElement('div')
    left.classList.add('left')
    left.appendChild(this.textDiv)
    left.appendChild(this.textarea)

    //right
    const right = document.createElement('div')
    right.classList.add('right')
    right.appendChild(this.ast)

    this.mainContainer.appendChild(left)
    this.mainContainer.appendChild(right)
    this.body.appendChild(this.mainContainer)
  }

  setText(tokens: IToken[]) {
    const original = program
    let result = ''
    let lastEnd = 0
    for (const item of tokens) {
      const start = item.getStart()
      const end = item.getEnd()
      const type = item.getType()
      const text = item.getRaw()
      result += original.slice(lastEnd, start)
      lastEnd = end
      const isKeyWord = Lexer.KEYWORDS.has(text)
      let className = ''
      if (type === TokenType.FUNCTION) className = 'def'
      else if (isKeyWord) className = 'keyword'
      else if (type === TokenType.NUMBER) className = 'number'
      else if (type === TokenType.TEXT) className = 'string'
      result += `<span class="${className}">${text}</span>`
    }

    this.textDiv.innerHTML = result
  }

  setAst(ast: Program) {
    this.ast.innerHTML = JSON.stringify(ast, null, 2)
  }
}

try {
  const view = new View(program)
  const lexer = new Lexer(program)
  const tokens = lexer.tokenize()
  view.setText(tokens)
  const parser = new Parser(tokens)
  const ast = parser.parse()
  view.setAst(ast)
  ast.creation()
  ast.execute()
} catch (e) {
  if (e instanceof Error) {
    console.error('custom error')
    console.dir(`${e.name}: ${e.message}`)
    for (const call of CallStack.getCalls()) console.log(`\tat ${call}`)
  }
}
