const Title = ({startQuiz}) => {
  return (
    <div className="title-container">
        <h1 className="title">Quizzical</h1>
        <p className="description">I'll think of a description later</p>
        <button onClick={startQuiz} className="start-quiz-btn">Start Quiz</button>
    </div>
  )
}

export default Title