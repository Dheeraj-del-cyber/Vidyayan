import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Play, Check, HelpCircle, Calendar, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import './daily-tasks.css';

// Initial sample task dataset keyed by dates
const initialDatesData = [
  {
    dateId: 'day-1',
    dayName: 'Today',
    formattedDate: 'Sep 27, 2026',
    tasks: [
      {
        id: 'task-101',
        subject: 'Mathematics',
        subjectTone: 'coral',
        title: 'Decimals & Place Values',
        duration: '25 min',
        description: 'Understand tenths, hundredths, and decimal representation on a number line.',
        video: {
          id: 'video-101',
          title: 'Decimal Place Value & Concept',
          youtubeId: 'KG6ILNOiMgM', // Clean math lesson
          duration: '8 mins',
          summary: 'Watch this short video tutorial to understand how decimals represent parts of a whole.'
        },
        quiz: {
          id: 'quiz-101',
          title: 'Quick Check: Place Values',
          question: 'In the number 14.385, what is the digit in the hundredths place?',
          options: ['4', '3', '8', '5'],
          correctIndex: 2,
          explanation: '8 is in the second position after the decimal point, which is the hundredths place.'
        }
      },
      {
        id: 'task-102',
        subject: 'Science',
        subjectTone: 'teal',
        title: 'States of Matter: Solids, Liquids & Gases',
        duration: '30 min',
        description: 'Learn the molecular structure and properties of the three primary states of matter.',
        video: {
          id: 'video-102',
          title: 'States of Matter Explained',
          youtubeId: 'wclY8F-UoTE',
          duration: '10 mins',
          summary: 'An engaging animation showing how molecules behave in solids, liquids, and gases.'
        },
        quiz: {
          id: 'quiz-102',
          title: 'Quick Check: Matter Properties',
          question: 'Which state of matter takes the shape of its container but has a fixed volume?',
          options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
          correctIndex: 1,
          explanation: 'Liquids have a definite volume, but take the shape of whichever container they are placed in.'
        }
      }
    ]
  },
  {
    dateId: 'day-2',
    dayName: 'Tomorrow',
    formattedDate: 'Sep 28, 2026',
    tasks: [
      {
        id: 'task-201',
        subject: 'English',
        subjectTone: 'blue',
        title: 'Parts of Speech: Action Verbs',
        duration: '20 min',
        description: 'Identify main action verbs and linking verbs in everyday sentences.',
        video: {
          id: 'video-201',
          title: 'Mastering Verbs & Sentence Structures',
          youtubeId: 'v96NTI4nC1U',
          duration: '7 mins',
          summary: 'Learn how action verbs bring energy and meaning to English sentences.'
        },
        quiz: {
          id: 'quiz-201',
          title: 'Quick Check: Verb Identification',
          question: 'Select the verb in this sentence: "The bright bird sang sweetly in the tree."',
          options: ['bright', 'bird', 'sang', 'sweetly'],
          correctIndex: 2,
          explanation: '"sang" is the action word (verb) showing what the bird did.'
        }
      },
      {
        id: 'task-202',
        subject: 'Mathematics',
        subjectTone: 'coral',
        title: 'Addition & Subtraction of Decimals',
        duration: '25 min',
        description: 'Align decimal points correctly to perform column addition and subtraction.',
        video: {
          id: 'video-202',
          title: 'Adding Decimals Step-by-Step',
          youtubeId: 'kwh4KNlDR8o',
          duration: '9 mins',
          summary: 'Learn the golden rule: line up the decimal dots before adding or subtracting!'
        },
        quiz: {
          id: 'quiz-202',
          title: 'Quick Check: Decimal Math',
          question: 'What is the sum of 4.35 + 2.80?',
          options: ['6.15', '7.15', '6.95', '7.05'],
          correctIndex: 1,
          explanation: '4.35 + 2.80 = 7.15 (35 hundredths + 80 hundredths = 115 hundredths = 1.15).'
        }
      }
    ]
  },
  {
    dateId: 'day-3',
    dayName: 'Tuesday',
    formattedDate: 'Sep 29, 2026',
    tasks: [
      {
        id: 'task-301',
        subject: 'Social Science',
        subjectTone: 'yellow',
        title: 'Reading Maps & Geography Symbols',
        duration: '25 min',
        description: 'Understand map legends, cardinal directions (N, S, E, W), and scales.',
        video: {
          id: 'video-301',
          title: 'How to Read Maps & Symbols',
          youtubeId: 'dsnN0n1uRvw',
          duration: '8 mins',
          summary: 'Discover how symbols and colors make complex geographical features easy to read.'
        },
        quiz: {
          id: 'quiz-301',
          title: 'Quick Check: Map Symbols',
          question: 'What feature is typically represented by blue squiggly lines on a standard map?',
          options: ['Highways', 'Rivers & Water Bodies', 'State Borders', 'Forests'],
          correctIndex: 1,
          explanation: 'Blue color on geographical maps traditionally denotes water bodies such as rivers and lakes.'
        }
      },
      {
        id: 'task-302',
        subject: 'Science',
        subjectTone: 'teal',
        title: 'The Water Cycle: Evaporation & Condensation',
        duration: '30 min',
        description: 'Explore how water shifts between liquid and vapor across the water cycle.',
        video: {
          id: 'video-302',
          title: 'The Water Cycle Animation',
          youtubeId: 'ncORPosDrjE',
          duration: '9 mins',
          summary: 'Follow a drop of water through evaporation, condensation, precipitation, and collection.'
        },
        quiz: {
          id: 'quiz-302',
          title: 'Quick Check: Water Cycle',
          question: 'What is the change of water vapor into liquid water droplets called?',
          options: ['Evaporation', 'Condensation', 'Transpiration', 'Sublimation'],
          correctIndex: 1,
          explanation: 'Condensation happens when warm water vapor cools down and forms liquid droplets.'
        }
      }
    ]
  }
];

export default function DailyTasks() {
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [expandedTaskId, setExpandedTaskId] = useState('task-101');
  
  // Track completed subtasks: { "task-101-video": true, "task-101-quiz": true }
  const [completedSubtasks, setCompletedSubtasks] = useState({});
  // Track selected quiz answer: { "task-101": optionIndex }
  const [quizSelectedOption, setQuizSelectedOption] = useState({});
  // Track quiz submission feedback state: { "task-101": { submitted: true, isCorrect: true } }
  const [quizFeedback, setQuizFeedback] = useState({});

  const currentDay = initialDatesData[activeDateIndex];

  // Helper to check if a specific subtask is done
  const isSubtaskDone = (taskId, subtaskType) => {
    return Boolean(completedSubtasks[`${taskId}-${subtaskType}`]);
  };

  // Toggle video completed state
  const handleToggleVideo = (taskId) => {
    const key = `${taskId}-video`;
    setCompletedSubtasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Select quiz option
  const handleSelectQuizOption = (taskId, optionIdx) => {
    setQuizSelectedOption(prev => ({
      ...prev,
      [taskId]: optionIdx
    }));
  };

  // Submit quiz answer
  const handleSubmitQuiz = (taskId, correctIndex) => {
    const selected = quizSelectedOption[taskId];
    if (selected === undefined) return;

    const isCorrect = selected === correctIndex;
    setQuizFeedback(prev => ({
      ...prev,
      [taskId]: { submitted: true, isCorrect }
    }));

    if (isCorrect) {
      setCompletedSubtasks(prev => ({
        ...prev,
        [`${taskId}-quiz`]: true
      }));
    }
  };

  // Check if entire task (video + quiz) is completed
  const isTaskCompleted = (taskId) => {
    return isSubtaskDone(taskId, 'video') && isSubtaskDone(taskId, 'quiz');
  };

  // Calculate day completion statistics
  const dayTaskCount = currentDay.tasks.length;
  const completedTaskCount = currentDay.tasks.filter(t => isTaskCompleted(t.id)).length;
  const dayProgressPercent = Math.round((completedTaskCount / dayTaskCount) * 100);

  return (
    <section className="daily-tasks-section" aria-label="Daily Tasks and Study Plan">
      <div className="daily-tasks-header">
        <div className="daily-tasks-title-group">
          <span className="eyebrow"><Calendar size={13} /> Schedule &amp; Daily Tasks</span>
          <h2>Interactive Daily Study Tasks</h2>
          <p>Complete your video lessons and quizzes to earn daily learning tick bars!</p>
        </div>

        {/* Date Tabs */}
        <div className="date-tabs-container">
          {initialDatesData.map((dayItem, idx) => {
            const dayCompletedCount = dayItem.tasks.filter(t => isTaskCompleted(t.id)).length;
            const isAllDone = dayCompletedCount === dayItem.tasks.length;
            const isActive = idx === activeDateIndex;

            return (
              <button
                key={dayItem.dateId}
                type="button"
                className={`date-tab-button ${isActive ? 'active' : ''} ${isAllDone ? 'all-done' : ''}`}
                onClick={() => {
                  setActiveDateIndex(idx);
                  if (dayItem.tasks.length > 0) {
                    setExpandedTaskId(dayItem.tasks[0].id);
                  }
                }}
              >
                <span className="date-tab-day">{dayItem.dayName}</span>
                <span className="date-tab-date">{dayItem.formattedDate}</span>
                <span className={`date-tab-badge ${isAllDone ? 'badge-completed' : ''}`}>
                  {isAllDone ? <Check size={12} /> : `${dayCompletedCount}/${dayItem.tasks.length}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Completion Tick / Progress Bar */}
      <div className="day-progress-bar-card">
        <div className="day-progress-info">
          <div className="day-progress-label">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Progress for <strong>{currentDay.dayName} ({currentDay.formattedDate})</strong></span>
          </div>
          <div className="day-progress-status">
            {completedTaskCount === dayTaskCount ? (
              <span className="completion-tick-pill">
                <CheckCircle2 size={16} /> Day Completed!
              </span>
            ) : (
              <span className="progress-count-text">{completedTaskCount} of {dayTaskCount} tasks completed</span>
            )}
          </div>
        </div>
        <div className="tick-progress-track">
          <div
            className={`tick-progress-fill ${completedTaskCount === dayTaskCount ? 'complete' : ''}`}
            style={{ width: `${dayProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Task List (Expandable Cards) */}
      <div className="tasks-list">
        {currentDay.tasks.map((task, index) => {
          const isExpanded = expandedTaskId === task.id;
          const taskDone = isTaskCompleted(task.id);
          const videoDone = isSubtaskDone(task.id, 'video');
          const quizDone = isSubtaskDone(task.id, 'quiz');
          const subtaskDoneCount = (videoDone ? 1 : 0) + (quizDone ? 1 : 0);

          return (
            <div
              key={task.id}
              className={`task-card ${isExpanded ? 'expanded' : ''} ${taskDone ? 'task-completed-card' : ''}`}
            >
              {/* Task Header Bar */}
              <div
                className="task-card-header"
                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedTaskId(isExpanded ? null : task.id);
                  }
                }}
              >
                <div className="task-header-left">
                  <span className={`task-subject-tag tone-${task.subjectTone}`}>
                    {task.subject}
                  </span>
                  <div className="task-title-group">
                    <h3 className="task-title">
                      Task {index + 1}: {task.title}
                    </h3>
                    <span className="task-duration"><Clock size={13} /> {task.duration}</span>
                  </div>
                </div>

                <div className="task-header-right">
                  {/* Task Completion Tick Bar Badge */}
                  {taskDone ? (
                    <div className="task-completed-bar-badge">
                      <CheckCircle2 size={18} />
                      <span>Task Completed</span>
                    </div>
                  ) : (
                    <div className="task-subtasks-indicator">
                      <span>{subtaskDoneCount}/2 subtasks</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="task-expand-btn"
                    aria-label={isExpanded ? 'Collapse task' : 'Expand task'}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Expandable Content Area */}
              {isExpanded && (
                <div className="task-card-body">
                  <p className="task-description">{task.description}</p>

                  <div className="subtasks-container">
                    {/* Subtask 1: YouTube Video Lesson */}
                    <div className={`subtask-box ${videoDone ? 'subtask-done' : ''}`}>
                      <div className="subtask-header">
                        <div className="subtask-title">
                          <span className="subtask-badge video-badge">
                            <Play size={14} /> Video Lesson
                          </span>
                          <h4>{task.video.title}</h4>
                        </div>
                        <span className="subtask-meta"><Clock size={12} /> {task.video.duration}</span>
                      </div>

                      <p className="subtask-summary">{task.video.summary}</p>

                      {/* YouTube Video Player Embed */}
                      <div className="youtube-embed-wrapper">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${task.video.youtubeId}`}
                          title={task.video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="youtube-iframe"
                        />
                      </div>

                      <div className="subtask-actions">
                        <button
                          type="button"
                          className={`subtask-complete-btn ${videoDone ? 'done' : ''}`}
                          onClick={() => handleToggleVideo(task.id)}
                        >
                          <CheckCircle2 size={16} />
                          {videoDone ? 'Video Watched ✓' : 'Mark Video as Watched'}
                        </button>
                      </div>
                    </div>

                    {/* Subtask 2: Interactive Quiz */}
                    <div className={`subtask-box ${quizDone ? 'subtask-done' : ''}`}>
                      <div className="subtask-header">
                        <div className="subtask-title">
                          <span className="subtask-badge quiz-badge">
                            <HelpCircle size={14} /> Knowledge Quiz
                          </span>
                          <h4>{task.quiz.title}</h4>
                        </div>
                        {quizDone && (
                          <span className="quiz-done-pill">
                            <Check size={13} /> Quiz Passed
                          </span>
                        )}
                      </div>

                      <div className="quiz-content">
                        <p className="quiz-question">{task.quiz.question}</p>

                        <div className="quiz-options-list">
                          {task.quiz.options.map((opt, optIdx) => {
                            const isSelected = quizSelectedOption[task.id] === optIdx;
                            const feedback = quizFeedback[task.id];
                            let optionClass = '';

                            if (isSelected) optionClass = 'selected';
                            if (feedback?.submitted) {
                              if (optIdx === task.quiz.correctIndex) {
                                optionClass = 'correct-ans';
                              } else if (isSelected && !feedback.isCorrect) {
                                optionClass = 'wrong-ans';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                className={`quiz-option-item ${optionClass}`}
                                onClick={() => handleSelectQuizOption(task.id, optIdx)}
                              >
                                <span className="option-bullet">{String.fromCharCode(65 + optIdx)}</span>
                                <span className="option-text">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Quiz Feedback message */}
                        {quizFeedback[task.id]?.submitted && (
                          <div className={`quiz-feedback-box ${quizFeedback[task.id].isCorrect ? 'correct' : 'incorrect'}`}>
                            <strong>
                              {quizFeedback[task.id].isCorrect ? '🎉 Correct Answer!' : '❌ Not quite, try again!'}
                            </strong>
                            <p>{task.quiz.explanation}</p>
                          </div>
                        )}

                        <div className="subtask-actions">
                          <button
                            type="button"
                            className={`subtask-complete-btn primary ${quizDone ? 'done' : ''}`}
                            onClick={() => handleSubmitQuiz(task.id, task.quiz.correctIndex)}
                            disabled={quizSelectedOption[task.id] === undefined}
                          >
                            <Award size={16} />
                            {quizDone ? 'Quiz Completed ✓' : 'Submit & Complete Quiz'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task Complete Notification Banner */}
                  {taskDone && (
                    <div className="task-congrats-banner">
                      <CheckCircle2 size={22} />
                      <div>
                        <strong>Task Completed Successfully!</strong>
                        <p>You watched the video lesson and answered the quiz correctly.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
