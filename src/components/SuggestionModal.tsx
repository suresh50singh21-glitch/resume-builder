import React from 'react';
import { Modal, Button, message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

interface SuggestionModalProps {
  visible: boolean;
  title: string;
  original: string;
  suggested: string;
  loading: boolean;
  error?: string;
  onAccept: (suggestion: string) => void;
  onCancel: () => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  visible,
  title,
  original,
  suggested,
  loading,
  error,
  onAccept,
  onCancel,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(suggested);
    message.success('Copied to clipboard');
  };

  const handleAccept = () => {
    onAccept(suggested);
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="copy" icon={<CopyOutlined />} onClick={handleCopy}>
          Copy
        </Button>,
        <Button key="accept" type="primary" icon={<CheckOutlined />} onClick={handleAccept} loading={loading}>
          Accept & Use
        </Button>,
      ]}
    >
      {error ? (
        <div style={{ color: '#d32f2f', padding: '16px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 8, color: '#666' }}>Original:</h4>
            <div
              style={{
                padding: 12,
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                minHeight: 60,
                lineHeight: '1.5',
              }}
            >
              {original}
            </div>
          </div>

          {suggested && (
            <div>
              <h4 style={{ marginBottom: 8, color: '#666' }}>AI Suggestion:</h4>
              <div
                style={{
                  padding: 12,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 4,
                  minHeight: 60,
                  lineHeight: '1.5',
                  border: '1px solid #4caf50',
                }}
              >
                {suggested}
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default SuggestionModal;
