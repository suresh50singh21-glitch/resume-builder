const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface SuggestionResult {
  original: string;
  suggested: string;
  success: boolean;
  error?: string;
}

export const improveJobDescription = async (jobTitle: string, description: string): Promise<SuggestionResult> => {
  if (!description.trim()) {
    return {
      original: description,
      suggested: '',
      success: false,
      error: 'Please enter a job description first',
    };
  }

  const prompt = `You are a professional resume writer. Improve this job description for a resume. Make it more impactful, professional, and quantifiable. Keep it concise (2-3 sentences). Only provide the improved description, nothing else.

Job Title: ${jobTitle}
Current Description: ${description}

Improved Description:`;

  return callGeminiAPI(prompt, description);
};

export const improveSummary = async (summary: string): Promise<SuggestionResult> => {
  if (!summary.trim()) {
    return {
      original: summary,
      suggested: '',
      success: false,
      error: 'Please enter a summary first',
    };
  }

  const prompt = `You are a professional resume writer. Improve this professional summary to make it more compelling and impactful. Keep it concise (2-3 sentences). Only provide the improved summary, nothing else.

Current Summary: ${summary}

Improved Summary:`;

  return callGeminiAPI(prompt, summary);
};

export const suggestSkills = async (jobTitle: string, description: string): Promise<SuggestionResult> => {
  if (!jobTitle.trim() && !description.trim()) {
    return {
      original: '',
      suggested: '',
      success: false,
      error: 'Please enter a job title or description',
    };
  }

  const prompt = `You are a career coach. Based on this job information, suggest 5-7 relevant technical and soft skills that would be valuable. Format as a comma-separated list.

Job Title: ${jobTitle}
Description: ${description}

Suggested Skills (comma-separated):`;

  return callGeminiAPI(prompt, '');
};

export const improveEducationDescription = async (degree: string, fieldOfStudy: string, description: string): Promise<SuggestionResult> => {
  if (!description.trim()) {
    return {
      original: description,
      suggested: '',
      success: false,
      error: 'Please enter an education description first',
    };
  }

  const prompt = `You are a professional resume writer. Improve this education description to highlight achievements and relevance. Keep it concise (1-2 sentences). Only provide the improved description, nothing else.

Degree: ${degree}
Field of Study: ${fieldOfStudy}
Current Description: ${description}

Improved Description:`;

  return callGeminiAPI(prompt, description);
};

export const improveProjectDescription = async (title: string, description: string): Promise<SuggestionResult> => {
  if (!description.trim()) {
    return {
      original: description,
      suggested: '',
      success: false,
      error: 'Please enter a project description first',
    };
  }

  const prompt = `You are a professional resume writer. Improve this project description to make it more impressive and relevant for a resume. Include impact and results if possible. Keep it concise (1-2 sentences). Only provide the improved description, nothing else.

Project Title: ${title}
Current Description: ${description}

Improved Description:`;

  return callGeminiAPI(prompt, description);
};

const callGeminiAPI = async (prompt: string, original: string): Promise<SuggestionResult> => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate suggestion');
    }

    const data = await response.json();
    const suggested = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!suggested) {
      throw new Error('No suggestion generated');
    }

    return {
      original,
      suggested,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      original,
      suggested: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate suggestion. Please try again.',
    };
  }
};
