function Die(props) {
    let dotArray = []

    // create number of dots based on its value: i.e value 2 -> 2 dots
    for (let i = 1; i < parseInt(props.value) + 1; i++) {
        dotArray.push({ id: i })
    }
    
    const dots = dotArray.map(dot => {
        return <div key={dot.id} className={`dot-${dot.id}`}>
        </div>
    })

    // Set dots on each die based on its value, then choose appropriate css className
    return (
        <div className={`dice ${props.freeze ? 'selected' : ''}`}
            onClick={props.handleClick}   >
            <div className={`--box dot-container-${props.value}`}>
                {dots}
            </div>
        </div>
    )
}

export default Die;