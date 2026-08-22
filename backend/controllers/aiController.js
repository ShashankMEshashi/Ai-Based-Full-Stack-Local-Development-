const aiEngine = require('../services/aiEngine');
const Analysis = require('../models/Analysis');

const analyzeSentiment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Please enter text (at least 3 characters) to analyze.' });
    }

    const result = aiEngine.analyzeSentiment(text);

    // Save to Database
    const savedRecord = Analysis.create({
      userId,
      type: 'sentiment',
      inputText: text,
      resultJson: result,
      sentimentLabel: result.sentiment,
      sentimentScore: result.score
    });

    return res.status(201).json({
      success: true,
      message: 'Sentiment analysis completed successfully.',
      analysisId: savedRecord.id,
      result
    });
  } catch (error) {
    next(error);
  }
};

const summarizeText = async (req, res, next) => {
  try {
    const { text, sentences } = req.body;
    const userId = req.user.id;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please enter a longer text paragraph (at least 20 characters) to summarize.' });
    }

    const result = aiEngine.summarizeText(text, sentences || 3);
    const sentiment = aiEngine.analyzeSentiment(text);

    // Save to Database
    const savedRecord = Analysis.create({
      userId,
      type: 'summarizer',
      inputText: text,
      resultJson: result,
      sentimentLabel: sentiment.sentiment,
      sentimentScore: sentiment.score,
      summaryText: result.summary
    });

    return res.status(201).json({
      success: true,
      message: 'Text summarization completed successfully.',
      analysisId: savedRecord.id,
      result
    });
  } catch (error) {
    next(error);
  }
};

const matchSkills = async (req, res, next) => {
  try {
    const { candidateSkills, jobDescription } = req.body;
    const userId = req.user.id;

    if (!candidateSkills || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Please provide both your skills and target job description/role.' });
    }

    const result = aiEngine.matchSkills(candidateSkills, jobDescription);

    const inputText = `Skills: ${candidateSkills}\nRole: ${jobDescription}`;

    // Save to Database
    const savedRecord = Analysis.create({
      userId,
      type: 'skill_match',
      inputText,
      resultJson: result,
      matchScore: result.matchPercentage
    });

    return res.status(201).json({
      success: true,
      message: 'Skill matching recommendation generated successfully.',
      analysisId: savedRecord.id,
      result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeSentiment,
  summarizeText,
  matchSkills
};
