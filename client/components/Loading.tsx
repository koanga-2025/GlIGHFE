import { useEffect, useState } from 'react'

function Loading() {
  const loadingMessage = 'GlIGHFE'
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Set up the interval when the component mounts
    const intervalId: number = window.setInterval(() => {
      setCount((prevCount) => prevCount + 1)
    }, 500) // Update every 1000 milliseconds (1 second)

    // Clean up the interval when the component unmounts
    return () => {
      window.clearInterval(intervalId)
    }
  }, []) // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (count > loadingMessage.length) {
      setCount(0)
    }
  }, [count])

  return <p>{loadingMessage.slice(0, count)}</p>
}
export default Loading
