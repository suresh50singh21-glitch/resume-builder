import React from 'react';
import { Segmented, Card, Row, Col } from 'antd';
import type { ResumeData } from '../types/resume';

interface TemplateSelectProps {
  template: ResumeData['template'];
  onChange: (template: ResumeData['template']) => void;
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({ template, onChange }) => {
  const templates: Array<{ label: string; value: ResumeData['template']; description: string }> = [
    { label: 'Modern', value: 'modern', description: 'Clean, contemporary with accent colors' },
    { label: 'Classic', value: 'classic', description: 'Traditional, professional layout' },
    { label: 'Minimal', value: 'minimal', description: 'Simple, clean minimalist design' },
    { label: 'Professional', value: 'professional', description: 'Corporate style with sidebar' },
    { label: 'Creative', value: 'creative', description: 'Bold, colorful design' },
    { label: 'Simple', value: 'simple', description: 'Lightweight, easy to read' },
    { label: 'Elegant', value: 'elegant', description: 'Sophisticated, premium look' },
    { label: 'Executive', value: 'executive', description: 'High-level professional' },
  ];

  return (
    <Card title="Select Resume Template" style={{ marginBottom: 24 }}>
      <Segmented
        value={template}
        onChange={(value) => onChange(value as ResumeData['template'])}
        options={templates.map(t => ({
          label: t.label,
          value: t.value,
        }))}
        block
      />
      
      <Row gutter={16} style={{ marginTop: 20 }}>
        {templates.map((tmpl) => (
          <Col span={12} key={tmpl.value} style={{ marginBottom: 16 }}>
            <Card 
              className={`template-preview template-${tmpl.value}`}
              onClick={() => onChange(tmpl.value)}
              style={{ cursor: 'pointer', transition: 'all 0.3s', border: template === tmpl.value ? '2px solid #1890ff' : '1px solid #d9d9d9' }}
            >
              <h4>{tmpl.label}</h4>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{tmpl.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default TemplateSelect;
