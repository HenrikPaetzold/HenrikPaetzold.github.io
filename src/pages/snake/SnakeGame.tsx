import { useEffect, useRef } from 'react'
import { initSnakeGame, destroySnakeGame } from './snake-engine'
import { initLeaderboard } from './leaderboard'
import './style.css'

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    initSnakeGame(canvasRef.current!)
    initLeaderboard()
    return () => destroySnakeGame()
  }, [])

  return (
    <div className="app">
      <aside>
        <div>
          <h1>Leaderboard</h1>
          <div className="sub">Bestenliste (Top 10)</div>
        </div>

        <div className="row">
          <input id="playerName" type="text" placeholder="Dein Name" maxLength={24} />
          <button id="saveNameBtn">OK</button>
        </div>
        <div id="highscoreHint" className="sub" />
        <div className="sub">
          <span style={{ color: 'rgb(218, 0, 0)' }}>Nur NETHZ-Kürzel zählen. </span>Ein höherer Score überschreibt den alten.
        </div>

        <ol id="scoreList" aria-live="polite" />
      </aside>
      <main>
        <canvas id="board" ref={canvasRef} />
        <div className="help">WASD / Pfeile steuern • vermeide den Rand :)</div>
      </main>
    </div>
  )
}
