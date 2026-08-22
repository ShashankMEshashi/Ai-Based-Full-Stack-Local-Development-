/**
 * MindPulse AI - Local Natural Language Processing & Recommendation Engine
 * Runs 100% locally with zero external API dependencies.
 */

// Lexicon Dictionaries for Sentiment & Emotion Scoring
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'outstanding',
  'superb', 'awesome', 'brilliant', 'love', 'liked', 'intuitive', 'fast', 'accurate',
  'impressive', 'efficient', 'seamless', 'happy', 'pleased', 'perfect', 'strong',
  'best', 'success', 'successful', 'enjoy', 'top', 'clean', 'modern', 'powerful',
  'valuable', 'recommend', 'insightful', 'innovative', 'smooth', 'revolutionary'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'poor', 'terrible', 'horrible', 'awful', 'slow', 'broken', 'buggy', 'error',
  'fail', 'failed', 'failure', 'disappointing', 'useless', 'difficult', 'confusing',
  'hate', 'hated', 'frustrating', 'problem', 'worst', 'clunky', 'ugly', 'defective',
  'weak', 'waste', 'annoying', 'flawed', 'unreliable', 'crash', 'issue', 'unhappy'
]);

const EMOTION_LEXICON = {
  joy: ['happy', 'love', 'great', 'wonderful', 'delight', 'excited', 'enjoy', 'pleased', 'fantastic', 'awesome', 'joy'],
  sadness: ['sad', 'disappointed', 'grief', 'unhappy', 'sorry', 'heartbroken', 'regret', 'loss', 'down', 'gloomy'],
  anger: ['angry', 'frustrated', 'annoying', 'furious', 'hate', 'terrible', 'horrible', 'rage', 'outrage', 'disgust'],
  fear: ['scared', 'afraid', 'risk', 'uncertain', 'warning', 'danger', 'alarm', 'worry', 'anxious', 'dread'],
  trust: ['reliable', 'accurate', 'proven', 'strong', 'secure', 'honest', 'valuable', 'trust', 'certified', 'solid'],
  anticipation: ['future', 'upcoming', 'next', 'promising', 'innovative', 'potential', 'looking', 'expected', 'hope']
};

/**
 * 1. Sentiment & Emotion Analysis Pipeline
 */
function analyzeSentiment(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Input text is required for sentiment analysis.');
  }

  const cleanText = text.toLowerCase();
  const words = cleanText.match(/\b[a-z]{2,}\b/g) || [];
  const wordCount = words.length;

  let posScore = 0;
  let negScore = 0;
  const emotionCounts = { joy: 0, sadness: 0, anger: 0, fear: 0, trust: 0, anticipation: 0 };

  words.forEach(word => {
    if (POSITIVE_WORDS.has(word)) posScore++;
    if (NEGATIVE_WORDS.has(word)) negScore++;

    for (const [emotion, wordList] of Object.entries(EMOTION_LEXICON)) {
      if (wordList.includes(word)) {
        emotionCounts[emotion]++;
      }
    }
  });

  const totalHits = posScore + negScore;
  let normalizedScore = 0.5; // neutral baseline

  if (totalHits > 0) {
    normalizedScore = posScore / totalHits;
  } else {
    normalizedScore = 0.5;
  }

  let label = 'Neutral';
  if (normalizedScore > 0.6) label = 'Positive';
  else if (normalizedScore < 0.4) label = 'Negative';

  // Compute emotion probabilities
  const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0) || 1;
  const emotions = {};
  for (const [emo, count] of Object.entries(emotionCounts)) {
    emotions[emo] = Number((count / totalEmotions).toFixed(2));
  }

  // Extract Top Keywords (TF frequency)
  const freqMap = {};
  const stopWords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'for', 'it', 'with', 'this', 'that', 'on', 'are', 'was', 'as', 'an', 'be', 'by', 'at', 'or', 'from']);
  words.forEach(w => {
    if (!stopWords.has(w) && w.length > 3) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  const keywords = Object.keys(freqMap)
    .sort((a, b) => freqMap[b] - freqMap[a])
    .slice(0, 7);

  const readingTimeSeconds = Math.ceil(wordCount / 3); // approx 180 wpm

  return {
    sentiment: label,
    score: Number(normalizedScore.toFixed(2)),
    confidence: wordCount > 20 ? 'High' : wordCount > 5 ? 'Medium' : 'Low',
    positivityPct: Math.round(normalizedScore * 100),
    emotions,
    keywords,
    wordCount,
    readingTime: readingTimeSeconds < 60 ? `${readingTimeSeconds} sec` : `${Math.ceil(readingTimeSeconds / 60)} min`
  };
}

/**
 * 2. Extractive AI Summarizer & Key Point Extractor Pipeline
 */
function summarizeText(text, maxSentences = 3) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text input is required for summarization.');
  }

  const rawSentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  
  if (rawSentences.length <= maxSentences) {
    return {
      summary: text.trim(),
      keyPoints: rawSentences.slice(0, 3).map(s => s.trim()),
      originalLength: text.length,
      summaryLength: text.length,
      compressionRatio: '0%',
      readability: 'Standard'
    };
  }

  // Score sentences based on length, position, and keyword richness
  const wordFreq = {};
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  words.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);

  const scoredSentences = rawSentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;
    sWords.forEach(w => {
      score += (wordFreq[w] || 0);
    });
    // Give boost to first sentence & clear medium sentences
    if (index === 0) score *= 1.4;
    score = score / (sWords.length || 1);

    return { sentence, score, index };
  });

  // Pick top scoring sentences and sort by original narrative flow
  const topSentences = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index);

  const summary = topSentences.map(s => s.sentence).join(' ');
  const keyPoints = topSentences.map(s => s.sentence.replace(/^[^a-zA-Z0-9]+/, '').trim());

  const compression = Math.round((1 - summary.length / text.length) * 100);

  return {
    summary,
    keyPoints,
    originalLength: text.length,
    summaryLength: summary.length,
    compressionRatio: `${compression}%`,
    readability: words.length / rawSentences.length > 20 ? 'Advanced' : 'High'
  };
}

/**
 * 3. AI Skill Matcher & Career Recommendation Pipeline
 */
function matchSkills(candidateSkillsInput, jobDescriptionInput) {
  if (!candidateSkillsInput || !jobDescriptionInput) {
    throw new Error('Both candidate skills and job description/role are required.');
  }

  // Known Tech Skill Taxonomy
  const KNOWN_SKILLS = [
    'react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind',
    'node.js', 'express', 'python', 'django', 'fastapi', 'java', 'spring', 'c#', '.net', 'golang',
    'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'graphql', 'rest api',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git', 'linux',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'scikit-learn', 'data analysis', 'sql'
  ];

  const parseSkills = (inputStr) => {
    const text = inputStr.toLowerCase();
    const found = [];
    KNOWN_SKILLS.forEach(skill => {
      if (text.includes(skill)) {
        found.push(skill);
      }
    });
    // Also include custom comma separated values
    const customList = inputStr.split(/[,;\n]/).map(s => s.trim().toLowerCase()).filter(s => s.length > 1);
    const combined = Array.from(new Set([...found, ...customList]));
    return combined;
  };

  const userSkills = parseSkills(candidateSkillsInput);
  const requiredSkills = parseSkills(jobDescriptionInput);

  if (requiredSkills.length === 0) {
    requiredSkills.push('javascript', 'react', 'node.js', 'sql', 'git');
  }

  const matchingSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkill => {
    const isMatched = userSkills.some(userSkill => 
      userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
    );
    if (isMatched) {
      matchingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercentage = Math.min(100, Math.round((matchingSkills.length / Math.max(1, requiredSkills.length)) * 100));

  const formatSkillName = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const recommendations = [];
  if (missingSkills.length === 0) {
    recommendations.push("🎉 Outstanding match! You possess all primary required skills for this role.");
    recommendations.push("Focus on tailoring your portfolio projects and highlighting real-world deployment experience.");
  } else {
    recommendations.push(`Up-skill priority: Master ${missingSkills.slice(0, 2).map(formatSkillName).join(' and ')} to elevate your qualification score.`);
    recommendations.push(`Build a practical open-source showcase project featuring ${missingSkills[0] ? formatSkillName(missingSkills[0]) : 'modern tools'}.`);
  }

  return {
    targetRole: jobDescriptionInput.split('\n')[0].slice(0, 60),
    matchPercentage,
    matchingSkills: matchingSkills.map(formatSkillName),
    missingSkills: missingSkills.map(formatSkillName),
    totalRequired: requiredSkills.length,
    recommendations
  };
}

module.exports = {
  analyzeSentiment,
  summarizeText,
  matchSkills
};
