import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const DATA_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'data');

async function collectPdfFiles(directory, files = []) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return files;
    throw error;
  }

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectPdfFiles(absolutePath, files);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.pdf') {
      files.push(absolutePath);
    }
  }

  return files;
}

function getGrade(fileName, parentName) {
  const folderMatch = parentName.match(/^(10|[1-9])(?:st|nd|rd|th)\s+Std$/i);
  const nameMatch = fileName.match(/\b(10|[1-9])(?:st|nd|rd|th)?\b/i)
    || fileName.match(/^(?:M|EVS)\s*(10|[1-9])/i);
  return Number(folderMatch?.[1] || nameMatch?.[1]) || null;
}

function getSubject(fileName) {
  const name = fileName.toLowerCase();
  if (/math|^m\d/i.test(name)) return { subject: 'Mathematics', strand: null };
  if (/\bevs\b/i.test(name)) return { subject: 'Environmental Studies', strand: null };
  if (/political science|history|hist|geography|geogra|\bgeo\b|economics|\bsocial studies\b|\bsocial science\b|\bss\b/i.test(name)) {
    const strand = /political science/i.test(name) ? 'Political Science'
      : /history|hist/i.test(name) ? 'History'
        : /geography|geogra|\bgeo\b/i.test(name) ? 'Geography'
          : /economics/i.test(name) ? 'Economics' : null;
    return { subject: 'Social Studies', strand };
  }
  if (/science/i.test(name)) return { subject: 'Science', strand: null };
  return { subject: 'Other', strand: null };
}

async function getDocuments() {
  const files = await collectPdfFiles(DATA_ROOT);
  return files.flatMap(absolutePath => {
    const relativePath = path.relative(DATA_ROOT, absolutePath);
    const segments = relativePath.split(path.sep);
    const state = segments[0];
    const fileName = segments.at(-1);
    const parentName = segments.at(-2) || '';
    const grade = getGrade(fileName, parentName);
    if (!grade || !state) return [];

    const { subject, strand } = getSubject(fileName);
    const title = path.basename(fileName, path.extname(fileName));
    const partMatch = title.match(/\bpart\s*[- ]?\s*(\d+)\b/i);
    const yearMatch = title.match(/\b20\d{2}(?:\s*[-–]\s*(?:20)?\d{2})?\b/);
    const lowerTitle = title.toLowerCase();
    const language = lowerTitle.includes('bilingual') ? 'English and Kannada'
      : lowerTitle.includes('kannada') ? 'Kannada'
        : lowerTitle.includes('english') ? 'English' : 'Not specified';
    const id = Buffer.from(relativePath.split(path.sep).join('/')).toString('base64url');

    return [{
      id,
      state,
      grade,
      subject,
      strand,
      title,
      fileName,
      language,
      part: partMatch ? Number(partMatch[1]) : null,
      academicYear: yearMatch?.[0]?.replaceAll(' ', '') || null,
      url: `/api/syllabi/${id}`,
    }];
  }).sort((left, right) => left.state.localeCompare(right.state)
    || left.grade - right.grade
    || left.subject.localeCompare(right.subject)
    || left.title.localeCompare(right.title));
}

const class8MathsPilot = {
  alignments: [
    { source: 'Rational Numbers', destination: 'A Story of Numbers', status: 'review', note: 'Possible relationship; compare the chapter learning objectives to confirm.' },
    { source: 'Squares and Square Roots', destination: 'A Square and A Cube', status: 'partial', note: 'Square concepts appear in the title; scope and square-root coverage need review.' },
    { source: 'Cubes and Cube Roots', destination: 'A Square and A Cube', status: 'partial', note: 'Cube concepts appear in the title; scope and cube-root coverage need review.' },
    { source: 'Exponents and Powers', destination: 'Power Play', status: 'matched', note: 'Likely topic match based on chapter titles.' },
    { source: 'Understanding Quadrilaterals', destination: 'Quadrilaterals', status: 'matched', note: 'Likely topic match based on chapter titles.' },
    { source: 'Comparing Quantities', destination: 'Proportional Reasoning', status: 'partial', note: 'Some proportional reasoning may overlap; compare objectives to confirm.' },
    { source: 'Algebraic Expressions and Identities', destination: 'We Distribute, Yet Things Multiply', status: 'matched', note: 'Likely topic match based on chapter titles.' },
    { source: 'Direct and Inverse Proportions', destination: 'Proportional Reasoning', status: 'matched', note: 'Likely topic match based on chapter titles.' },
    { source: 'Playing with Numbers', destination: 'Number Play', status: 'matched', note: 'Likely topic match based on chapter titles.' },
  ],
  potentialGaps: [
    'Linear Equations in One Variable',
    'Practical Geometry',
    'Data Handling',
    'Visualising Solid Shapes',
    'Mensuration',
    'Factorisation',
    'Introduction to Graphs',
  ],
  destinationReview: ['A Story of Numbers'],
};

router.get('/syllabi/compare', async (req, res, next) => {
  try {
    const { homeState, destinationState, subject } = req.query;
    const grade = Number(req.query.grade);
    if (grade !== 8 || subject !== 'Mathematics'
      || homeState !== 'Bihar' || destinationState !== 'Karnataka') {
      return res.status(422).json({ error: 'The provisional comparison is currently available for Bihar to Karnataka Class 8 Mathematics only.' });
    }

    const documents = await getDocuments();
    const homeBook = documents.find(document => document.state === homeState && document.grade === grade && document.subject === subject);
    const destinationBook = documents.find(document => document.state === destinationState && document.grade === grade && document.subject === subject);
    if (!homeBook || !destinationBook) {
      return res.status(404).json({ error: 'A matching textbook PDF is missing for one of the selected states.' });
    }

    return res.json({
      status: 'provisional',
      grade,
      subject,
      homeBook,
      destinationBook,
      alignments: class8MathsPilot.alignments,
      potentialGaps: class8MathsPilot.potentialGaps,
      destinationReview: class8MathsPilot.destinationReview,
      note: 'Chapter-title comparison only. Potential gaps need confirmation against full learning objectives; this is not an AI-verified assessment.',
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/syllabi', async (req, res, next) => {
  try {
    const documents = await getDocuments();
    const states = [...new Set(documents.map(document => document.state))].sort();
    res.json({ states, documents });
  } catch (error) {
    next(error);
  }
});

router.get('/syllabi/:id', async (req, res, next) => {
  try {
    const document = (await getDocuments()).find(item => item.id === req.params.id);
    if (!document) return res.status(404).json({ error: 'Syllabus document not found.' });

    const absolutePath = path.resolve(DATA_ROOT, ...Buffer.from(document.id, 'base64url').toString().split('/'));
    if (!absolutePath.startsWith(`${DATA_ROOT}${path.sep}`)) {
      return res.status(400).json({ error: 'Invalid syllabus document path.' });
    }

    res.type('application/pdf');
    res.set('Content-Disposition', `inline; filename="${document.fileName.replaceAll('"', '')}"`);
    return res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
});

export default router;