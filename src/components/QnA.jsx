const QnA = ({ question, answers, questionId, handleAnswerClick, isAnswering }) => {

    return (
        <>
            <h3 className="question">{question}</h3>
            <div className="answers-container">
                {answers?.map((ans) => {
                    const buttonClasses = `choices ${ans.isChosen} ${!isAnswering ? `${ans.isChosen}-${ans.isCorrect}` : ''}`
                    return (
                        <button
                            className={buttonClasses}
                            key={ans.id}
                            onClick={() => handleAnswerClick(questionId, ans.id)}
                        >
                            {ans.answer}
                        </button>
                    );
                })}
            </div>
            <hr />
        </>
    );
};

export default QnA;
