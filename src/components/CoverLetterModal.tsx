import React, { useState } from 'react';
import { Modal, Button, message, Space, Card } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { generateCoverLetter } from '../utils/gemini';
import type { ResumeData } from '../types/resume';

interface CoverLetterModalProps {
  visible: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ visible, onClose, resumeData }) => {
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleGenerateCoverLetter = async () => {
    if (!company.trim() || !jobTitle.trim()) {
      message.error('Please enter company name and job title');
      return;
    }

    setLoading(true);
    try {
      const result = await generateCoverLetter(
        resumeData.personalInfo.fullName || 'Applicant',
        jobTitle,
        company,
        resumeData.experience
      );

      if (result.success) {
        setCoverLetter(result.coverLetter);
        message.success('Cover letter generated successfully!');
      } else {
        message.error(result.error || 'Failed to generate cover letter');
      }
    } catch (error) {
      message.error('Error generating cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    message.success('Cover letter copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${company}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    message.success('Cover letter downloaded!');
  };

  return (
    <Modal
      title="📝 AI Cover Letter Generator"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Input Section */}
        <Card type="inner">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft, Amazon"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
                fontSize: '14px',
              }}
            />
          </div>

          <Button
            type="primary"
            onClick={handleGenerateCoverLetter}
            loading={loading}
            block
            size="large"
          >
            Generate Cover Letter
          </Button>
        </Card>

        {/* Generated Cover Letter Section */}
        {coverLetter && (
          <Card type="inner">
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                Generated Cover Letter
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #d9d9d9',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                Copy to Clipboard
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
                Download as Text
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default CoverLetterModal;
