import { useEffect, useState } from "react"

const Hour = () => {
    const [time, setTime] = useState(new Date())
    const [clock, setClock] = useState(null)

    useEffect(() => {
        setClock( setInterval(() => {
            setTime(new Date())
        }, 1000)  )

        return clearInterval(clock)
    }, [])

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:'12px'}}>
            <span>{time.toLocaleTimeString()}</span>
            <span>{time.toLocaleDateString()}</span>
        </div>
    );
}

export default Hour;