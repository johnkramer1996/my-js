import Lexer from 'Lexer'

const lexer = new Lexer('log helloWorld')
const tokens = lexer.tokenize()

console.log(tokens)
