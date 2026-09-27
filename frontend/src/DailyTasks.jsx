import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Play, Check, HelpCircle, Calendar, Sparkles, BookOpen, Clock, Award, Lock, ShieldAlert, PlayCircle, Eye } from 'lucide-react';
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
          youtubeId: 'KG6ILNOiMgM',
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

  // Strict video watch state: { [taskId]: { started: true, totalSec: 480, secondsLeft: 480, unlocked: false } }
  const [videoWatchState, setVideoWatchState] = useState({});
  // Warning notice if user tries to skip video: taskId
  const [strictWarningTaskId, setStrictWarningTaskId] = useState(null);

  const currentDay = initialDatesData[activeDateIndex];

  // Helper to parse duration string (e.g. "8 mins") into seconds
  const parseDurationInSeconds = (durationStr) => {
    if (!durationStr) return 480;
    const match = durationStr.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10) * 60;
    }
    return 480;
  };

  // Helper to format seconds into "Xm Ys" format
  const formatTimeLeft = (sec) => {
    if (sec <= 0) return '0s';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (mins > 0) {
      return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${secs}s`;
  };

  // Helper to check if a specific subtask is done
  const isSubtaskDone = (taskId, subtaskType) => {
    return Boolean(completedSubtasks[`${taskId}-${subtaskType}`]);
  };

  // Start watching video with strict timer countdown for the full video duration
  const handleStartVideo = (taskId, durationStr) => {
    if (videoWatchState[taskId]?.started) return;
    setStrictWarningTaskId(null);

    const totalSec = parseDurationInSeconds(durationStr);

    setVideoWatchState(prev => ({
      ...prev,
      [taskId]: { started: true, totalSec, secondsLeft: totalSec, unlocked: false }
    }));

    let currentSec = totalSec;
    const timer = setInterval(() => {
      currentSec -= 1;
      if (currentSec <= 0) {
        clearInterval(timer);
        setVideoWatchState(prev => ({
          ...prev,
          [taskId]: { started: true, totalSec, secondsLeft: 0, unlocked: true }
        }));
      } else {
        setVideoWatchState(prev => ({
          ...prev,
          [taskId]: { ...prev[taskId], secondsLeft: currentSec }
        }));
      }
    }, 1000);
  };

  // Fast forward video watch time for demo/testing purposes
  const handleFastForwardVideo = (taskId) => {
    setVideoWatchState(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], secondsLeft: 0, unlocked: true }
    }));
  };

  // Toggle video completed state (with strict check)
  const handleToggleVideo = (taskId) => {
    const isAlreadyDone = isSubtaskDone(taskId, 'video');
    const isUnlocked = videoWatchState[taskId]?.unlocked;

    if (!isAlreadyDone && !isUnlocked) {
      setStrictWarningTaskId(taskId);
      return;
    }

    setStrictWarningTaskId(null);
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
      {/* Sleek Compact Header Bar */}
      <div className="daily-tasks-header">
        <div className="daily-tasks-title-group">
          <h2><Calendar size={18} /> Daily Study Tasks</h2>
          <span className="day-progress-text">
            {completedTaskCount === dayTaskCount ? (
              <span className="completion-tick-pill"><CheckCircle2 size={13} /> Day Complete!</span>
            ) : (
              <span>{completedTaskCount}/{dayTaskCount} completed</span>
            )}
          </span>
        </div>

        {/* Compact Date Tabs */}
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
                <span className="date-tab-badge">
                  {isAllDone ? <Check size={11} /> : `${dayCompletedCount}/${dayItem.tasks.length}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleek Thin Progress Bar */}
      <div className="compact-progress-strip">
        <div
          className={`compact-progress-fill ${completedTaskCount === dayTaskCount ? 'complete' : ''}`}
          style={{ width: `${dayProgressPercent}%` }}
        />
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
                    {/* Subtask 1: YouTube Video Lesson (Strict Mode) */}
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

                      {/* Strict Mode Alert Banner */}
                      {strictWarningTaskId === task.id && !videoDone && (
                        <div className="strict-warning-banner">
                          <ShieldAlert size={18} />
                          <div>
                            <strong>Strict Verification Mode Active</strong>
                            <span>You must start and watch the video lesson before you can mark it complete!</span>
                          </div>
                        </div>
                      )}

                      {/* YouTube Video Player Embed with Strict Watch Trigger */}
                      <div className="youtube-embed-wrapper">
                        {/* If video watch hasn't started yet, show Start Watch Overlay */}
                        {!videoWatchState[task.id]?.started && !videoDone ? (
                          <div className="video-start-overlay" onClick={() => handleStartVideo(task.id, task.video.duration)}>
                            <PlayCircle size={56} className="play-overlay-icon" />
                            <strong>Click to Play &amp; Watch Full Lesson ({task.video.duration})</strong>
                            <span>Strict mode: Full video duration required to unlock completion</span>
                          </div>
                        ) : (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${task.video.youtubeId}?autoplay=1`}
                            title={task.video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="youtube-iframe"
                          />
                        )}
                      </div>

                      {/* Video Watch Live Status Bar with Full Countdown & Progress Track */}
                      {!videoDone && videoWatchState[task.id]?.started && (
                        <div className={`video-timer-status ${videoWatchState[task.id]?.unlocked ? 'unlocked' : 'watching'}`}>
                          {videoWatchState[task.id]?.unlocked ? (
                            <span className="timer-unlocked-text"><Check size={14} /> Full Video Verified! Button Unlocked</span>
                          ) : (
                            <div className="video-watch-progress-box">
                              <div className="video-watch-status-top">
                                <span className="timer-countdown-text">
                                  <Eye size={14} className="spin" /> Watching Video... ({formatTimeLeft(videoWatchState[task.id]?.secondsLeft)} remaining of {task.video.duration})
                                </span>
                                <button
                                  type="button"
                                  className="demo-fast-forward-btn"
                                  onClick={() => handleFastForwardVideo(task.id)}
                                  title="Fast-forward timer for quick demo testing"
                                >
                                  ⚡ Skip to End (Demo)
                                </button>
                              </div>
                              <div className="video-progress-mini-track">
                                <div
                                  className="video-progress-mini-fill"
                                  style={{
                                    width: `${Math.round(((videoWatchState[task.id]?.totalSec - videoWatchState[task.id]?.secondsLeft) / videoWatchState[task.id]?.totalSec) * 100)}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="subtask-actions">
                        {videoDone ? (
                          <button
                            type="button"
                            className="subtask-complete-btn done"
                            onClick={() => handleToggleVideo(task.id)}
                          >
                            <CheckCircle2 size={16} /> Video Watched ✓
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`subtask-complete-btn ${videoWatchState[task.id]?.unlocked ? 'unlocked-btn' : 'locked-btn'}`}
                            onClick={() => handleToggleVideo(task.id)}
                          >
                            {videoWatchState[task.id]?.unlocked ? (
                              <><CheckCircle2 size={16} /> Mark Video as Watched</>
                            ) : (
                              <><Lock size={15} /> Locked (Watch Video First)</>
                            )}
                          </button>
                        )}
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
