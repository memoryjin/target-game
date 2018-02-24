import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Number from './Number'
import './Game.css'
import { randomNumberBetween, randomSelect } from '../util'


const colors = {
  new: 'lightblue',
  playing: 'deepskyblue',
  over: 'lightgreen'
}

class Game extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gameStatus: 'new', // new, playing, over
      remainingSeconds: this.props.initialSeconds,
      selectIds: [],
      score: 0
    }
    this.refreshNumbersAndTarget()
  }

  componentDidMount() {
    if (this.props.autoPlay) {
      this.startGame()
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = null
  }

  isNumberAvailable = numberIdx => {
    return !this.state.selectIds.includes(numberIdx)
  }

  refreshNumbersAndTarget = () => {
    this.numbers = Array
      .from({length: this.props.size})
      .map(() => randomNumberBetween(...this.props.range))
    this.target = randomSelect(this.numbers, this.props.answerSize).reduce((prev, cur) => prev + cur, 0)
  }

  startGame = () => {
    this.setState({gameStatus: 'playing'}, () => {
      this.timer = setInterval(() => {
        this.setState((prevState) => {
          const newRemainingSeconds = prevState.remainingSeconds - 1
          if (newRemainingSeconds === 0) {
            clearInterval(this.timer)
            this.timer = null
            return {gameStatus: 'over', remainingSeconds: 0}
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
      const newSelectIds = prevState.selectIds.includes(numberIdx)
        ? prevState.selectIds.filter(idx => idx !== numberIdx)
        : [...prevState.selectIds, numberIdx]
      return {
        selectIds: newSelectIds
      }
    }, () => {
      const { selectIds } = this.state
      if (selectIds.length === this.props.answerSize) {
        const sum = selectIds.reduce((acc, cur) => {
          return acc + this.numbers[cur]
        }, 0)
        if (sum === this.target) {
          this.next()
        } else {
          this.setState({selectIds: []})
        }
      }
    })
  }

  next = () => {
    this.refreshNumbersAndTarget()
    this.setState(prevState => {
      return {
        selectIds: [],
        score: prevState.score + 10
      }
    })
  }

  resetGame = () => {
    this.refreshNumbersAndTarget()

    this.setState({
      gameStatus: 'new',
      remainingSeconds: this.props.initialSeconds,
      selectIds: [],
      score: 0
    }, () => {
      this.startGame()
    })
  }

  render() {
    const { gameStatus, remainingSeconds, score } = this.state
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
              active={this.isNumberAvailable(idx)}
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
            gameStatus === 'over' &&
            <button onClick={this.resetGame}>Play Again</button>
          }
          <div className="score">得分: {score}</div>
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
