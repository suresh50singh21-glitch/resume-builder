const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface SuggestionResult {
  original: string;
  suggested: string;
  success: boolean;
  error?: string;
}

export interface SkillSuggestion {
  skills: string[];
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
  if (!jobTitle.trim()) {
    return {
      original: '',
      suggested: '',
      success: false,
      error: 'Please enter a job title first',
    };
  }

  const prompt = `You are a professional career advisor. Suggest key skills for someone with the following job background. List 5-8 skills that would be most valuable, separated by commas. Only provide the skill list, nothing else.

Job Title: ${jobTitle}
${description ? `Description: ${description}` : ''}

Skills:`;

  const result = await callGeminiAPI(prompt, jobTitle);
  return {
    ...result,
    original: jobTitle,
  };
};

export const suggestSkillsFromJobTitle = async (jobTitle: string): Promise<SkillSuggestion> => {
  if (!jobTitle.trim()) {
    return {
      skills: [],
      success: false,
      error: 'Please enter a job title first',
    };
  }

  const prompt = `You are a professional career advisor. Suggest 8-12 key technical and soft skills for someone in this job role. Return ONLY a comma-separated list of skills, nothing else. No explanations, no numbering, just the skill names.

Job Title: ${jobTitle}

Skills:`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate suggestions');
    }

    const data = await response.json();
    const suggestedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!suggestedText) {
      throw new Error('No skills generated');
    }

    // Parse comma-separated skills and clean them
    const skills = suggestedText
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    return {
      skills,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      skills: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate suggestions. Please try again.',
    };
  }
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

export const generateCoverLetter = async (
  fullName: string,
  jobTitle: string,
  company: string,
  experience: Array<{ jobTitle: string; description: string }>
): Promise<{ coverLetter: string; success: boolean; error?: string }> => {
  if (!fullName.trim() || !jobTitle.trim() || !company.trim()) {
    return {
      coverLetter: '',
      success: false,
      error: 'Please provide full name, job title, and company name',
    };
  }

  const experienceText = experience
    .slice(0, 2)
    .map((exp) => `${exp.jobTitle}: ${exp.description}`)
    .join('\n');

  const prompt = `You are a professional cover letter writer. Write a compelling cover letter for the following details. Keep it concise (3-4 paragraphs, about 200-250 words). Only provide the cover letter content, no salutations beyond the opening.

Candidate Name: ${fullName}
Target Job Title: ${jobTitle}
Company: ${company}
Relevant Experience:
${experienceText}

Please write a professional and compelling cover letter:`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate cover letter');
    }

    const data = await response.json();
    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!coverLetter) {
      throw new Error('No cover letter generated');
    }

    return {
      coverLetter,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      coverLetter: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate cover letter. Please try again.',
    };
  }
};

