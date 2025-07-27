import { useState, useEffect, useCallback } from 'react';

export interface ScoreHistoryEntry {
  propertyId: string;
  propertyName: string;
  score: number;
  timestamp: number; // Unix timestamp
  date: string; // Human readable date
}

export interface ScoreComparison {
  previousScore: number | null;
  currentScore: number;
  scoreChange: number | null;
  improvement: boolean | null;
  lastAuditDate: string | null;
  daysSinceLastAudit: number | null;
}

export const useScoreHistory = () => {
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryEntry[]>([]);

  // Load score history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ga4-score-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setScoreHistory(parsed);
      } catch (error) {
        console.error('Error parsing score history:', error);
        setScoreHistory([]);
      }
    }
  }, []);

  // Save score history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ga4-score-history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  const saveScore = useCallback((propertyId: string, propertyName: string, score: number) => {
    const newEntry: ScoreHistoryEntry = {
      propertyId,
      propertyName,
      score,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setScoreHistory(prev => {
      // Remove any existing entry for this property (keep only the latest)
      const filtered = prev.filter(entry => entry.propertyId !== propertyId);
      return [...filtered, newEntry];
    });

    console.log('✅ Score saved:', { propertyId, propertyName, score, date: newEntry.date });
  }, []);

  const getPreviousScore = useCallback((propertyId: string): ScoreHistoryEntry | null => {
    return scoreHistory.find(entry => entry.propertyId === propertyId) || null;
  }, [scoreHistory]);

  const getScoreComparison = useCallback((propertyId: string, currentScore: number): ScoreComparison => {
    const previousEntry = getPreviousScore(propertyId);
    
    if (!previousEntry) {
      return {
        previousScore: null,
        currentScore,
        scoreChange: null,
        improvement: null,
        lastAuditDate: null,
        daysSinceLastAudit: null
      };
    }

    const scoreChange = currentScore - previousEntry.score;
    const improvement = scoreChange > 0;
    const daysSinceLastAudit = Math.floor((Date.now() - previousEntry.timestamp) / (1000 * 60 * 60 * 24));

    return {
      previousScore: previousEntry.score,
      currentScore,
      scoreChange,
      improvement,
      lastAuditDate: previousEntry.date,
      daysSinceLastAudit
    };
  }, [getPreviousScore]);

  const clearHistory = useCallback(() => {
    setScoreHistory([]);
    localStorage.removeItem('ga4-score-history');
  }, []);

  const getHistoryForProperty = useCallback((propertyId: string): ScoreHistoryEntry[] => {
    return scoreHistory.filter(entry => entry.propertyId === propertyId);
  }, [scoreHistory]);

  return {
    scoreHistory,
    saveScore,
    getPreviousScore,
    getScoreComparison,
    clearHistory,
    getHistoryForProperty
  };
}; 