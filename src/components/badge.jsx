function Badge(props) {
    return (
        <div className='badge'><b>Your best try</b><br />
        <span>Time: {props.time}</span><br />
        <span>Rolls: {props.numOfRolls} </span>
      </div>
    )
}

export default Badge;
