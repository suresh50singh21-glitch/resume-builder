import React from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Education } from '../types/resume';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: any) => {
    onChange(data.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <Card title="Education" className="form-card">
      {data.map((edu, index) => (
        <Card
          key={edu.id}
          type="inner"
          title={`Education ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeEducation(edu.id)}
            />
          }
          style={{ marginBottom: 16 }}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="School">
                  <Input
                    value={edu.school}
                    onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
                    placeholder="University Name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Degree">
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Field of Study">
              <Input
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(edu.id, 'fieldOfStudy', e.target.value)}
                placeholder="Computer Science, Business, etc."
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Start Date">
                  <Input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="End Date">
                  <Input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Grade/GPA">
                  <Input
                    value={edu.grade}
                    onChange={(e) => handleChange(edu.id, 'grade', e.target.value)}
                    placeholder="e.g., 3.8"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description">
              <Input.TextArea
                rows={3}
                value={edu.description}
                onChange={(e) => handleChange(edu.id, 'description', e.target.value)}
                placeholder="Additional details about your education"
              />
            </Form.Item>
          </Form>
        </Card>
      ))}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addEducation}
        block
      >
        Add Education
      </Button>
    </Card>
  );
};

export default EducationForm;
