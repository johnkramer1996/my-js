import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'

// body.appendChild(canvas)

export default class Canvas implements IModule {
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private mouseHover = new ArrayValue([new NumberValue(0), new NumberValue(0)])

  init(): void {
    Functions.set('window', this.createWindow())
    // Functions.set("prompt", new Prompt());
    // Functions.set("keypressed", new KeyPressed());
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
  }

  createWindow() {
    return {
      execute: (...args: IValue[]): IValue => {
        const div = document.createElement('div')
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.canvas.width = args[1]?.asNumber() || 640
        this.canvas.height = args[2]?.asNumber() || 480

        this.canvas.style.border = '1px solid'
        this.canvas.style.margin = '0 auto'
        div.appendChild(this.canvas)
        div.style.textAlign = 'center'
        ;(<HTMLBodyElement>document.querySelector('body')).appendChild(div)

        this.canvas.addEventListener('mousemove', (e) => {
          this.mouseHover.set(0, new NumberValue(e.offsetX))
          this.mouseHover.set(1, new NumberValue(e.offsetY))
        })

        return BooleanValue.TRUE
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
        const x1 = args[0].asNumber() || 100
        const y1 = args[1].asNumber() || 100
        const x2 = args[2].asNumber() || 200
        const y2 = args[3].asNumber() || 200

        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(y2, y2)
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
        const x = args[0].asNumber() || 100
        const y = args[1].asNumber() || 100
        const r = args[2].asNumber() || 50

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
        const x = args[0].asNumber() || 100
        const y = args[1].asNumber() || 100
        const w = args[2].asNumber() || 200
        const h = args[3].asNumber() || 200
        this.ctx.strokeRect(x, y, w, h)

        return BooleanValue.TRUE
      },
    }
  }

  frect() {
    return {
      execute: (...args: IValue[]): IValue => {
        const x = args[0].asNumber() || 100
        const y = args[1].asNumber() || 100
        const w = args[2].asNumber() || 200
        const h = args[3].asNumber() || 200
        this.ctx.fillRect(x, y, w, h)

        return BooleanValue.TRUE
      },
    }
  }

  drawstring() {
    return {
      execute: (...args: IValue[]): IValue => {
        const title = args[0].asString()
        const x = args[1].asNumber() || 100
        const y = args[2].asNumber() || 100
        this.ctx.font = '50px serif'
        this.ctx.fillText(title, x, y)

        return BooleanValue.TRUE
      },
    }
  }

  color() {
    return {
      execute: (...args: IValue[]): IValue => {
        this.ctx.fillStyle = '#' + args[0].asNumber().toString(16) || 'rgba(255, 0, 0, 0.5)'

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
