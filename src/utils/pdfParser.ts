import type { ResumeData } from '../types/resume';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Uses Gemini AI to parse unstructured resume text and extract structured data
 */
export async function parseResumeFromText(text: string): Promise<Partial<ResumeData>> {
  if (!text.trim()) {
    throw new Error('Empty text provided');
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Parse this resume text and extract structured data. Return a valid JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string"
  },
  "experience": [
    {
      "id": "string",
      "jobTitle": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or empty string if current",
      "currentlyWorking": boolean,
      "description": "string"
    }
  ],
  "education": [
    {
      "id": "string",
      "school": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "grade": "string"
    }
  ],
  "skills": [
    {
      "id": "string",
      "name": "string",
      "proficiency": "Beginner|Intermediate|Advanced|Expert"
    }
  ],
  "projects": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "technologies": "comma separated string",
      "date": "YYYY-MM-DD"
    }
  ],
  "languages": [
    {
      "id": "string",
      "name": "string",
      "proficiency": "Beginner|Intermediate|Advanced|Fluent|Native"
    }
  ]
}

Resume text to parse:
${text}

Instructions:
- Only include fields that are clearly mentioned in the resume
- For missing dates, use empty string
- For currentlyWorking, set to true if end date is missing or "present"
- Keep descriptions concise but informative
- Return ONLY valid JSON, no other text`
          }]
        }],
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.contents?.[0]?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and clean up the parsed data
    const result: Partial<ResumeData> = {};

    if (parsed.personalInfo) {
      result.personalInfo = {
        fullName: parsed.personalInfo.fullName || '',
        email: parsed.personalInfo.email || '',
        phone: parsed.personalInfo.phone || '',
        location: parsed.personalInfo.location || '',
        summary: parsed.personalInfo.summary || '',
      };
    }

    if (Array.isArray(parsed.experience)) {
      result.experience = parsed.experience.map((exp: any) => ({
        id: exp.id || generateId(),
        jobTitle: exp.jobTitle || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        currentlyWorking: exp.currentlyWorking || false,
        description: exp.description || '',
      }));
    }

    if (Array.isArray(parsed.education)) {
      result.education = parsed.education.map((edu: any) => ({
        id: edu.id || generateId(),
        school: edu.school || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        grade: edu.grade || '',
        description: edu.description || '',
      }));
    }

    if (Array.isArray(parsed.skills)) {
      result.skills = parsed.skills.map((skill: any) => ({
        id: skill.id || generateId(),
        name: skill.name || '',
        proficiency: skill.proficiency || 'Intermediate',
      }));
    }

    if (Array.isArray(parsed.projects)) {
      result.projects = parsed.projects.map((proj: any) => ({
        id: proj.id || generateId(),
        title: proj.title || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        date: proj.date || '',
      }));
    }

    if (Array.isArray(parsed.languages)) {
      result.languages = parsed.languages.map((lang: any) => ({
        id: lang.id || generateId(),
        name: lang.name || '',
        proficiency: lang.proficiency || 'Intermediate',
      }));
    }

    return result;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
