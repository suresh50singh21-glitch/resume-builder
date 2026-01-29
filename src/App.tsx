import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Tabs, Button, Space, Modal, message, Progress, Slider, Checkbox, Segmented, Collapse } from 'antd';
import { SaveOutlined, UndoOutlined, RedoOutlined, CopyOutlined, BgColorsOutlined, SunOutlined, MoonOutlined, BulbOutlined, FileTextOutlined, ImportOutlined, FolderOutlined } from '@ant-design/icons';
import type { ResumeData } from './types/resume';
import PersonalInfoForm from './components/PersonalInfoForm';
import EducationForm from './components/EducationForm';
import ExperienceForm from './components/ExperienceForm';
import SkillsForm from './components/SkillsForm';
import ProjectsForm from './components/ProjectsForm';
import LanguagesForm from './components/LanguagesForm';
import TemplateSelect from './components/TemplateSelect';
import ResumePreview from './components/ResumePreview';
import TemplatesGrid from './components/TemplatesGrid';
import ColorCustomization, { defaultColors } from './components/ColorCustomization';
import SkillsSuggestionModal from './components/SkillsSuggestionModal';
import CoverLetterModal from './components/CoverLetterModal';
import ImportExportModal from './components/ImportExportModal';
import MultipleResumesModal from './components/MultipleResumesModal';
import { useUndoRedo } from './hooks/useUndoRedo';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/helpers';
import { loadExampleResume } from './utils/exampleResumes';
import './App.css';

const { Header, Content } = Layout;

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  languages: [],
  template: 'modern',
};

const App: React.FC = () => {
  const { state: resumeData, setState: setResumeData, undo, redo, canUndo, canRedo } = useUndoRedo<ResumeData>(defaultResumeData);
  const [isSaved, setIsSaved] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize') || '14'));
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#17a2b8');
  const [showTemplatesGrid, setShowTemplatesGrid] = useState(false);
  const [showSkillsSuggestion, setShowSkillsSuggestion] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showMultipleResumes, setShowMultipleResumes] = useState(false);
  const [visibleSections, setVisibleSections] = useState(() => {
    const saved = localStorage.getItem('visibleSections');
    return saved ? JSON.parse(saved) : {
      experience: true,
      education: true,
      skills: true,
      projects: true,
      languages: true,
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load data on mount
  useEffect(() => {
    const saved = loadFromLocalStorage('resumeData');
    if (saved) {
      setResumeData(saved);
      setIsSaved(true);
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#141414';
    } else {
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [darkMode]);

  // Save font size preference
  useEffect(() => {
    localStorage.setItem('fontSize', String(fontSize));
  }, [fontSize]);

  // Save accent color preference
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  // Save visible sections preference
  useEffect(() => {
    localStorage.setItem('visibleSections', JSON.stringify(visibleSections));
  }, [visibleSections]);

  // Mark as unsaved when data changes
  useEffect(() => {
    setIsSaved(false);
  }, [resumeData]);

  // Validate required fields
  const validateResume = () => {
    const newErrors: Record<string, string> = {};
    
    if (!resumeData.personalInfo.fullName?.trim()) {
      newErrors['fullName'] = 'Full name is required';
    }
    if (!resumeData.personalInfo.email?.trim()) {
      newErrors['email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.personalInfo.email)) {
      newErrors['email'] = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate resume completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Personal Info (40% weight)
    total += 4;
    if (resumeData.personalInfo.fullName?.trim()) completed++;
    if (resumeData.personalInfo.email?.trim()) completed++;
    if (resumeData.personalInfo.phone?.trim()) completed++;
    if (resumeData.personalInfo.summary?.trim()) completed++;

    // Experience (20% weight)
    total += 2;
    if (resumeData.experience.length > 0) completed += 2;

    // Education (15% weight)
    total += 1.5;
    if (resumeData.education.length > 0) completed += 1.5;

    // Skills (15% weight)
    total += 1.5;
    if (resumeData.skills.length >= 3) completed += 1.5;

    // Projects (5% weight)
    total += 0.5;
    if (resumeData.projects.length > 0) completed += 0.5;

    // Languages (5% weight)
    total += 0.5;
    if (resumeData.languages.length > 0) completed += 0.5;

    return Math.round((completed / total) * 100);
  };

  const handleSave = () => {
    if (validateResume()) {
      saveToLocalStorage('resumeData', resumeData);
      setIsSaved(true);
      message.success('Resume saved successfully!');
    } else {
      message.error('Please fix validation errors before saving');
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: 'Reset Resume',
      content: 'Are you sure you want to reset all data? This action cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        setResumeData(defaultResumeData);
        localStorage.removeItem('resumeData');
        setIsSaved(true);
        setErrors({});
        message.success('Resume reset successfully!');
      },
    });
  };

  const handleDuplicate = () => {
    const newData = JSON.parse(JSON.stringify(resumeData));
    saveToLocalStorage('resumeData_backup', newData);
    message.success('Resume duplicated! You can load it later.');
  };

  const handleLoadExample = (exampleNum: 1 | 2) => {
    Modal.confirm({
      title: 'Load Example Resume',
      content: 'This will replace your current data. Continue?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        const exampleData = loadExampleResume(exampleNum);
        setResumeData(exampleData);
        message.success('Example resume loaded!');
      },
    });
  };

  const tabItems = [
    {
      key: '1',
      label: 'Personal Info',
      children: (
        <PersonalInfoForm
          data={resumeData.personalInfo}
          onChange={(personalInfo) =>
            setResumeData({ ...resumeData, personalInfo })
          }
        />
      ),
    },
    {
      key: '2',
      label: 'Experience',
      children: (
        <ExperienceForm
          data={resumeData.experience}
          onChange={(experience) =>
            setResumeData({ ...resumeData, experience })
          }
        />
      ),
    },
    {
      key: '3',
      label: 'Education',
      children: (
        <EducationForm
          data={resumeData.education}
          onChange={(education) =>
            setResumeData({ ...resumeData, education })
          }
        />
      ),
    },
    {
      key: '4',
      label: 'Skills',
      children: (
        <SkillsForm
          data={resumeData.skills}
          onChange={(skills) =>
            setResumeData({ ...resumeData, skills })
          }
        />
      ),
    },
    {
      key: '5',
      label: 'Projects',
      children: (
        <ProjectsForm
          data={resumeData.projects}
          onChange={(projects) =>
            setResumeData({ ...resumeData, projects })
          }
        />
      ),
    },
    {
      key: '6',
      label: 'Languages',
      children: (
        <LanguagesForm
          data={resumeData.languages}
          onChange={(languages) =>
            setResumeData({ ...resumeData, languages })
          }
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: darkMode ? '#141414' : '#ffffff' }}>
      <Header style={{ background: darkMode ? '#1f1f1f' : '#001529', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0 }}>Resume Builder</h2>
          <Space wrap>
            <Button
              type={darkMode ? 'default' : 'text'}
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setDarkMode(!darkMode)}
              style={{ color: 'white' }}
              title="Toggle Dark Mode"
            >
              {darkMode ? 'Light' : 'Dark'}
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={undo}
              disabled={!canUndo}
              style={{ color: 'white' }}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={redo}
              disabled={!canRedo}
              style={{ color: 'white' }}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </Button>
            <Button
              icon={<BgColorsOutlined />}
              onClick={() => setShowTemplatesGrid(true)}
              style={{ color: 'white' }}
              title="View All Templates"
            >
              Templates
            </Button>
            <Button
              icon={<BulbOutlined />}
              onClick={() => setShowSkillsSuggestion(true)}
              style={{ color: 'white' }}
              title="AI Skill Suggestions"
            >
              Skills AI
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => setShowCoverLetter(true)}
              style={{ color: 'white' }}
              title="Generate Cover Letter"
            >
              Cover Letter
            </Button>
            <Button
              icon={<ImportOutlined />}
              onClick={() => setShowImportExport(true)}
              style={{ color: 'white' }}
              title="Import/Export Resume"
            >
              Import/Export
            </Button>
            <Button
              icon={<FolderOutlined />}
              onClick={() => setShowMultipleResumes(true)}
              style={{ color: 'white' }}
              title="Manage Resume Versions"
            >
              Versions
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              danger={!isSaved}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={handleDuplicate}
            >
              Duplicate
            </Button>
            <Button
              danger
              icon={<UndoOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Space>
        </div>
      </Header>

      <Layout>
        <Content style={{ padding: '24px', background: darkMode ? '#141414' : '#ffffff' }}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: 24, padding: 16, background: darkMode ? '#262626' : '#f5f5f5', borderRadius: 8 }}>
                  <div style={{ marginBottom: 8, color: darkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>
                    Resume Completion: {calculateCompletion()}%
                  </div>
                  <Progress percent={calculateCompletion()} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                </div>

                {/* Quick Templates */}
                <Collapse
                  style={{ marginBottom: 16, background: darkMode ? '#262626' : '#ffffff' }}
                  items={[
                    {
                      key: '1',
                      label: '📋 Quick Templates - Load Pre-filled Examples',
                      children: (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Button onClick={() => handleLoadExample(1)} block>
                            Load Software Engineer Example
                          </Button>
                          <Button onClick={() => handleLoadExample(2)} block>
                            Load UI/UX Designer Example
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                />

                {/* Color Customization */}
                <ColorCustomization
                  accentColor={accentColor}
                  onColorChange={setAccentColor}
                  onResetColor={() => setAccentColor(defaultColors[resumeData.template] || '#1890ff')}
                />

                {/* Visible Sections */}
                <Collapse
                  style={{ marginBottom: 16, background: darkMode ? '#262626' : '#ffffff' }}
                  items={[
                    {
                      key: '1',
                      label: '👁️ Preview Settings',
                      children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div>
                            <label style={{ color: darkMode ? '#ffffff' : '#000000', display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                              Font Size: {fontSize}px
                            </label>
                            <Slider
                              min={10}
                              max={18}
                              value={fontSize}
                              onChange={setFontSize}
                              marks={{ 10: '10px', 14: '14px', 18: '18px' }}
                            />
                          </div>
                          
                          <div style={{ borderTop: `1px solid ${darkMode ? '#404040' : '#d9d9d9'}`, paddingTop: 12 }}>
                            <label style={{ color: darkMode ? '#ffffff' : '#000000', display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                              Show Sections:
                            </label>
                            <Checkbox
                              checked={visibleSections.experience}
                              onChange={(e) => setVisibleSections({ ...visibleSections, experience: e.target.checked })}
                            >
                              Experience
                            </Checkbox>
                            <Checkbox
                              checked={visibleSections.education}
                              onChange={(e) => setVisibleSections({ ...visibleSections, education: e.target.checked })}
                            >
                              Education
                            </Checkbox>
                            <Checkbox
                              checked={visibleSections.skills}
                              onChange={(e) => setVisibleSections({ ...visibleSections, skills: e.target.checked })}
                            >
                              Skills
                            </Checkbox>
                            <Checkbox
                              checked={visibleSections.projects}
                              onChange={(e) => setVisibleSections({ ...visibleSections, projects: e.target.checked })}
                            >
                              Projects
                            </Checkbox>
                            <Checkbox
                              checked={visibleSections.languages}
                              onChange={(e) => setVisibleSections({ ...visibleSections, languages: e.target.checked })}
                            >
                              Languages
                            </Checkbox>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />

                <TemplateSelect
                  template={resumeData.template}
                  onChange={(template) =>
                    setResumeData({ ...resumeData, template })
                  }
                />
                <Tabs 
                  items={tabItems}
                  tabBarStyle={{ background: darkMode ? '#262626' : '#ffffff' }}
                />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingLeft: 16 }}>
                <ResumePreview 
                  data={resumeData} 
                  template={resumeData.template}
                  darkMode={darkMode}
                  fontSize={fontSize}
                  visibleSections={visibleSections}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>

      {/* Templates Grid Modal */}
      <Modal
        title="📋 All Resume Templates"
        open={showTemplatesGrid}
        onCancel={() => setShowTemplatesGrid(false)}
        width={1200}
        footer={null}
      >
        <TemplatesGrid
          currentTemplate={resumeData.template}
          onSelectTemplate={(template) => {
            setResumeData({ ...resumeData, template });
            setShowTemplatesGrid(false);
            message.success(`Switched to ${template} template!`);
          }}
        />
      </Modal>

      {/* Skills Suggestion Modal */}
      <SkillsSuggestionModal
        visible={showSkillsSuggestion}
        onClose={() => setShowSkillsSuggestion(false)}
        currentSkills={resumeData.skills}
        onAddSkill={(skill) => {
          setResumeData({ ...resumeData, skills: [...resumeData.skills, skill] });
        }}
        jobTitle={resumeData.experience[0]?.jobTitle || ''}
      />

      {/* Cover Letter Modal */}
      <CoverLetterModal
        visible={showCoverLetter}
        onClose={() => setShowCoverLetter(false)}
        resumeData={resumeData}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        visible={showImportExport}
        onClose={() => setShowImportExport(false)}
        resumeData={resumeData}
        onImport={(imported) => {
          Modal.confirm({
            title: 'Import Resume',
            content: 'This will merge the imported data with your current resume. Continue?',
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
              const merged = {
                ...resumeData,
                ...imported,
                personalInfo: { ...resumeData.personalInfo, ...imported.personalInfo },
              };
              setResumeData(merged);
              message.success('Resume imported and merged successfully!');
            },
          });
        }}
      />

      {/* Multiple Resumes Modal */}
      <MultipleResumesModal
        visible={showMultipleResumes}
        onClose={() => setShowMultipleResumes(false)}
        currentResume={resumeData}
        onLoadResume={(resume) => {
          setResumeData(resume);
        }}
        onSaveNewVersion={() => {
          // Version is saved through the modal's internal logic
        }}
      />
    </Layout>
  );
};

export default App;
