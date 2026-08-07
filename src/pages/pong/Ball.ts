const INITIAL_VELOCITY = 0.025
const VELOCITY_INCREASE = 0.000005

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function isCollision(rect1: DOMRect, rect2: DOMRect) {
  return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top
}

export class Ball {
  direction = { x: 0, y: 0 }
  velocity = INITIAL_VELOCITY

  constructor(private ballElem: HTMLElement) {
    this.reset()
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--x'))
  }
  set x(value: number) {
    this.ballElem.style.setProperty('--x', String(value))
  }
  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--y'))
  }
  set y(value: number) {
    this.ballElem.style.setProperty('--y', String(value))
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    this.x = 50
    this.y = 50
    this.direction = { x: 0, y: 0 }
    while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
      const heading = randomNumberBetween(0, 2 * Math.PI)
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY
  }

  update(delta: number, paddleRects: DOMRect[]) {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta
    this.velocity += VELOCITY_INCREASE * delta
    const rect = this.rect()

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1
    }

    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1
    }
  }
}
