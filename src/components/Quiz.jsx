import { useEffect, useState } from "react"
import QnA from "./QnA"
import { nanoid } from "nanoid"
import { decode } from "html-entities"

const Quiz = () => {
    const [quizdata, setQuizData] = useState([])
    const [score, setScore] = useState(null);
    const [isAnswering, setIsAnswering] = useState(true)
    const [idkWhatToCallThis, setIdkWhatToCallThis] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple");
                const data = await res.json();

                const decodedResults = data.results?.map(result => {
                    const correctAnswerWithId = {
                        answer: decode(result.correct_answer),
                        id: nanoid(),
                        isCorrect: true,
                        isChosen: false
                    }
                    const incorrectAnswerWithId = result.incorrect_answers.map(answer => ({
                        answer: decode(answer),
                        id: nanoid(),
                        isCorrect: false,
                        isChosen: false
                    }))
                    const combinedAnswers = [...incorrectAnswerWithId.map(ans => ans), correctAnswerWithId]
                    const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5)

                    return {
                        ...result,
                        question: decode(result.question),
                        correct_answer: correctAnswerWithId,
                        incorrect_answers: incorrectAnswerWithId,
                        answers: shuffledAnswers,
                        id: nanoid()
                    }
                }

                );
                setQuizData(decodedResults);
            } catch (err) {
                console.error('Oops, something went wrong', err);
            }
        };

        fetchData();
    }, [idkWhatToCallThis]);

    const handleAnswerClick = (questionId, answerId) => {

        setQuizData(prevQuizData => {
            return prevQuizData.map(quiz => {
                if (questionId === quiz.id) {
                    return {
                        ...quiz,
                        answers: quiz.answers.map(ans => ({
                            ...ans,
                            isChosen: ans.id === answerId ? !ans.isChosen : false
                        }))
                    }
                }
                return quiz
            })
        })
    }

    const quizElements = quizdata?.map(ques => {
        return (
            <QnA
                question={ques.question}
                answers={ques.answers}
                key={ques.id}
                questionId={ques.id}
                handleAnswerClick={handleAnswerClick}
                isAnswering={isAnswering}
            />
        )
    })

    const checkAnswers = () => {
        let score = 0;

        if (isAnswering) {
            quizdata.forEach(quiz => {
                const chosenAnswer = quiz.answers.find(ans => ans.isChosen);
                if (chosenAnswer && chosenAnswer.isCorrect) {
                    score += 1;
                }
            });

            setScore(score);
            setIsAnswering(false);
        } else {
            setQuizData(prevQuizData => {
                return prevQuizData.map(data => ({
                    ...data,
                    answers: data.answers.map(ans => ({
                        ...ans,
                        isChosen: false
                    }))
                }))
            })
            setScore(null)
            setIsAnswering(true)
            setIdkWhatToCallThis(prev => !prev)
        }

    };

    return (
        <>
            <div className="quiz-component">
                {quizdata?.length > 0 ?
                    <>
                        {quizElements}
                        <div className="btn-container">
                            {score !== null && <div className="score-display">Your score is: <span>{score}/{quizdata.length} </span> </div>}
                            <button className="check-answer-btn" onClick={checkAnswers}>{score !== null ? "Play Again" : "Check Answers"}</button>
                        </div>
                    </>
                    : <h3>Loading...</h3>
                }

            </div>

        </>
    )
}

export default Quiz