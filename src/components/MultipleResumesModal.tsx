import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Space, message, Popconfirm, Input, Tag } from 'antd';
import { DeleteOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import type { ResumeData } from '../types/resume';

export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

interface MultipleResumesModalProps {
  visible: boolean;
  onClose: () => void;
  currentResume: ResumeData;
  onLoadResume: (resume: ResumeData) => void;
  onSaveNewVersion?: (name: string) => void;
}

const MultipleResumesModal: React.FC<MultipleResumesModalProps> = ({
  visible,
  onClose,
  currentResume,
  onLoadResume,
}) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [newVersionName, setNewVersionName] = useState('');

  // Load versions from localStorage
  useEffect(() => {
    if (visible) {
      const saved = localStorage.getItem('resumeVersions');
      if (saved) {
        setVersions(JSON.parse(saved));
      }
    }
  }, [visible]);

  const handleSaveVersion = () => {
    if (!newVersionName.trim()) {
      message.error('Please enter a version name');
      return;
    }

    const newVersion: ResumeVersion = {
      id: `version-${Date.now()}`,
      name: newVersionName,
      data: currentResume,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...versions, newVersion];
    setVersions(updated);
    localStorage.setItem('resumeVersions', JSON.stringify(updated));
    setNewVersionName('');
    message.success(`Saved version: "${newVersionName}"`);
  };

  const handleLoadVersion = (version: ResumeVersion) => {
    onLoadResume(version.data);
    message.success(`Loaded version: "${version.name}"`);
  };

  const handleDeleteVersion = (id: string) => {
    const updated = versions.filter((v) => v.id !== id);
    setVersions(updated);
    localStorage.setItem('resumeVersions', JSON.stringify(updated));
    message.success('Version deleted');
  };

  const handleDuplicateVersion = (version: ResumeVersion) => {
    const duplicated: ResumeVersion = {
      ...version,
      id: `version-${Date.now()}`,
      name: `${version.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...versions, duplicated];
    setVersions(updated);
    localStorage.setItem('resumeVersions', JSON.stringify(updated));
    message.success('Version duplicated');
  };

  return (
    <Modal
      title="💾 Resume Versions Manager"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Save New Version */}
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Save Current Resume as New Version
          </label>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder="e.g., Version 1, Tech Stack 2024"
              onPressEnter={handleSaveVersion}
            />
            <Button type="primary" onClick={handleSaveVersion}>
              Save Version
            </Button>
          </Space.Compact>
        </div>

        {/* Versions List */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Saved Versions ({versions.length})
          </label>
          {versions.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>
              No saved versions yet. Save your first version above.
            </p>
          ) : (
            <List
              dataSource={versions}
              renderItem={(version) => (
                <List.Item
                  style={{
                    padding: '12px',
                    borderRadius: '4px',
                    background: '#fafafa',
                    marginBottom: '8px',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{version.name}</span>
                        <Tag color="blue">
                          {new Date(version.updatedAt).toLocaleDateString()}
                        </Tag>
                      </div>
                    }
                    description={`Created: ${new Date(version.createdAt).toLocaleString()}`}
                  />
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => handleLoadVersion(version)}
                    >
                      Load
                    </Button>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleDuplicateVersion(version)}
                    >
                      Duplicate
                    </Button>
                    <Popconfirm
                      title="Delete Version"
                      description="Are you sure you want to delete this version?"
                      onConfirm={() => handleDeleteVersion(version.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger size="small" icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MultipleResumesModal;
