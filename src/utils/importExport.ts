import type { ResumeData } from '../types/resume';

export const parseCSVToResume = (csvText: string): Partial<ResumeData> => {
  const lines = csvText.split('\n').filter((line) => line.trim());
  const data: Partial<ResumeData> = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
  };

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('SECTION:')) {
      currentSection = trimmed.replace('SECTION:', '').trim().toLowerCase();
      continue;
    }

    if (currentSection === 'personal' && data.personalInfo) {
      const [key, value] = trimmed.split(':').map((s) => s.trim());
      if (key && value) {
        const keyLower = key.toLowerCase();
        if (keyLower === 'fullname') data.personalInfo.fullName = value;
        else if (keyLower === 'email') data.personalInfo.email = value;
        else if (keyLower === 'phone') data.personalInfo.phone = value;
        else if (keyLower === 'location') data.personalInfo.location = value;
        else if (keyLower === 'summary') data.personalInfo.summary = value;
      }
    } else if (currentSection === 'experience' && data.experience) {
      const [key, value] = trimmed.split(':').map((s) => s.trim());
      if (key && value) {
        const lastExp = data.experience[data.experience.length - 1];
        if (lastExp) {
          const keyLower = key.toLowerCase();
          if (keyLower === 'jobtitle') lastExp.jobTitle = value;
          else if (keyLower === 'company') lastExp.company = value;
          else if (keyLower === 'location') lastExp.location = value;
          else if (keyLower === 'startdate') lastExp.startDate = value;
          else if (keyLower === 'enddate') lastExp.endDate = value;
          else if (keyLower === 'description') lastExp.description = value;
        }
      }
    } else if (currentSection === 'skills' && data.skills) {
      const [skillName, proficiency] = trimmed.split(',').map((s) => s.trim());
      if (skillName) {
        const prof = (['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).includes(proficiency as any)
          ? (proficiency as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert')
          : 'Intermediate';
        data.skills.push({
          id: `skill-${Date.now()}-${Math.random()}`,
          name: skillName,
          proficiency: prof,
        });
      }
    }
  }

  return data;
};

export const parseJSONToResume = (jsonText: string): Partial<ResumeData> => {
  try {
    const data = JSON.parse(jsonText);
    return data as Partial<ResumeData>;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return {};
  }
};

export const exportResumeAsJSON = (data: ResumeData): string => {
  return JSON.stringify(data, null, 2);
};

export const exportResumeAsCSV = (data: ResumeData): string => {
  let csv = 'Resume Export\n\n';

  // Personal Info
  csv += 'SECTION:PERSONAL\n';
  csv += `Full Name:${data.personalInfo.fullName || ''}\n`;
  csv += `Email:${data.personalInfo.email || ''}\n`;
  csv += `Phone:${data.personalInfo.phone || ''}\n`;
  csv += `Location:${data.personalInfo.location || ''}\n`;
  csv += `Summary:${data.personalInfo.summary || ''}\n\n`;

  // Experience
  if (data.experience.length > 0) {
    csv += 'SECTION:EXPERIENCE\n';
    data.experience.forEach((exp) => {
      csv += `Job Title:${exp.jobTitle}\n`;
      csv += `Company:${exp.company}\n`;
      csv += `Location:${exp.location}\n`;
      csv += `Start Date:${exp.startDate}\n`;
      csv += `End Date:${exp.endDate}\n`;
      csv += `Description:${exp.description}\n\n`;
    });
  }

  // Education
  if (data.education.length > 0) {
    csv += 'SECTION:EDUCATION\n';
    data.education.forEach((edu) => {
      csv += `School:${edu.school}\n`;
      csv += `Degree:${edu.degree}\n`;
      csv += `Field of Study:${edu.fieldOfStudy}\n`;
      csv += `Start Date:${edu.startDate}\n`;
      csv += `End Date:${edu.endDate}\n\n`;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    csv += 'SECTION:SKILLS\n';
    data.skills.forEach((skill) => {
      csv += `${skill.name},${skill.proficiency}\n`;
    });
    csv += '\n';
  }

  return csv;
};
