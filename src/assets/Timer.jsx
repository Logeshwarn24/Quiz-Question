import React, { useEffect } from 'react'

const Timer = ({time, setTime, quizFinished}) => {
    useEffect(()=>{
        let timer;
        timer=setInterval(()=>{
            setTime(curr => curr - 1);
        }, 1000)
        return () => clearInterval(timer);
    }, [])
  return (
    <div>
      <h2>CountDown: {quizFinished ? setTime(0) : time}</h2> 
    </div>
  )
}

export default Timer
