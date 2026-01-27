import React from 'react';
import { Form, Input, Card, Upload, message, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { PersonalInfo } from '../types/resume';
import { ALL_COUNTRIES, ALL_CITIES } from '../utils/locations';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [form] = Form.useForm();
  const [locationOptions, setLocationOptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  const handleChange = (changedValues: Partial<PersonalInfo>) => {
    onChange({ ...data, ...changedValues });
  };

  const handleLocationSearch = (value: string) => {
    if (!value) {
      setLocationOptions([]);
      return;
    }

    const searchValue = value.toLowerCase();
    const countrySuggestions = ALL_COUNTRIES
      .filter(c => c.toLowerCase().includes(searchValue))
      .slice(0, 10)
      .map(c => ({ label: c, value: c, type: 'country' }));

    const citySuggestions = ALL_CITIES
      .filter(c => c.toLowerCase().includes(searchValue))
      .slice(0, 10)
      .map(c => ({ label: c, value: c, type: 'city' }));

    const options: any[] = [];

    if (countrySuggestions.length > 0) {
      options.push({
        label: 'Countries',
        options: countrySuggestions,
      });
    }

    if (citySuggestions.length > 0) {
      options.push({
        label: 'Cities',
        options: citySuggestions,
      });
    }

    setLocationOptions(options);
  };

  const handlePhotoUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        onChange({ ...data, photo: base64String });
        message.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card title="Personal Information" className="form-card">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleChange}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="+1 (555) 000-0000" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please enter your location' }]}
        >
          <AutoComplete
            value={data.location}
            onSearch={handleLocationSearch}
            onSelect={(value) => {
              onChange({ ...data, location: value });
            }}
            onChange={(value) => {
              onChange({ ...data, location: value });
            }}
            options={locationOptions}
            placeholder="City, State/Country (e.g., New York, USA)"
            filterOption={false}
          />
        </Form.Item>

        <Form.Item
          label="Professional Summary"
          name="summary"
        >
          <Input.TextArea 
            rows={4}
            placeholder="Brief overview of your professional background and goals"
          />
        </Form.Item>

        <Form.Item
          label="Photo"
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={() => false}
            onChange={handlePhotoUpload}
            fileList={[]}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Photo</div>
            </div>
          </Upload>
          {data.photo && (
            <div style={{ marginTop: 16 }}>
              <img src={data.photo} alt="Preview" style={{ maxWidth: '150px', borderRadius: '4px' }} />
            </div>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PersonalInfoForm;
