const SPEED = 0.02

export class Paddle {
  constructor(private paddleElem: HTMLElement) {
    this.reset()
  }

  get position() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--position'))
  }
  set position(value: number) {
    this.paddleElem.style.setProperty('--position', String(value))
  }

  rect() {
    return this.paddleElem.getBoundingClientRect()
  }

  reset() {
    this.position = 50
  }

  update(delta: number, ballHeight: number) {
    this.position += SPEED * delta * (ballHeight - this.position)
  }
}
