import AssignValidator from '@visitors/Hoisting'
import Lexer from 'parser/Lexer'
import Parser, { Location } from 'parser/Parser'
import CallStack from '@lib/CallStack'
import program from '../scope.my-js'
import './style/main.scss'
import TokenType from 'parser/TokenType'
import Token, { IToken } from 'parser/Token'
import Program from '@ast/Program'
import View from 'View'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'components/App'

// const view = new View(program)

const body = document.querySelector('body')
const root = document.createElement('div')
body?.appendChild(root)
root.classList.add('mainContainer')
createRoot(root).render(React.createElement(App))
