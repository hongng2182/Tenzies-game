function Stats(props) {
    return (
        <div className='stats'>
        <p><b> Number of rolls: </b> {props.numOfRolls}</p>
        <div className='timer'>
          <span><b>Time:</b></span>
          <span className='Minutes'>{Math.floor((props.time / 60000) % 60)}</span>
          <span>:</span>
          <span className='Sec'>{Math.floor((props.time / 1000) % 60)}</span>
          <span>:</span>
          <span className='cenSec'>{(props.time / 10) % 100}</span>
        </div>
      </div>
    )
}

export default Stats;
