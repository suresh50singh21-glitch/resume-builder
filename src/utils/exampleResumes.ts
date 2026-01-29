import type { ResumeData } from '../types/resume';

export const exampleResume1: ResumeData = {
  personalInfo: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA, USA',
    summary: 'Experienced Software Engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.',
    photo: undefined,
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Innovations Inc',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: '',
      currentlyWorking: true,
      description: 'Led development of microservices architecture serving 2M+ users. Reduced API latency by 40% through optimization. Mentored 4 junior developers and established code review standards.',
    },
    {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'Digital Solutions Ltd',
      location: 'San Jose, CA',
      startDate: '2018-03',
      endDate: '2021-05',
      currentlyWorking: false,
      description: 'Developed and maintained 15+ production web applications using React, Node.js, and PostgreSQL. Improved deployment pipeline efficiency by 60% using Docker and CI/CD. Collaborated with product team to define technical requirements.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014-08',
      endDate: '2018-05',
      grade: '3.8',
      description: 'Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development. President of Computer Science Club.',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript/TypeScript', proficiency: 'Expert' },
    { id: '2', name: 'React.js', proficiency: 'Expert' },
    { id: '3', name: 'Node.js', proficiency: 'Advanced' },
    { id: '4', name: 'AWS/Cloud Architecture', proficiency: 'Advanced' },
    { id: '5', name: 'PostgreSQL', proficiency: 'Advanced' },
    { id: '6', name: 'Docker & Kubernetes', proficiency: 'Intermediate' },
    { id: '7', name: 'Team Leadership', proficiency: 'Advanced' },
  ],
  projects: [
    {
      id: '1',
      title: 'Real-time Analytics Dashboard',
      description: 'Built a real-time data visualization platform using React and WebSockets. Handles 100k+ data points per second with sub-100ms latency.',
      link: 'github.com/example/analytics',
      technologies: 'React, Node.js, WebSockets, PostgreSQL',
    },
    {
      id: '2',
      title: 'Microservices Payment System',
      description: 'Architected and implemented a scalable payment processing system handling $10M+ in daily transactions with 99.99% uptime.',
      link: 'github.com/example/payments',
      technologies: 'Node.js, AWS, Kubernetes, Docker',
    },
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Spanish', proficiency: 'Professional' },
    { id: '3', name: 'Mandarin', proficiency: 'Intermediate' },
  ],
  template: 'professional',
};

export const exampleResume2: ResumeData = {
  personalInfo: {
    fullName: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY, USA',
    summary: 'Creative UI/UX Designer with 6+ years of experience creating user-centered digital experiences. Specialized in mobile app design, user research, and design systems.',
    photo: undefined,
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Lead UX Designer',
      company: 'Design Studios Co',
      location: 'New York, NY',
      startDate: '2020-08',
      endDate: '',
      currentlyWorking: true,
      description: 'Led design for 5 major product launches with 50%+ user satisfaction improvement. Established design system used by 40+ designers. Conducted user research with 200+ participants.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'Parsons School of Design',
      degree: 'Master of Fine Arts',
      fieldOfStudy: 'Interaction Design',
      startDate: '2016-09',
      endDate: '2018-05',
      grade: '3.9',
      description: '',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', proficiency: 'Expert' },
    { id: '2', name: 'User Research', proficiency: 'Expert' },
    { id: '3', name: 'Prototyping', proficiency: 'Advanced' },
    { id: '4', name: 'Design Systems', proficiency: 'Advanced' },
  ],
  projects: [],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
  ],
  template: 'creative',
};

export const loadExampleResume = (exampleNumber: 1 | 2): ResumeData => {
  return exampleNumber === 1 ? exampleResume1 : exampleResume2;
};
