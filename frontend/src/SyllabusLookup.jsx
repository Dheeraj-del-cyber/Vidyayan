import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, BookOpen, Check, CircleHelp, ExternalLink, FileText, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { API_URL, apiCompareSyllabi, apiExtractSyllabusText, apiSyllabi } from './api';
import './syllabus.css';

const grades = Array.from({ length: 10 }, (_, index) => index + 1);

function DocumentList({ documents, state, loading, extractingId, onExtract }) {
  if (loading) return <p className="syllabus-empty">Loading available PDFs...</p>;
  if (!documents.length) return <p className="syllabus-empty">No matching PDFs found for {state}.</p>;

  return <ul className="syllabus-document-list">
    {documents.map(document => <li className="syllabus-document" key={document.id}>
      <FileText size={19} aria-hidden="true" />
      <div className="syllabus-document-copy">
        <strong>{document.title}</strong>
        <span>{[document.strand, document.part && `Part ${document.part}`, document.academicYear, document.language !== 'Not specified' && document.language].filter(Boolean).join(' · ')}</span>
      </div>
      <div className="syllabus-document-actions">
        <button type="button" className="syllabus-extract-button" onClick={() => onExtract(document)} disabled={extractingId === document.id}>
          {extractingId === document.id ? <LoaderCircle className="spin" size={15} /> : <Search size={15} />}
          Extract text
        </button>
      </div>
      <a href={`${API_URL}${document.url}`} target="_blank" rel="noreferrer" aria-label={`Open ${document.fileName} in a new tab`}>
        <ExternalLink size={17} />
      </a>
    </li>)}
  </ul>;
}

export default function SyllabusLookup() {
  const [catalog, setCatalog] = useState({ states: [], documents: [] });
  const [homeState, setHomeState] = useState('Bihar');
  const [destinationState, setDestinationState] = useState('Karnataka');
  const [grade, setGrade] = useState(8);
  const [subject, setSubject] = useState('Mathematics');
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState(null);
  const [comparisonError, setComparisonError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractingId, setExtractingId] = useState('');
  const [extraction, setExtraction] = useState(null);
  const [extractionError, setExtractionError] = useState('');

  useEffect(() => {
    let active = true;
    apiSyllabi().then(data => {
      if (active) setCatalog(data);
    }).catch(fetchError => {
      if (active) setError(fetchError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const availableSubjects = [...new Set(catalog.documents
    .filter(document => document.grade === grade && [homeState, destinationState].includes(document.state))
    .map(document => document.subject))].sort();

  useEffect(() => {
    if (availableSubjects.length && !availableSubjects.includes(subject)) setSubject(availableSubjects[0]);
  }, [availableSubjects.join('|'), subject]);

  const getDocumentsFor = state => catalog.documents.filter(document =>
    document.state === state && document.grade === grade && document.subject === subject);

  const handleSearch = event => {
    event.preventDefault();
    setSearched(true);
    setComparison(null);
    setComparisonError('');
  };

  const handleAnalyze = async () => {
    setSearched(true);
    setComparison(null);
    setComparisonError('');
    setAnalyzing(true);
    try {
      const result = await apiCompareSyllabi({ homeState, destinationState, grade, subject });
      setComparison(result);
    } catch (compareError) {
      setComparisonError(compareError.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExtract = async document => {
    setExtractingId(document.id);
    setExtraction(null);
    setExtractionError('');
    try {
      setExtraction(await apiExtractSyllabusText(document.id));
    } catch (extractError) {
      setExtractionError(extractError.message);
    } finally {
      setExtractingId('');
    }
  };

  return <div className="syllabus-page">
    <div className="syllabus-heading">
      <div>
        <span className="eyebrow">Curriculum resources</span>
        <h1>Find a syllabus</h1>
        <p>Choose a class and subject to retrieve the books available for both states.</p>
      </div>
      <span className="syllabus-count"><BookOpen size={17} /> {catalog.documents.length} PDFs indexed</span>
    </div>

    <form className="syllabus-search" onSubmit={handleSearch}>
      <label><span>Home state</span><select value={homeState} onChange={event => setHomeState(event.target.value)} disabled={!catalog.states.length}>
        {catalog.states.map(state => <option key={state}>{state}</option>)}
      </select></label>
      <ArrowLeftRight className="syllabus-direction" size={19} aria-hidden="true" />
      <label><span>Destination state</span><select value={destinationState} onChange={event => setDestinationState(event.target.value)} disabled={!catalog.states.length}>
        {catalog.states.map(state => <option key={state}>{state}</option>)}
      </select></label>
      <label><span>Class</span><select value={grade} onChange={event => setGrade(Number(event.target.value))}>
        {grades.map(value => <option value={value} key={value}>Class {value}</option>)}
      </select></label>
      <label><span>Subject</span><select value={subject} onChange={event => setSubject(event.target.value)} disabled={!availableSubjects.length}>
        {availableSubjects.length ? availableSubjects.map(value => <option key={value}>{value}</option>) : <option value="">No subjects found</option>}
      </select></label>
      <button className="primary-button" type="submit" disabled={loading || !availableSubjects.length}>
        {loading ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />} Find PDFs
      </button>
    </form>

    {error && <div className="syllabus-error" role="alert">{error}</div>}
    <div className="syllabus-note">Python extracts selectable PDF text and flags scanned books that need OCR. Class 8 Mathematics also has a provisional chapter-title comparison.</div>

    {(searched || loading) && <div className="syllabus-results" aria-live="polite">
      {[homeState, destinationState].map((state, index) => {
        const documents = getDocumentsFor(state);
        return <section className="syllabus-result" key={`${state}-${index}`}>
          <div className="syllabus-result-heading">
            <div><span className="section-kicker">{index === 0 ? 'Home curriculum' : 'Destination curriculum'}</span><h2>{state}</h2></div>
            <span className="syllabus-result-count">{documents.length} {documents.length === 1 ? 'PDF' : 'PDFs'}</span>
          </div>
          <DocumentList documents={documents} state={state} loading={loading} extractingId={extractingId} onExtract={handleExtract} />
        </section>;
      })}
    </div>}

    {extractionError && <div className="syllabus-error" role="alert">{extractionError}</div>}
    {extraction && <section className="syllabus-extraction" aria-live="polite">
      <div className="syllabus-extraction-heading">
        <div><span className="section-kicker">Python PDF text extraction</span><h2>{extraction.document.title}</h2></div>
        <span className={`syllabus-extraction-status ${extraction.status}`}>
          {extraction.status === 'ocr_required' ? <AlertTriangle size={15} /> : <Check size={15} />}
          {extraction.status === 'ocr_required' ? 'OCR required' : 'Text extracted'}
        </span>
      </div>
      <p>{extraction.status === 'ocr_required'
        ? `No selectable text was found in the first ${extraction.checkedPageCount} pages. OCR is needed before these pages can be compared.`
        : `Found ${extraction.totalCharacters.toLocaleString()} characters across ${extraction.textPageCount} of ${extraction.checkedPageCount} inspected pages (${extraction.pageCount} pages total).`}</p>
      {extraction.status !== 'ocr_required' && <pre>{extraction.pages.filter(page => page.text).slice(0, 3).map(page => `Page ${page.page}\n${page.text}`).join('\n\n').slice(0, 5000)}</pre>}
    </section>}

    {searched && <div className="syllabus-analyze-action">
      <button className="primary-button" type="button" onClick={handleAnalyze} disabled={analyzing || loading || !getDocumentsFor(homeState).length || !getDocumentsFor(destinationState).length}>
        {analyzing ? <><LoaderCircle className="spin" size={17} /> Comparing topics...</> : <><Sparkles size={17} /> Analyze curriculum gap</>}
      </button>
    </div>}

    {comparisonError && <div className="syllabus-error" role="alert">{comparisonError}</div>}
    {comparison && <section className="syllabus-gap-report" aria-live="polite">
      <div className="syllabus-gap-heading">
        <div>
          <span className="eyebrow">Provisional · chapter-title comparison</span>
          <h2>Potential curriculum gaps</h2>
          <p>{comparison.homeBook.title} → {comparison.destinationBook.title}</p>
        </div>
        <span className="syllabus-gap-total"><AlertTriangle size={17} /> {comparison.potentialGaps.length} topics to review</span>
      </div>
      <div className="syllabus-alignment-list">
        {comparison.alignments.map(item => <div className="syllabus-alignment" key={item.source}>
          <span className={`syllabus-alignment-status ${item.status}`}>
            {item.status === 'matched' ? <Check size={14} /> : item.status === 'partial' ? <AlertTriangle size={14} /> : <CircleHelp size={14} />}
            {item.status === 'matched' ? 'Likely match' : item.status === 'partial' ? 'Partial match' : 'Review'}
          </span>
          <div className="syllabus-alignment-copy">
            <strong>{item.source}</strong>
            <span>{item.destination}</span>
            <small>{item.note}</small>
          </div>
        </div>)}
      </div>
      <div className="syllabus-potential-gaps">
        <h3>Not evident in Karnataka Part I</h3>
        <p>These Bihar topics were not matched to a chapter title in the selected Karnataka book.</p>
        <ul>{comparison.potentialGaps.map(topic => <li key={topic}><AlertTriangle size={15} />{topic}</li>)}</ul>
      </div>
      <div className="syllabus-review-note">{comparison.note} Karnataka Part II is not included in this comparison.</div>
    </section>}
  </div>;
}