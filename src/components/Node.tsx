import IExpression from '@ast/IExpression'
import IStatement from '@ast/IStatement'
import Value from '@lib/Value'
import { useState } from 'react'

type INodeComponent = { [ast: string]: IStatement | IExpression | null }

const Node = (props: INodeComponent): JSX.Element => {
  const { ast } = props
  if (!ast) return <></>
  const name = Object.getPrototypeOf(ast).constructor.name
  const [visible, setVisible] = useState(true || name === 'Program')
  const arr = []

  for (const [key, value] of Object.entries(ast)) {
    if (value instanceof Value) {
      arr.push([key, value.getValue()])
    } else if (Array.isArray(value)) {
      arr.push([key, value.map((el) => <Node ast={el} />)])
    } else if (typeof value === 'object' && value !== null) {
      arr.push([key, <Node ast={value} />])
    } else {
      if (!(value == null)) arr.push([key, value])
    }
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
          .sort(([, a], [, b]) => (typeof a === 'object' ? 1 : typeof b === 'object' ? -1 : 0))
          .map(([key, value], i) => {
            const isArray = Array.isArray(value)
            const isObject = typeof value === 'object'
            const isPrimary = !(isArray || isObject)
            const [visible, setVisible] = useState(true)
            return (
              <li className={`ast__entry`} key={i}>
                <span className="ast__key" onClick={() => setVisible(!visible)}>
                  {key}
                  <span className="ast__dot">:</span> <span className="ast__notation">{isArray ? '[' : isObject ? '{' : ''}</span>
                </span>
                {isPrimary ? (
                  <>
                    <span className="ast__dot">:</span>
                    <span className="ast__value">{value.toString()}</span>
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
                    <span className={`ast__value ${visible ? '' : 'hidden'}`}>{value}</span>
                    {/* <span className="ast__notation">{isArray ? '[' : isObject ? '{' : ''}</span> */}
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

export default Node
