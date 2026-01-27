import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Tabs, Button, Space, Modal, message } from 'antd';
import { SaveOutlined, UndoOutlined, CopyOutlined } from '@ant-design/icons';
import type { ResumeData } from './types/resume';
import PersonalInfoForm from './components/PersonalInfoForm';
import EducationForm from './components/EducationForm';
import ExperienceForm from './components/ExperienceForm';
import SkillsForm from './components/SkillsForm';
import ProjectsForm from './components/ProjectsForm';
import LanguagesForm from './components/LanguagesForm';
import TemplateSelect from './components/TemplateSelect';
import ResumePreview from './components/ResumePreview';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/helpers';
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
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isSaved, setIsSaved] = useState(true);

  // Load data on mount
  useEffect(() => {
    const saved = loadFromLocalStorage('resumeData');
    if (saved) {
      setResumeData(saved);
      setIsSaved(true);
    }
  }, []);

  // Mark as unsaved when data changes
  useEffect(() => {
    setIsSaved(false);
  }, [resumeData]);

  const handleSave = () => {
    saveToLocalStorage('resumeData', resumeData);
    setIsSaved(true);
    message.success('Resume saved successfully!');
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
        message.success('Resume reset successfully!');
      },
    });
  };

  const handleDuplicate = () => {
    const newData = JSON.parse(JSON.stringify(resumeData));
    saveToLocalStorage('resumeData_backup', newData);
    message.success('Resume duplicated! You can load it later.');
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
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'white', margin: 0 }}>Resume Builder</h2>
          <Space>
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
        <Content style={{ padding: '24px' }}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                <TemplateSelect
                  template={resumeData.template}
                  onChange={(template) =>
                    setResumeData({ ...resumeData, template })
                  }
                />
                <Tabs items={tabItems} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingLeft: 16 }}>
                <ResumePreview data={resumeData} template={resumeData.template} />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
