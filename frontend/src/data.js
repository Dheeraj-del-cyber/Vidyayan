export const children = [
  { id: 'rahul', name: 'Rahul Shetty', initials: 'RS', age: 10, className: 'Class 5', homeState: 'Karnataka', currentState: 'Maharashtra', language: 'Kannada', progress: 68, status: 'Learning', color: 'coral' },
  { id: 'meera', name: 'Meera Pawar', initials: 'MP', age: 9, className: 'Class 4', homeState: 'Maharashtra', currentState: 'Goa', language: 'Marathi', progress: 82, status: 'Bridge in progress', color: 'teal' },
  { id: 'arjun', name: 'Arjun Kumar', initials: 'AK', age: 11, className: 'Class 6', homeState: 'Tamil Nadu', currentState: 'Karnataka', language: 'Tamil', progress: 54, status: 'Gap identified', color: 'yellow' },
  { id: 'sana', name: 'Sana Begum', initials: 'SB', age: 8, className: 'Class 3', homeState: 'Bihar', currentState: 'Maharashtra', language: 'Hindi', progress: 91, status: 'Completed', color: 'blue' },
];

export const subjects = [
  { name: 'Mathematics', progress: 72, completed: 8, total: 12, color: 'coral' },
  { name: 'Science', progress: 61, completed: 6, total: 10, color: 'teal' },
  { name: 'English', progress: 80, completed: 9, total: 11, color: 'blue' },
  { name: 'Social Science', progress: 54, completed: 5, total: 9, color: 'yellow' },
];

export const gaps = [
  { subject: 'Mathematics', topic: 'Decimals', status: 'Missing', priority: 'High', detail: 'The destination curriculum introduces decimals before the child has completed the equivalent concept in the home curriculum.' },
  { subject: 'Mathematics', topic: 'Basic Geometry', status: 'Missing', priority: 'Medium', detail: 'Lines, angles and shapes appear earlier in the destination sequence.' },
  { subject: 'Science', topic: 'States of Matter', status: 'Partial', priority: 'Medium', detail: 'The child has encountered solids and liquids, but needs the gas concept to continue.' },
  { subject: 'English', topic: 'Grammar Basics', status: 'Missing', priority: 'Low', detail: 'The destination board expects sentence structure and tenses at this stage.' },
];

export const activities = [
  { icon: 'spark', title: 'Gap analysis completed', text: 'Rahul · Mathematics', time: '12 min ago' },
  { icon: 'book', title: 'Bridging package generated', text: 'Rahul · Decimals', time: 'Yesterday' },
  { icon: 'check', title: 'Chapter 4 completed', text: 'Meera · Mathematics', time: '2 days ago' },
  { icon: 'route', title: 'Child migrated to Maharashtra', text: 'Sana · Learning record updated', time: '4 days ago' },
];

export const timeline = [
  { date: 'June 2026', title: 'Karnataka', text: 'Class 5 · 12 chapters completed', active: false },
  { date: 'November 2026', title: 'Maharashtra', text: 'Curriculum gap identified', active: true },
  { date: 'December 2026', title: 'Bridge lessons', text: '4 learning gaps completed', active: false },
  { date: 'January 2027', title: 'New migration', text: 'Learning record carried forward', active: false },
];
