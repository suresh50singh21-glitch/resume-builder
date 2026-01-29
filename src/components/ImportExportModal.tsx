import React, { useState } from 'react';
import { Modal, Button, Tabs, message, Space, Upload, Divider, Spin } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { exportResumeAsJSON, exportResumeAsCSV, parseJSONToResume, parseCSVToResume } from '../utils/importExport';
import { parseResumeFromText } from '../utils/pdfParser';
import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeData } from '../types/resume';

interface ImportExportModalProps {
  visible: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onImport: (data: Partial<ResumeData>) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ visible, onClose, resumeData, onImport }) => {
  const [importData, setImportData] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Set up PDF.js worker
  React.useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

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
      if (file.type === 'application/pdf') {
        // Handle PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
          fullText += pageText + '\n';
        }
        
        setImportData(fullText);
        message.success('PDF loaded! Click "Extract & Fill Form" to populate the resume fields.');
      } else {
        // Handle JSON/CSV
        const text = await file.text();
        setImportData(text);
        message.success('File loaded! Click Import to proceed.');
      }
    } catch (error) {
      message.error('Failed to read file');
      console.error(error);
    }
    return false;
  };

  const handleExtractAndFill = async () => {
    if (!importData.trim()) {
      message.error('No data to extract');
      return;
    }

    setIsExtracting(true);
    try {
      const extracted = await parseResumeFromText(importData);
      onImport(extracted);
      message.success('Resume data extracted and form updated successfully!');
      setImportData('');
      onClose();
    } catch (error) {
      message.error(`Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: '📥 Import',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Upload JSON, CSV, or PDF File
            </label>
            <Upload
              accept=".json,.csv,.pdf"
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
              placeholder="Paste your JSON or CSV content here... Or paste extracted text from PDF..."
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
            <Button
              type="primary"
              danger
              loading={isExtracting}
              onClick={handleExtractAndFill}
              disabled={!importData.trim()}
            >
              Extract & Fill Form (AI)
            </Button>
            <Button
              onClick={() => {
                setImportData('');
                message.info('Text cleared. You can paste new content or upload a file.');
              }}
            >
              Clear
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
