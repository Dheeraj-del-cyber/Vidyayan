// Simple localStorage-backed store for students created on the Add
// student page. There is no backend endpoint yet to persist students, so
// this keeps only what was actually entered into that form - nothing
// here is invented, defaulted, or filled in on its own.
const STORAGE_KEY = 'vidyayan_students';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    // Storage can fail (private browsing, quota, etc.) - nothing else to
    // do about it here, the caller still has the in-memory value.
  }
}

export function getStudents() {
  return readAll();
}

export function getStudent(id) {
  return readAll().find(student => student.id === id) || null;
}

export function saveStudent(student) {
  const students = readAll();
  const index = students.findIndex(s => s.id === student.id);
  if (index === -1) students.push(student);
  else students[index] = student;
  writeAll(students);
  return student;
}

export function deleteStudent(id) {
  const students = readAll().filter(s => s.id !== id);
  writeAll(students);
  return students;
}

export function makeStudentId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `student-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
