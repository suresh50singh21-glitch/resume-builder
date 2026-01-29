import React from 'react';
import type { ResumeData } from '../types/resume';
import { Card, Button, Space } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { exportToPDF } from '../utils/helpers';
import '../styles/resume-preview.css';

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  darkMode?: boolean;
  fontSize?: number;
  visibleSections?: Record<string, boolean>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, darkMode = false, fontSize = 14, visibleSections = {} }) => {
  const getSkillWidth = (proficiency: string) => {
    const levels: Record<string, number> = {
      'Beginner': 25,
      'Intermediate': 50,
      'Advanced': 75,
      'Expert': 100,
    };
    return levels[proficiency] || 0;
  };

  const renderModernTemplate = () => (
    <div className="resume-modern">
      <div className="header">
        <h1>{data.personalInfo.fullName}</h1>
        <div className="contact-info">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div className="resume-section">
          <h3>Professional Summary</h3>
          <p>{data.personalInfo.summary}</p>
        </div>
      )}

      {visibleSections.experience !== false && data.experience.length > 0 && (
        <div className="resume-section">
          <h3>Work Experience</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="item-header">
                <strong>{exp.jobTitle}</strong>
                <span className="date">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              <div className="company-info">
                {exp.company} | {exp.location}
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {visibleSections.education !== false && data.education.length > 0 && (
        <div className="resume-section">
          <h3>Education</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="resume-item">
              <div className="item-header">
                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                <span className="date">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="company-info">{edu.school}</div>
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {visibleSections.skills !== false && data.skills.length > 0 && (
        <div className="resume-section">
          <h3>Skills</h3>
          <div className="skills-grid">
            {data.skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <span className="skill-name">{skill.name}</span>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: `${getSkillWidth(skill.proficiency)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleSections.projects !== false && data.projects.length > 0 && (
        <div className="resume-section">
          <h3>Projects</h3>
          {data.projects.map((project) => (
            <div key={project.id} className="resume-item">
              <div className="item-header">
                <strong>{project.title}</strong>
                <span className="date">{project.technologies || ''}</span>
              </div>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {visibleSections.languages !== false && data.languages.length > 0 && (
        <div className="resume-section">
          <h3>Languages</h3>
          <div className="languages-grid">
            {data.languages.map((lang) => (
              <div key={lang.id} className="language-item">
                {lang.name} - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="resume-classic">
      <div className="header-classic">
        <h1>{data.personalInfo.fullName}</h1>
        <div className="contact-info">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div className="resume-section">
          <h3>PROFESSIONAL SUMMARY</h3>
          <p>{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="resume-section">
          <h3>EXPERIENCE</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="item-header">
                <strong>{exp.jobTitle}</strong>
                <span className="date">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              <div className="company-info">{exp.company} | {exp.location}</div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="resume-section">
          <h3>EDUCATION</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="resume-item">
              <div className="item-header">
                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                <span className="date">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="company-info">{edu.school}</div>
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="resume-section">
          <h3>SKILLS</h3>
          <div className="skills-list">
            {data.skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="resume-section">
          <h3>PROJECTS</h3>
          {data.projects.map((project) => (
            <div key={project.id} className="resume-item">
              <div className="item-header">
                <strong>{project.title}</strong>
                <span className="date">{project.technologies || ''}</span>
              </div>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div className="resume-section">
          <h3>LANGUAGES</h3>
          <div className="languages-list">
            {data.languages.map((lang) => (
              <div key={lang.id} className="language-item">
                {lang.name} - {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSidebarTemplate = () => (
    <div className={`resume-sidebar resume-${template}`}>
      <div className="sidebar">
        {data.personalInfo.photo && (
          <div className="sidebar-photo">
            <img src={data.personalInfo.photo} alt="Profile" />
          </div>
        )}

        {data.personalInfo.email && (
          <div className="sidebar-section">
            <h4>Email</h4>
            <p>{data.personalInfo.email}</p>
          </div>
        )}

        {data.personalInfo.phone && (
          <div className="sidebar-section">
            <h4>Phone</h4>
            <p>{data.personalInfo.phone}</p>
          </div>
        )}

        {data.personalInfo.location && (
          <div className="sidebar-section">
            <h4>Location</h4>
            <p>{data.personalInfo.location}</p>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="sidebar-section">
            <h4>Languages</h4>
            {data.languages.map((lang) => (
              <div key={lang.id} className="sidebar-item">
                {lang.name} - {lang.proficiency}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="sidebar-section">
            <h4>Skills</h4>
            {data.skills.map((skill) => (
              <div key={skill.id} className="sidebar-skill">
                <span>{skill.name}</span>
                <div className="sidebar-skill-bar">
                  <div className="sidebar-skill-level" style={{ width: `${getSkillWidth(skill.proficiency)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="main-header">
          <h1>{data.personalInfo.fullName}</h1>
          {data.experience.length > 0 && (
            <h2>{data.experience[0].jobTitle}</h2>
          )}
          {data.personalInfo.summary && (
            <p className="summary">{data.personalInfo.summary}</p>
          )}
        </div>

        {data.experience.length > 0 && (
          <div className="main-section">
            <h3>Work Experience</h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className="main-item">
                <div className="item-header">
                  <strong>{exp.jobTitle}</strong>
                  <span className="date">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                </div>
                <div className="company-info">{exp.company} | {exp.location}</div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="main-section">
            <h3>Education</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="main-item">
                <div className="item-header">
                  <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                  <span className="date">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="company-info">{edu.school}</div>
                {edu.description && <p>{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="main-section">
            <h3>Projects</h3>
            {data.projects.map((project) => (
              <div key={project.id} className="main-item">
                <div className="item-header">
                  <strong>{project.title}</strong>
                  <span className="date">{project.technologies || ''}</span>
                </div>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="resume-minimal">
      <div className="minimal-header">
        <h1>{data.personalInfo.fullName}</h1>
        <div className="minimal-contact">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div className="resume-section">
          <p>{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="resume-section">
          <h3>Experience</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className="minimal-item">
              <div className="minimal-header-sm">
                <strong>{exp.jobTitle}</strong>
                <span>{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
              </div>
              <p>{exp.company} | {exp.location}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="resume-section">
          <h3>Education</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className="minimal-item">
              <div className="minimal-header-sm">
                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              <p>{edu.school}</p>
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="resume-section">
          <h3>Skills</h3>
          <p>
            {data.skills.map((s) => s.name).join(' • ')}
          </p>
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="resume-section">
          <h3>Projects</h3>
          {data.projects.map((project) => (
            <div key={project.id} className="minimal-item">
              <div className="minimal-header-sm">
                <strong>{project.title}</strong>
                <span>{project.technologies || ''}</span>
              </div>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div className="resume-section">
          <h3>Languages</h3>
          <p>
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return renderModernTemplate();
      case 'classic':
        return renderClassicTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'professional':
      case 'creative':
      case 'elegant':
        return renderSidebarTemplate();
      case 'simple':
        return renderClassicTemplate();
      case 'executive':
        return renderModernTemplate();
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div className="resume-preview-container" style={{ fontSize: `${fontSize}px`, background: darkMode ? '#1f1f1f' : '#ffffff' }}>
      <Card
        title={`Resume Preview - ${template.charAt(0).toUpperCase() + template.slice(1)}`}
        style={{ background: darkMode ? '#262626' : '#ffffff', color: darkMode ? '#ffffff' : '#000000' }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => exportToPDF('resume-content', `resume-${data.personalInfo.fullName || 'resume'}.pdf`)}
            >
              Download PDF
            </Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print
            </Button>
          </Space>
        }
      >
        <div id="resume-content" className="resume-content">
          {renderTemplate()}
        </div>
      </Card>
    </div>
  );
};

export default ResumePreview;
