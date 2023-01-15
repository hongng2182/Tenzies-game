import { useState, useEffect } from 'react'
import './css/App.css'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Title from './components/Title'
import Die from './components/Die'
import Badge from './components/badge'
import Stats from './components/Stats'

function App() {
  const NumOfDice = 10;
  const [dice, setDice] = useState(generateDiceArray())
  const [tenzies, setTenzies] = useState(false)
  const [numOfRolls, setNumOfRolls] = useState(0);
  const [time, setTime] = useState(0)
  const [startTimeCount, setStartTimeCount] = useState(false)
  const [bestWin, setBestWin] = useState(() => JSON.parse(localStorage.getItem('bestWin')) || {
    numOfRolls: 0,
    time: '0',
    timeInMilliSeconds: 0
  })

  // Observe dice array to define when to end the game: when all dice are freeze and has same values
  useEffect(() => {
    let tenzie = dice.every(die => die.freeze)
    let firstValue = dice[0].value
    let isSameValue = dice.every(die => die.value === firstValue)
    if (tenzie && isSameValue) {
      setTenzies(true)
      setStartTimeCount(false)
    }
  }, [dice])

  // Observe when the game start and end to count how long it takes for user to win game
  useEffect(() => {
    let interval = null;
    let stopTime = false; // this variable used to define when clearInterval is call to callculate the right time the game end.
    if (startTimeCount) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (stopTime) {
            return prevTime
          } else {
            return prevTime + 10
          }
        })

      }, 10)
    }
    return () => {
      clearInterval(interval)
      stopTime = true
    }
  }, [startTimeCount])

  // Generate random dice
  function createNewDice() {
    return {
      id: nanoid(),
      value: `${Math.floor(Math.random() * 6) + 1}`,
      freeze: false
    }
  }

  // Create random dice array before the game start
  function generateDiceArray() {
    let diceArray = []
    for (let i = 0; i < NumOfDice; i++) {
      diceArray.push(createNewDice())
    }
    return diceArray;
  }

  // Map to dice array to render each die 
  const die = dice.map(die =>
    <Die
      key={die.id}
      value={die.value}
      freeze={die.freeze}
      handleClick={() => freezeDie(die.id)}
    />)

  // Change freeze value of each die when being clicked
  function freezeDie(id) {
    setDice(oldDice => {
      return oldDice.map(
        die => {
          return die.id === id ?
            {
              ...die,
              freeze: !die.freeze
            } : die
        }
      )
    })
    // Set timer on when user click on 1st die to freeze it
    if (!startTimeCount) {
      setStartTimeCount(true)
    }
  }

  // Random generate value for dice which are not freeze
  function randomUnfreezeDie() {
    if (!tenzies) {
      setNumOfRolls(prevRoll => prevRoll + 1)
      setDice(oldDice => {
        return oldDice.map(
          die => {
            return die.freeze ? die : {
              ...die,
              value: `${Math.floor(Math.random() * 6) + 1}`
            }
          }
        )
      })
    }
    else {
      setTenzies(false)
      setNumOfRolls(0)
      setTime(0)
      setDice(generateDiceArray())
    }
  }

  // Set new bestWin to localStorage
  if (tenzies) {
    let centiSeconds = (time / 10) % 100
    let seconds = Math.floor((time / 1000) % 60)
    let minutes = Math.floor((time / 60000) % 60)
    let newWin = {
      numOfRolls: numOfRolls,
      time: `${minutes}: ${seconds}: ${centiSeconds}`,
      timeInMilliSeconds: time
    }
    if (time < bestWin.timeInMilliSeconds || bestWin.timeInMilliSeconds === 0) {
      setBestWin(newWin)
      localStorage.setItem("bestWin", JSON.stringify(newWin))
    }
    else if (time === bestWin.timeInMilliSeconds) {
      if (numOfRolls < bestWin.numOfRolls) {
        setBestWin(newWin)
        localStorage.setItem('bestWin', JSON.stringify(newWin))
      }
    }
  }

  //App return
  return <div className='container'>
    {tenzies && <Confetti
      width={window.innerWidth}
      height={window.innerHeight} />}
    <div className='square'>
      <Badge {...bestWin} />
      <Title />
      <div className='dices-grid'>
        {die}
      </div>
      <button onClick={randomUnfreezeDie}>{tenzies ? "Reset Game" : "Roll"}</button>
      <Stats numOfRolls={numOfRolls}
        time={time} />
    </div>
  </div>
}

export default App
