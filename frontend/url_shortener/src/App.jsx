import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=' flex justify-center items-center min-h-screen '>
        <div className=' w-full max-w-2xl bg-red-400'>
          url shortener
        </div>
      </div>
      
    </>
  )
}

export default App
