import React, { useState } from 'react';
import { Modal, Button, Tabs, message, Space, Upload, Divider } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { exportResumeAsJSON, exportResumeAsCSV, parseJSONToResume, parseCSVToResume } from '../utils/importExport';
import type { ResumeData } from '../types/resume';

interface ImportExportModalProps {
  visible: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onImport: (data: Partial<ResumeData>) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ visible, onClose, resumeData, onImport }) => {
  const [importData, setImportData] = useState('');

  const handleDownloadJSON = () => {
    const json = exportResumeAsJSON(resumeData);
    const element = document.createElement('a');
    const file = new Blob([json], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `resume-${resumeData.personalInfo.fullName || 'resume'}-${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    message.success('Resume downloaded as JSON!');
  };

  const handleDownloadCSV = () => {
    const csv = exportResumeAsCSV(resumeData);
    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `resume-${resumeData.personalInfo.fullName || 'resume'}-${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    message.success('Resume downloaded as CSV!');
  };

  const handleImportJSON = () => {
    try {
      const parsed = parseJSONToResume(importData);
      if (Object.keys(parsed).length === 0) {
        message.error('Invalid JSON format');
        return;
      }
      onImport(parsed);
      message.success('Resume imported successfully!');
      setImportData('');
      onClose();
    } catch (error) {
      message.error('Failed to import JSON. Please check the format.');
    }
  };

  const handleImportCSV = () => {
    try {
      const parsed = parseCSVToResume(importData);
      if (Object.keys(parsed).length === 0) {
        message.error('Invalid CSV format');
        return;
      }
      onImport(parsed);
      message.success('Resume imported successfully!');
      setImportData('');
      onClose();
    } catch (error) {
      message.error('Failed to import CSV. Please check the format.');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setImportData(text);
      message.success('File loaded! Click Import to proceed.');
    } catch (error) {
      message.error('Failed to read file');
    }
    return false;
  };

  const tabItems = [
    {
      key: '1',
      label: '📥 Import',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Upload JSON or CSV File
            </label>
            <Upload
              accept=".json,.csv"
              maxCount={1}
              beforeUpload={handleFileUpload}
              onDrop={(e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  handleFileUpload(files[0]);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </div>

          <Divider>OR</Divider>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Paste JSON or CSV Content
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your JSON or CSV content here..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            />
          </div>

          <Space>
            <Button
              type="primary"
              onClick={handleImportJSON}
              disabled={!importData.trim()}
            >
              Import as JSON
            </Button>
            <Button
              type="primary"
              onClick={handleImportCSV}
              disabled={!importData.trim()}
            >
              Import as CSV
            </Button>
          </Space>
        </div>
      ),
    },
    {
      key: '2',
      label: '📤 Export',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p>Export your resume data in different formats for backup or sharing:</p>

          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Export as JSON</h4>
            <p>Best for backup and importing into other tools</p>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadJSON}>
              Download JSON
            </Button>
          </div>

          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <h4 style={{ marginTop: 0 }}>Export as CSV</h4>
            <p>Compatible with spreadsheet applications</p>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="📥📤 Import / Export Resume"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <Tabs items={tabItems} />
    </Modal>
  );
};

export default ImportExportModal;
