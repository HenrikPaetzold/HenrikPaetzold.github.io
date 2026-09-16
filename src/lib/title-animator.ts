import { funMessages } from './fun-messages'

declare global {
  interface Window {
    t4rry?: (arg?: unknown) => void
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function RIB(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const TRIGGER_WORDS = ['pong', 'snake', 't4rry'] as const
const IDLE_LWB = 300
const IDLE_UPB = 3600

export class TitleAnimator {
  private keys: string[] = []
  private transitioning = false
  private introRunning = true
  private queuedIntroTrigger: (() => void) | null = null
  private idleTimeout: ReturnType<typeof setTimeout> | null = null
  private t4rryLooping = false
  private lwb = IDLE_LWB
  private upb = IDLE_UPB
  private destroyed = false

  constructor(
    private titleEl: HTMLAnchorElement,
    private selEl: HTMLAnchorElement,
    private cursorEl: HTMLSpanElement,
  ) {}

  init() {
    window.addEventListener('keydown', this.onKeydown)
    window.t4rry = (arg?: unknown) => this.t4rry(arg)
    this.intro()
  }

  destroy() {
    this.destroyed = true
    window.removeEventListener('keydown', this.onKeydown)
    if (this.idleTimeout) clearTimeout(this.idleTimeout)
  }

  private onKeydown = (event: KeyboardEvent) => {
    this.resetIdleTimer()
    this.keys.push(event.key.toLowerCase())
    if (this.keys.length > 10) this.keys.shift()
    const currentSequence = this.keys.join('')
    for (const word of TRIGGER_WORDS) {
      if (!currentSequence.includes(word)) continue
      this.keys = []
      const run = () => this.runTrigger(word)
      if (this.introRunning && !this.queuedIntroTrigger) {
        this.queuedIntroTrigger = run
        continue
      }
      if (this.transitioning) {
        this.cancelCurrentAnimation().then(run)
      } else {
        run()
      }
    }
  }

  private runTrigger(word: (typeof TRIGGER_WORDS)[number]) {
    if (word === 'pong') this.startTrigger('Pong 🏓', './pong/index.html')
    else if (word === 'snake') this.startTrigger('Snake 🐍', './snake/snake.html')
    else this.t4rry()
  }

  private async startTrigger(text: string, link: string) {
    if (this.transitioning) await this.cancelCurrentAnimation()
    this.transitioning = true
    await this.deleteName()
    if (this.destroyed) return
    await wait(1500)
    if (this.destroyed) return
    for (const c of text) {
      this.titleEl.textContent += c
      await wait(100)
      if (this.destroyed) return
    }
    this.titleEl.setAttribute('href', link)
    this.titleEl.classList.remove('nolink')
    this.resetIdleTimer()
    await wait(RIB(5, 15) * 1000)
    if (this.destroyed) return
    await this.revert()
    this.transitioning = false
  }

  private async cancelCurrentAnimation() {
    this.transitioning = false
    await this.revert()
  }

  private async deleteName() {
    await wait(750)
    if (this.destroyed) return
    this.cursorEl.className = 'hidden'
    await this.backwardSelect()
    if (this.destroyed) return
    await wait(800)
    if (this.destroyed) return
    this.cursorEl.className = 'typing'
    this.selEl.textContent = ''
    this.selEl.style.backgroundColor = 'transparent'
  }

  private async revert() {
    await this.deleteName()
    if (this.destroyed) return
    await wait(1500)
    if (this.destroyed) return
    this.titleEl.removeAttribute('href')
    this.titleEl.classList.add('nolink')
    for (const c of 'Henrik Pätzold') {
      this.titleEl.textContent += c
      await wait(100)
      if (this.destroyed) return
    }
  }

  private async backwardSelect() {
    let text = this.titleEl.textContent ?? ''
    let sel = ''
    for (let i = text.length; i > 0; i--) {
      const lastChar = text.slice(-1)
      text = text.slice(0, -1)
      sel = lastChar + sel
      this.titleEl.textContent = text
      this.selEl.textContent = sel
      await wait(25)
      if (this.destroyed) return
    }
  }

  async intro() {
    this.introRunning = true
    await wait(3000)
    if (this.destroyed) return
    await this.revert()
    this.introRunning = false
    if (this.destroyed) return
    if (this.queuedIntroTrigger) {
      const fn = this.queuedIntroTrigger
      this.queuedIntroTrigger = null
      fn()
    }
    this.resetIdleTimer()
  }

  private resetIdleTimer() {
    if (this.idleTimeout) clearTimeout(this.idleTimeout)
    this.idleTimeout = setTimeout(() => this.runRandomFun(), RIB(this.lwb, this.upb) * 1000)
  }

  private async runRandomFun() {
    if (this.transitioning || this.introRunning || this.destroyed) return
    const fun = funMessages[RIB(0, funMessages.length - 1)]
    this.transitioning = true
    await this.deleteName()
    if (this.destroyed) return
    await wait(1000)
    if (this.destroyed) return
    this.titleEl.classList.add('fun-message')
    for (const c of '🤖>> ' + fun) {
      this.titleEl.textContent += c
      await wait(100)
      if (this.destroyed) return
    }
    await wait(RIB(5, 15) * 1000)
    if (this.destroyed) return
    this.titleEl.classList.remove('fun-message')
    await this.revert()
    this.transitioning = false
    this.resetIdleTimer()
  }

  t4rry(arg?: unknown) {
    if (arg === undefined) {
      this.t4rryLooping = !this.t4rryLooping
      if (this.t4rryLooping) {
        this.lwb = 1
        this.upb = 10
        console.log('>>> root access')
      } else {
        this.lwb = IDLE_LWB
        this.upb = IDLE_UPB
        console.log('>>> napping')
      }
      this.resetIdleTimer()
      return
    }
    if (typeof arg === 'number') {
      const index = Math.abs(arg) % funMessages.length
      console.log(`>>> t4rry message #${index}: ${funMessages[index]}`)
      this.showT4rryMessage(funMessages[index])
      return
    }
    if (typeof arg === 'string') {
      console.log(`>>> t4rry says: ${arg}`)
      this.showT4rryMessage(arg)
    }
  }

  private async showT4rryMessage(text: string) {
    if (this.transitioning || this.introRunning) return
    this.transitioning = true
    await this.deleteName()
    if (this.destroyed) return
    await wait(800)
    if (this.destroyed) return
    this.titleEl.classList.add('fun-message')
    for (const c of '🤖>> ' + text) {
      this.titleEl.textContent += c
      await wait(75)
      if (this.destroyed) return
    }
    await wait(RIB(5, 15) * 1000)
    if (this.destroyed) return
    this.titleEl.classList.remove('fun-message')
    await this.revert()
    this.transitioning = false
    this.resetIdleTimer()
  }
}
