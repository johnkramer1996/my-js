import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import Variables from '@lib/Variables'

enum KeyEvent {
  VK_UP,
  VK_DOWN,
  VK_LEFT,
  VK_RIGHT,
  VK_FIRE,
  VK_ESCAPE,
}

export default class Canvas implements IModule {
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private mouseHover = new ArrayValue([new NumberValue(0), new NumberValue(0)])
  private MINUS_ONE = new NumberValue(-1)
  private lastKey = this.MINUS_ONE

  init(): void {
    Functions.set('window', this.createWindow())
    Functions.set('prompt', this.prompt())
    Functions.set('keypressed', this.keypressed())
    Functions.set('mousehover', this.mousehover())
    Functions.set('line', this.line())
    Functions.set('oval', this.oval())
    Functions.set('foval', this.foval())
    Functions.set('rect', this.rect())
    Functions.set('frect', this.frect())
    // Functions.set('clip', this.clip())
    Functions.set('drawstring', this.drawstring())
    Functions.set('color', this.color())
    Functions.set('sleep', this.repaint())
    Functions.set('repaint', this.repaint())
    Functions.set('clear', this.clear())

    Variables.set('VK_UP', new NumberValue(KeyEvent.VK_UP))
    Variables.set('VK_DOWN', new NumberValue(KeyEvent.VK_DOWN))
    Variables.set('VK_LEFT', new NumberValue(KeyEvent.VK_LEFT))
    Variables.set('VK_RIGHT', new NumberValue(KeyEvent.VK_RIGHT))
    Variables.set('VK_FIRE', new NumberValue(KeyEvent.VK_FIRE))
    Variables.set('VK_ESCAPE', new NumberValue(KeyEvent.VK_ESCAPE))
  }

  createWindow() {
    return {
      execute: (...args: IValue[]): IValue => {
        const div = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.canvas.width = args[1]?.asNumber() ?? 640
        this.canvas.height = args[2]?.asNumber() ?? 480

        this.canvas.style.border = '1px solid'
        this.canvas.style.margin = '0 auto'
        div.appendChild(this.canvas)
        div.style.textAlign = 'center'
        ;(<HTMLBodyElement>document.querySelector('body')).appendChild(div)

        this.canvas.addEventListener('mousemove', (e) => {
          this.mouseHover.set(0, new NumberValue(e.offsetX))
          this.mouseHover.set(1, new NumberValue(e.offsetY))
        })

        document.addEventListener('keyup', (e) => {
          // this.lastKey = this.MINUS_ONE
        })

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.lastKey = new NumberValue(KeyEvent.VK_FIRE)
          if (e.key === 'Escape') this.lastKey = new NumberValue(KeyEvent.VK_ESCAPE)
          if (e.key === 'ArrowUp') this.lastKey = new NumberValue(KeyEvent.VK_UP)
          if (e.key === 'ArrowDown') this.lastKey = new NumberValue(KeyEvent.VK_DOWN)
          if (e.key === 'ArrowLeft') this.lastKey = new NumberValue(KeyEvent.VK_LEFT)
          if (e.key === 'ArrowRight') this.lastKey = new NumberValue(KeyEvent.VK_RIGHT)
        })

        return BooleanValue.TRUE
      },
    }
  }

  prompt() {
    return {
      execute: (...args: IValue[]): IValue => {
        const text = prompt(args[0].asString())

        return new StringValue(text ?? '')
      },
    }
  }

  keypressed() {
    return {
      execute: (...args: IValue[]): IValue => {
        const key = this.lastKey
        this.lastKey = this.MINUS_ONE
        return key
      },
    }
  }

  mousehover() {
    return {
      execute: (...args: IValue[]): IValue => {
        return this.mouseHover
      },
    }
  }

  line() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x1 = args[0].asNumber() ?? 100
        const y1 = args[1].asNumber() ?? 100
        const x2 = args[2].asNumber() ?? 200
        const y2 = args[3].asNumber() ?? 200

        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()

        return BooleanValue.TRUE
      },
    }
  }

  stroke() {
    return {
      execute: (...args: IValue[]): IValue => {
        this.ctx.strokeStyle = '#' + args[0].asNumber().toString(16) || 'rgba(255, 0, 0, 0.5)'

        return BooleanValue.TRUE
      },
    }
  }

  oval() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x = args[0].asNumber() || 100
        const y = args[1].asNumber() || 100
        const r = args[2].asNumber() || 50

        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, 2 * Math.PI)
        this.ctx.stroke()

        return BooleanValue.TRUE
      },
    }
  }

  foval() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x = args[0].asNumber() ?? 100
        const y = args[1].asNumber() ?? 100
        const r = args[2].asNumber() ?? 50

        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, 2 * Math.PI)
        this.ctx.fill()

        return BooleanValue.TRUE
      },
    }
  }

  rect() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x = args[0].asNumber() ?? 100
        const y = args[1].asNumber() ?? 100
        const w = args[2].asNumber() ?? 200
        const h = args[3].asNumber() ?? 200
        this.ctx.strokeRect(x, y, w, h)

        return BooleanValue.TRUE
      },
    }
  }

  frect() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x = args[0].asNumber() ?? 100
        const y = args[1].asNumber() ?? 100
        const w = args[2].asNumber() ?? 200
        const h = args[3].asNumber() ?? 200
        this.ctx.fillRect(x, y, w, h)

        return BooleanValue.TRUE
      },
    }
  }

  drawstring() {
    return {
      execute: (...args: IValue[]): IValue => {
        const title = args[0].asString()
        const x = args[1].asNumber() ?? 100
        const y = args[2].asNumber() ?? 100
        this.ctx.font = '50px serif'
        this.ctx.fillText(title, x, y)

        return BooleanValue.TRUE
      },
    }
  }

  color() {
    return {
      execute: (...args: IValue[]): IValue => {
        if (args.length === 3) {
          const color = `rgb(${args[0].asNumber()}, ${args[1].asNumber()}, ${args[2].asNumber()})`
          this.ctx.fillStyle = `${color}` ?? 'rgba(255, 0, 0, 0)'
          this.ctx.strokeStyle = `${color}` ?? 'rgba(255, 0, 0, 0)'
          return BooleanValue.TRUE
        }
        const color = args[0].asNumber().toString(16).padStart(6, '0')
        this.ctx.fillStyle = '#' + color ?? 'rgba(255, 0, 0, 0)'
        this.ctx.strokeStyle = '#' + color ?? 'rgba(255, 0, 0, 0)'
        return BooleanValue.TRUE
      },
    }
  }

  repaint() {
    return {
      execute: (...args: IValue[]): IValue => {
        return BooleanValue.TRUE
      },
    }
  }

  clear() {
    return {
      execute: (...args: IValue[]): IValue => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        return BooleanValue.TRUE
      },
    }
  }
}
