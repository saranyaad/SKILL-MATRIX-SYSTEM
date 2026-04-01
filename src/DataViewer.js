import React, { useState, useEffect } from 'react';
import './DataViewer.css';

const DataViewer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

 useEffect(() => {
  fetchResults();
}, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/results', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
        setLastRefresh(new Date().toLocaleTimeString());
      } else {
        setError(data.message || 'No quiz results found');
        setResults([]);
      }
    } catch (err) {
      setError('Error fetching results: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="data-viewer">
        <div className="loading">Loading quiz results...</div>
      </div>
    );
  }

  return (
    <div className="data-viewer">
      <div className="viewer-header">
        <h2>📊 Quiz Results Dashboard</h2>
        <p>Total Results: <strong>{results.length}</strong></p>
        <div className="header-actions">
          <button onClick={fetchResults} className="refresh-btn" disabled={loading}>
            🔄 {loading ? 'Loading...' : 'Refresh'}
          </button>
          {lastRefresh && <span className="last-refresh">Last updated: {lastRefresh}</span>}
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {results.length === 0 ? (
        <div className="no-data">
          <p>No quiz results yet. Take a quiz to see results here!</p>
        </div>
      ) : (
        <div className="results-container">
          {results.map((result, index) => (
            <div key={index} className="result-card">
              <div className="result-header">
                <h3>{result.courseName}</h3>
                <span className={`status ${result.status}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              <div className="result-stats">
                <div className="stat">
                  <span className="label">Score:</span>
                  <span className="value">{result.percentage}%</span>
                </div>
                <div className="stat">
                  <span className="label">Correct:</span>
                  <span className="value">{result.score}/{result.totalQuestions}</span>
                </div>
                <div className="stat">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <details className="answer-details">
                <summary>View Answers ({result.answers?.length || 0} questions)</summary>
                <div className="answers-list">
                  {result.answers?.map((answer, ansIndex) => (
                    <div key={ansIndex} className={`answer ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className="question">
                        <strong>Q{ansIndex + 1}:</strong> {answer.question}
                      </div>
                      <div className="answer-info">
                        <div>
                          <span className="label">Your Answer:</span>
                          <span className={answer.isCorrect ? 'text-success' : 'text-error'}>
                            {answer.selectedAnswer}
                          </span>
                        </div>
                        {!answer.isCorrect && (
                          <div>
                            <span className="label">Correct Answer:</span>
                            <span className="text-success">{answer.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataViewer;
