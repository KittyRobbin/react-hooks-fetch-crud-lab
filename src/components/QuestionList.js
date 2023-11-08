import React, { useState, useEffect } from 'react';

function QuestionList({ questions }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [isViewingQuestions, setIsViewingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Use the useEffect hook to fetch and set all questions when the button is clicked
  useEffect(() => {
    if (isViewingQuestions) {
      fetch('http://localhost:4000/questions') // Replace with your API endpoint
        .then((response) => response.json())
        .then((data) => {
          setAllQuestions(data);
        })
        .catch((error) => {
          console.error('Error fetching questions:', error);
        });
    }
  }, [isViewingQuestions]);

  const handleUpdateCorrectAnswer = (newCorrectIndex) => {
    if (selectedQuestion) {
      // Send a PATCH request to the server with the question ID
      fetch(`http://localhost:4000/questions/${selectedQuestion.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correctIndex: newCorrectIndex }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Update the question's correctIndex in the local state
          const updatedQuestions = allQuestions.map((question) =>
            question.id === selectedQuestion.id
              ? { ...question, correctIndex: newCorrectIndex }
              : question
          );
          setAllQuestions(updatedQuestions);
        })
        .catch((error) => {
          console.error('Error updating correct answer:', error);
        });
    }
  };

  return (
    <div>
      <button onClick={() => setIsViewingQuestions(true)}>View Questions</button>
      <ul>
        {isViewingQuestions
          ? allQuestions.map((question) => (
              <li key={question.id}>
                {question.prompt}
                <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );

  const handleDeleteQuestion = (questionId) => {

    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Remove the question from the local state by filtering it out
        setAllQuestions(allQuestions.filter((question) => question.id !== questionId));
      })
      .catch((error) => {
        console.error('Error deleting question:', error);
      });
  }; 
  
}

export default QuestionList;

