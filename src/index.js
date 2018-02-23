import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Game from './components/Game'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Game
    size={6}
    answerSize={4}
    range={[2, 10]}
    initialSeconds={10}
  />,
  document.getElementById('root')
)
registerServiceWorker()
