import { useState } from 'react'
import './App.css'
import Title from './components/Title'
import Quiz from './components/Quiz'

function App() {

  const [quizzing, setQuizzing] = useState(false)

  function startQuiz() {
    setQuizzing(true)
  }

  return (
    <>
      <main>
        {
          quizzing ? <Quiz /> : <Title startQuiz={startQuiz} />
        }

      </main>
    </>
  )
}

export default App
