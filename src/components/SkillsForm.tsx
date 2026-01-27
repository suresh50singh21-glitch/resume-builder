import React from 'react';
import { Input, Button, Card, Select, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Skill } from '../types/resume';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      proficiency: 'Intermediate',
    };
    onChange([...data, newSkill]);
  };

  const removeSkill = (id: string) => {
    onChange(data.filter(skill => skill.id !== id));
  };

  const handleChange = (id: string, field: keyof Skill, value: any) => {
    onChange(data.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  return (
    <Card title="Skills" className="form-card">
      {data.map((skill) => (
        <Row key={skill.id} gutter={16} style={{ marginBottom: 16 }} align="middle">
          <Col span={12}>
            <Input
              value={skill.name}
              onChange={(e) => handleChange(skill.id, 'name', e.target.value)}
              placeholder="Skill name (e.g., JavaScript, Project Management)"
            />
          </Col>
          <Col span={10}>
            <Select
              value={skill.proficiency}
              onChange={(value) => handleChange(skill.id, 'proficiency', value)}
              options={[
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
                { label: 'Expert', value: 'Expert' },
              ]}
            />
          </Col>
          <Col span={2}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeSkill(skill.id)}
            />
          </Col>
        </Row>
      ))}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={addSkill}
        block
      >
        Add Skill
      </Button>
    </Card>
  );
};

export default SkillsForm;
