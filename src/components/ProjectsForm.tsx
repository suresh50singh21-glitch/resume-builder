import React from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Project } from '../types/resume';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      link: '',
      technologies: '',
    };
    onChange([...data, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter(project => project.id !== id));
  };

  const handleChange = (id: string, field: keyof Project, value: any) => {
    onChange(data.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  return (
    <Card title="Projects" className="form-card">
      {data.map((project, index) => (
        <Card
          key={project.id}
          type="inner"
          title={`Project ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeProject(project.id)}
            />
          }
          style={{ marginBottom: 16 }}
        >
          <Form layout="vertical">
            <Form.Item label="Project Title">
              <Input
                value={project.title}
                onChange={(e) => handleChange(project.id, 'title', e.target.value)}
                placeholder="Project name"
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                rows={3}
                value={project.description}
                onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                placeholder="Describe your project"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Project Link">
                  <Input
                    value={project.link}
                    onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                    placeholder="https://example.com"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Technologies Used">
                  <Input
                    value={project.technologies}
                    onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ))}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addProject}
        block
      >
        Add Project
      </Button>
    </Card>
  );
};

export default ProjectsForm;
