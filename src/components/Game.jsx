import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Number from './Number'
import './Game.css'

const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomSelect = (arr, size) => {
  if (size > arr.length) {
    throw new Error('size can\'t be larger than arr length')
  }
  const length = arr.length
  const selectIdx = []
  const result = []
  while (selectIdx.length < size) {
    const idx = randomNumberBetween(0, length - 1)
    if (!selectIdx.includes(idx)) {
      selectIdx.push(idx)
      result.push(arr[idx])
    }
  }
  return result
}

const colors = {
  new: 'lightblue',
  playing: 'deepskyblue',
  won: 'lightgreen',
  lost: 'lightcoral'
}

class Game extends Component {
  state = {
    gameStatus: 'new', // new, playing, won, lost
    remainingSeconds: this.props.initialSeconds,
    selectIds: []
  }

  numbers = Array
    .from({length: this.props.size})
    .map(() => randomNumberBetween(...this.props.range))

  target = randomSelect(this.numbers, this.props.answerSize).reduce((prev, cur) => prev + cur, 0)

  componentDidMount() {
    if (this.props.autoPlay) {
      this.startGame()
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  isNumberAvailable = numberIdx => {
    return !this.state.selectIds.includes(numberIdx)
  }

  startGame = () => {
    this.setState({gameStatus: 'playing'}, () => {
      this.timer = setInterval(() => {
        this.setState((prevState) => {
          const newRemainingSeconds = prevState.remainingSeconds - 1
          if (newRemainingSeconds === 0) {
            clearInterval(this.timer)
            return {gameStatus: 'lost', remainingSeconds: 0}
          }
          return {remainingSeconds: newRemainingSeconds}
        })
      }, 1000)
    })
  }

  selectNumber = numberIdx => {
    this.setState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return null
      }
      const newSelectIds = [...prevState.selectIds, numberIdx]
      return {
        selectIds: newSelectIds,
        gameStatus: this.caculateGameStatus(newSelectIds)
      }
    }, () => {
      console.log(this.state.gameStatus)
      if (this.state.gameStatus !== 'playing') {
        clearInterval(this.timer)
      }
    })
  }

  caculateGameStatus = newSelectIds => {
    const sum = newSelectIds.reduce((acc, cur) => {
      return acc + this.numbers[cur]
    }, 0)
    if (newSelectIds.length < this.props.answerSize) {
      return 'playing'
    } else {
      return sum === this.target ? 'won' : 'lost'
    }
  }

  resetGame = () => {
    this.numbers = Array
      .from({length: this.props.size})
      .map(() => randomNumberBetween(...this.props.range))
    this.target = randomSelect(this.numbers, this.props.answerSize).reduce((prev, cur) => prev + cur, 0)

    this.setState({
      gameStatus: 'new',
      remainingSeconds: this.props.initialSeconds,
      selectIds: []
    }, () => {
      this.startGame()
    })
  }

  render() {
    const { gameStatus, remainingSeconds } = this.state
    return (
      <div className="game">
        <h3 className="help">
          Pick {this.props.answerSize} numbers that sum to the target in {this.props.initialSeconds} seconds
        </h3>
        <div
          className="target"
          style={{backgroundColor: colors[gameStatus]}}
        >
          {gameStatus === 'new' ? 'TARGET' : this.target}
        </div>
        <div className="challenge-numbers">
          {this.numbers.map((val, idx) =>
            <Number
              key={idx}
              id={idx}
              value={gameStatus === 'new' ? '?' : val}
              clickable={this.isNumberAvailable(idx)}
              onClick={this.selectNumber}
            />
          )}
        </div>
        <div className="footer">
          {
            gameStatus === 'new' &&
            <button onClick={this.startGame}>Start</button>
          }
          {
            gameStatus === 'playing' &&
            <div className="timer-value">{remainingSeconds}</div>
          }
          {
            ['won', 'lost'].includes(gameStatus) &&
            <button onClick={this.resetGame}>Play Again</button>
          }
        </div>
      </div>
    )
  }
}

Game.propTypes = {
  size: PropTypes.number,
  answerSize: PropTypes.number,
  range: PropTypes.array,
  initialSeconds: PropTypes.number
}
Game.defaultProps = {
  size: 6,
  answerSize: 4,
  range: [1, 10],
  initialSeconds: 15
}

export default Game
