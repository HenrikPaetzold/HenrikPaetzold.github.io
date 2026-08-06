import { useEffect, useRef } from 'react'
import { Ball } from './Ball'
import { Paddle } from './Paddle'
import './style.css'

export function PongGame() {
  const ballRef = useRef<HTMLDivElement>(null)
  const playerPaddleRef = useRef<HTMLDivElement>(null)
  const computerPaddleRef = useRef<HTMLDivElement>(null)
  const playerScoreRef = useRef<HTMLDivElement>(null)
  const computerScoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ball = new Ball(ballRef.current!)
    const playerPaddle = new Paddle(playerPaddleRef.current!)
    const computerPaddle = new Paddle(computerPaddleRef.current!)
    const playerScore = playerScoreRef.current!
    const computerScore = computerScoreRef.current!

    let lastTime: number | undefined
    let frame = 0

    function isLose() {
      const rect = ball.rect()
      return rect.right >= window.innerWidth || rect.left <= 0
    }

    function handleLose() {
      const rect = ball.rect()
      if (rect.right >= window.innerWidth) {
        playerScore.textContent = String(parseInt(playerScore.textContent ?? '0') + 1)
      } else {
        computerScore.textContent = String(parseInt(computerScore.textContent ?? '0') + 1)
      }
      ball.reset()
      computerPaddle.reset()
    }

    function update(time: number) {
      if (lastTime != null) {
        const delta = time - lastTime
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        computerPaddle.update(delta, ball.y)
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hue'))
        document.documentElement.style.setProperty('--hue', String(hue + delta * 0.01))
      }
      if (isLose()) handleLose()
      lastTime = time
      frame = window.requestAnimationFrame(update)
    }

    function onMouseMove(e: MouseEvent) {
      playerPaddle.position = (e.y / window.innerHeight) * 100
    }

    document.addEventListener('mousemove', onMouseMove)
    frame = window.requestAnimationFrame(update)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div className="score">
        <div id="player-score" ref={playerScoreRef}>
          0
        </div>
        <div id="computer-score" ref={computerScoreRef}>
          0
        </div>
      </div>
      <div className="ball" id="ball" ref={ballRef} />
      <div className="paddle left" id="player-paddle" ref={playerPaddleRef} />
      <div className="paddle right" id="computer-paddle" ref={computerPaddleRef} />
    </>
  )
}
