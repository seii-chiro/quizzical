import { useEffect, useState } from "react";
import QnA from "./QnA";
import { nanoid } from "nanoid";
import { decode } from "html-entities";

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null); // State to keep track of the score

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple");
                const data = await res.json();

                const decodedResults = data.results?.map(result => {
                    const correctAnswerWithId = { answer: decode(result.correct_answer), id: nanoid(), isCorrect: true, isChosen: false };
                    const incorrectAnswerWithId = result.incorrect_answers.map(answer => ({ answer: decode(answer), id: nanoid(), isCorrect: false, isChosen: false }));
                    const combinedAnswers = [...incorrectAnswerWithId, correctAnswerWithId];
                    const shuffledAnswers = combinedAnswers.sort(() => Math.random() - 0.5);

                    return {
                        ...result,
                        question: decode(result.question),
                        correct_answer: correctAnswerWithId,
                        incorrect_answers: incorrectAnswerWithId,
                        answers: shuffledAnswers,
                        id: nanoid()
                    };
                });
                setQuizData(decodedResults);
            } catch (err) {
                console.error('Oops, something went wrong', err);
            }
        };

        fetchData();
    }, []);

    const handleAnswerClick = (questionId, answerId) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: prev[questionId] === answerId ? null : answerId
        }));

        setQuizData(prevQuizData => {
            return prevQuizData.map(quiz => {
                if (questionId === quiz.id) {
                    return {
                        ...quiz,
                        answers: quiz.answers.map(ans => ({
                            ...ans,
                            isChosen: ans.id === answerId ? !ans.isChosen : false
                        }))
                    };
                }
                return quiz;
            });
        });
    };

    const checkAnswers = () => {
        let score = 0;
        quizData.forEach(quiz => {
            if (selectedAnswers[quiz.id]) {
                const selectedAnswer = quiz.answers.find(ans => ans.id === selectedAnswers[quiz.id]);
                if (selectedAnswer && selectedAnswer.isCorrect) {
                    score += 1;
                }
            }
        });
        setScore(score);
    };

    const quizElements = quizData?.map(ques => (
        <QnA
            question={ques.question}
            answers={ques.answers}
            key={ques.id}
            questionId={ques.id}
            handleAnswerClick={handleAnswerClick}
            selectedAnswersId={selectedAnswers[ques.id]}
        />
    ));

    return (
        <>
            {quizData?.length > 0 ? quizElements : <h3>Loading...</h3>}
            <div className="btn-container">
                <button className="check-answer-btn" onClick={checkAnswers}>Check Answers</button>
            </div>
            {score !== null && <div>Your score is: {score} / {quizData.length}</div>}
        </>
    );
};

export default Quiz;

const QnA = ({ question, answers, questionId, handleAnswerClick }) => {
    return (
        <>
            <h3 className="question">{question}</h3>
            <div className="answers-container">
                {answers?.map((ans) => (
                    <button
                        className="choices"
                        key={ans.id}
                        onClick={() => handleAnswerClick(questionId, ans.id)}
                        style={{
                            backgroundColor: ans.isChosen ? "lightgray" : "white",
                            borderColor: ans.isCorrect ? "lime" : "black"
                        }}
                    >
                        {ans.answer}
                    </button>
                ))}
            </div>
            <hr />
        </>
    );
};

export default QnA;
