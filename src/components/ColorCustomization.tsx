import React from 'react';
import { Collapse, Row, Col, Input, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ColorCustomizationProps {
  accentColor: string;
  onColorChange: (color: string) => void;
  onResetColor: () => void;
}

const defaultColors: Record<string, string> = {
  'modern': '#1890ff',
  'classic': '#722ed1',
  'minimal': '#faad14',
  'professional': '#17a2b8',
  'creative': '#eb2f96',
  'elegant': '#13c2c2',
  'simple': '#52c41a',
  'executive': '#f5222d',
};

const ColorCustomization: React.FC<ColorCustomizationProps> = ({ accentColor, onColorChange, onResetColor }) => {
  const presetColors = ['#1890ff', '#722ed1', '#faad14', '#17a2b8', '#eb2f96', '#13c2c2', '#52c41a', '#f5222d'];

  return (
    <Collapse
      style={{ marginBottom: 16 }}
      items={[
        {
          key: '1',
          label: '🎨 Color Customization',
          children: (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Accent Color
                </label>
                <Row gutter={8}>
                  <Col span={8}>
                    <Input
                      type="color"
                      value={accentColor}
                      onChange={(e) => onColorChange(e.target.value)}
                      style={{ height: 40, cursor: 'pointer' }}
                    />
                  </Col>
                  <Col span={16}>
                    <Input
                      value={accentColor}
                      onChange={(e) => onColorChange(e.target.value)}
                      placeholder="#17a2b8"
                    />
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                  Preset Colors
                </label>
                <Space wrap>
                  {presetColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => onColorChange(color)}
                      style={{
                        width: 40,
                        height: 40,
                        background: color,
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: accentColor === color ? '3px solid #000' : '1px solid #d9d9d9',
                      }}
                      title={color}
                    />
                  ))}
                </Space>
              </div>

              <Button
                icon={<ReloadOutlined />}
                onClick={onResetColor}
                style={{ width: '100%' }}
              >
                Reset to Default
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ColorCustomization;
export { defaultColors };
