import Program from '@ast/Program'
import Lexer from 'parser/Lexer'
import { IToken } from 'parser/Token'
import TokenType from 'parser/TokenType'

export default class View {
  body: HTMLBodyElement
  mainContainer: Element
  textarea: HTMLTextAreaElement
  textDiv: HTMLElement
  ast: HTMLElement
  constructor(public original: string) {
    this.body = document.querySelector('body') as HTMLBodyElement
    this.mainContainer = document.createElement('div')
    this.textarea = document.createElement('textarea')
    this.textDiv = document.createElement('div')
    this.ast = document.createElement('div')

    this.textarea.spellcheck = false
    this.textarea.value = original

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

  setAst(ast: Program) {
    this.ast.innerHTML = JSON.stringify(ast, null, 2)
  }
}
