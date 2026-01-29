import React, { useState } from 'react';
import { Modal, Button, Input, message, List, Space, Spin, Tag, Tooltip } from 'antd';
import { BulbOutlined, PlusOutlined } from '@ant-design/icons';
import { suggestSkillsFromJobTitle } from '../utils/gemini';
import type { Skill } from '../types/resume';

interface SkillsSuggestionModalProps {
  visible: boolean;
  onClose: () => void;
  currentSkills: Skill[];
  onAddSkill: (skill: Skill) => void;
  jobTitle?: string;
}

const SkillsSuggestionModal: React.FC<SkillsSuggestionModalProps> = ({
  visible,
  onClose,
  currentSkills,
  onAddSkill,
  jobTitle = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [inputJobTitle, setInputJobTitle] = useState(jobTitle);

  const handleSuggestSkills = async () => {
    if (!inputJobTitle.trim()) {
      message.error('Please enter a job title');
      return;
    }

    setLoading(true);
    try {
      const result = await suggestSkillsFromJobTitle(inputJobTitle);
      if (result.success) {
        setSuggestedSkills(result.skills);
        message.success(`Generated ${result.skills.length} skill suggestions!`);
      } else {
        message.error(result.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      message.error('Error generating skills');
    } finally {
      setLoading(false);
    }
  };

  const existingSkillNames = new Set(currentSkills.map((s) => s.name.toLowerCase()));

  const handleAddSkill = (skillName: string) => {
    if (existingSkillNames.has(skillName.toLowerCase())) {
      message.info(`"${skillName}" is already in your skills`);
      return;
    }

    onAddSkill({
      id: `skill-${Date.now()}`,
      name: skillName,
      proficiency: 'Intermediate',
    });

    message.success(`Added "${skillName}" to your skills`);
  };

  return (
    <Modal
      title="💡 AI Skill Suggestions"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Job Title Input */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Job Title (what role do you want skills for?)
          </label>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={inputJobTitle}
              onChange={(e) => setInputJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer, Product Manager"
              onPressEnter={handleSuggestSkills}
            />
            <Button
              type="primary"
              icon={<BulbOutlined />}
              onClick={handleSuggestSkills}
              loading={loading}
            >
              Suggest
            </Button>
          </Space.Compact>
        </div>

        {/* Suggested Skills List */}
        {suggestedSkills.length > 0 && (
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Suggested Skills ({suggestedSkills.length})
            </label>
            <List
              dataSource={suggestedSkills}
              renderItem={(skill) => (
                <List.Item
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    background: existingSkillNames.has(skill.toLowerCase()) ? '#f0f0f0' : '#fafafa',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      existingSkillNames.has(skill.toLowerCase()) ? (
                        <Tag color="green">Added</Tag>
                      ) : (
                        <div />
                      )
                    }
                    title={skill}
                  />
                  {!existingSkillNames.has(skill.toLowerCase()) && (
                    <Tooltip title="Add this skill">
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddSkill(skill)}
                      >
                        Add
                      </Button>
                    </Tooltip>
                  )}
                </List.Item>
              )}
            />
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="Generating skill suggestions..." />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SkillsSuggestionModal;
