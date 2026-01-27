import React from 'react';
import { Form, Input, Button, Card, Row, Col, Checkbox } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Experience } from '../types/resume';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    onChange(data.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <Card title="Work Experience" className="form-card">
      {data.map((exp, index) => (
        <Card
          key={exp.id}
          type="inner"
          title={`Experience ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeExperience(exp.id)}
            />
          }
          style={{ marginBottom: 16 }}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Job Title">
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => handleChange(exp.id, 'jobTitle', e.target.value)}
                    placeholder="Senior Developer"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Company">
                  <Input
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Location">
              <Input
                value={exp.location}
                onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                placeholder="City, State/Country"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={10}>
                <Form.Item label="Start Date">
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="End Date">
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                    disabled={exp.currentlyWorking}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Checkbox
                    checked={exp.currentlyWorking}
                    onChange={(e) => handleChange(exp.id, 'currentlyWorking', e.target.checked)}
                  >
                    Currently Working
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description">
              <Input.TextArea
                rows={4}
                value={exp.description}
                onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements"
              />
            </Form.Item>
          </Form>
        </Card>
      ))}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addExperience}
        block
      >
        Add Experience
      </Button>
    </Card>
  );
};

export default ExperienceForm;
