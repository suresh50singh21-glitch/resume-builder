import React from 'react';
import { Card, Row, Col } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

interface TemplatesGridProps {
  currentTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design', color: '#1890ff' },
  { id: 'classic', name: 'Classic', description: 'Traditional and timeless layout', color: '#722ed1' },
  { id: 'minimal', name: 'Minimal', description: 'Minimalist and focused approach', color: '#faad14' },
  { id: 'professional', name: 'Professional', description: 'Teal sidebar with modern layout', color: '#17a2b8' },
  { id: 'creative', name: 'Creative', description: 'Bold and creative design', color: '#eb2f96' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and elegant style', color: '#13c2c2' },
  { id: 'simple', name: 'Simple', description: 'Simple and straightforward format', color: '#52c41a' },
  { id: 'executive', name: 'Executive', description: 'Executive-level professional resume', color: '#f5222d' },
];

const TemplatesGrid: React.FC<TemplatesGridProps> = ({ currentTemplate, onSelectTemplate }) => {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 24, fontSize: 18, fontWeight: 'bold' }}>
        📋 Select Resume Template
      </h3>
      <Row gutter={[16, 16]}>
        {templates.map((template) => (
          <Col key={template.id} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => onSelectTemplate(template.id)}
              style={{
                cursor: 'pointer',
                border: currentTemplate === template.id ? `2px solid ${template.color}` : '1px solid #d9d9d9',
                position: 'relative',
                height: '100%',
              }}
            >
              {currentTemplate === template.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: template.color,
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckOutlined />
                </div>
              )}
              
              <div
                style={{
                  height: 60,
                  background: `linear-gradient(135deg, ${template.color}33 0%, ${template.color}11 100%)`,
                  borderRadius: 4,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: template.color,
                  fontWeight: 'bold',
                }}
              >
                {template.name}
              </div>
              
              <h4 style={{ margin: '8px 0 4px 0', fontWeight: 'bold' }}>{template.name}</h4>
              <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{template.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplatesGrid;
