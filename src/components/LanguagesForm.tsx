import React from 'react';
import { Input, Button, Card, Select, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Language } from '../types/resume';

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      proficiency: 'Intermediate',
    };
    onChange([...data, newLanguage]);
  };

  const removeLanguage = (id: string) => {
    onChange(data.filter(language => language.id !== id));
  };

  const handleChange = (id: string, field: keyof Language, value: any) => {
    onChange(data.map(language =>
      language.id === id ? { ...language, [field]: value } : language
    ));
  };

  return (
    <Card title="Languages" className="form-card">
      {data.map((language) => (
        <Row key={language.id} gutter={16} style={{ marginBottom: 16 }} align="middle">
          <Col span={12}>
            <Input
              value={language.name}
              onChange={(e) => handleChange(language.id, 'name', e.target.value)}
              placeholder="Language name"
            />
          </Col>
          <Col span={10}>
            <Select
              value={language.proficiency}
              onChange={(value) => handleChange(language.id, 'proficiency', value)}
              options={[
                { label: 'Basic', value: 'Basic' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Professional', value: 'Professional' },
                { label: 'Fluent', value: 'Fluent' },
                { label: 'Native', value: 'Native' },
              ]}
            />
          </Col>
          <Col span={2}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeLanguage(language.id)}
            />
          </Col>
        </Row>
      ))}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addLanguage}
        block
      >
        Add Language
      </Button>
    </Card>
  );
};

export default LanguagesForm;
