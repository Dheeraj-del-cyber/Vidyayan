Frontend Development Guide

Portable Learning Continuity Agent for Migrant Construction Workers' Children

1. Project Overview

Build a clean, simple and child-friendly frontend for a Portable Learning Continuity Agent.

The system is designed for children of seasonal migrant construction workers who move between Indian states during the academic year.

The frontend should allow a coordinator to:

1. Create/view a child's learning profile.
2. Select the child's home state and destination state.
3. Select the board, class and subjects.
4. Enter the last completed chapter.
5. View the identified syllabus gaps.
6. View personalized bridging content.
7. Access translated learning content.
8. Listen to audio content.
9. Download learning material as PDF.
10. View the child's persistent learning progress.

«Important: Backend development is NOT required at this stage.»

Use mock/static data wherever data is required.

---

2. Frontend Technology

Use:

- React
- Vite
- JavaScript or TypeScript
- HTML
- CSS
- React Router
- Lucide React / another lightweight icon library

Do not build:

- Backend
- Database
- API
- Authentication system
- AI model
- Real-time services

The frontend should be designed so that these can be connected later without redesigning the UI.

---

3. Design Direction

The interface should feel:

- Professional
- Simple
- Trustworthy
- Educational
- Child-friendly
- Easy for coordinators with limited technical experience
- Mobile responsive

Avoid:

- Excessive gradients
- Glassmorphism
- Overly colourful AI-style interfaces
- Excessive animations
- Complicated dashboards
- Too much text on one screen

Use clear cards, proper spacing, readable typography and simple icons.

---

4. User Types

The first version should mainly support:

Coordinator

The coordinator manages the child's learning information.

They should be able to:

- Add a child
- View children
- Enter migration information
- View syllabus gaps
- Open bridging content
- Track progress

Child

The child mainly consumes the learning content.

They should be able to:

- Read lessons
- Listen to audio
- Answer simple questions
- View progress
- Continue unfinished learning

---

5. Main Navigation

Create a sidebar on desktop and bottom/mobile navigation on small screens.

Navigation:

Dashboard
Children
Curriculum Gap
Learning
Progress
Migration History
Settings

The logo/project name should appear at the top.

---

6. Dashboard

Create a simple dashboard.

Header

Show:

Good Morning
Learning Continuity Dashboard

Include:

- Search
- Notification icon
- Coordinator profile

Summary Cards

Display:

Total Children
Active Learning
Pending Gap Analysis
Completed Bridges

Recent Children

Show a table/card list:

Child Name
Age
Class
Home State
Current State
Progress
Status

Example:

Rahul
10 years
Class 5
Karnataka → Maharashtra
68%
Learning

Recent Activity

Examples:

Gap analysis completed
Bridging package generated
Math Chapter 4 completed
Child migrated to Maharashtra

Use static data for now.

---

7. Add Child Page

Create a form for adding a child.

Child Information

Fields:

Child Name
Age
Class
Preferred Language
Gender (optional)

Home Academic Information

Fields:

Home State
Board
Academic Session
Last Attended School

Learning Information

Fields:

Last Completed Subject
Last Completed Chapter
Last School Attendance Date

Current Migration Information

Fields:

Destination State
Destination District
Migration Date

Button:

Create Learning Profile

For now, clicking the button can show a success message and use mock data.

---

8. Child Profile Page

When a coordinator selects a child, show:

Profile Header

Rahul
Class 5
Age: 10
Preferred Language: Kannada

Show:

Home State → Karnataka
Current State → Maharashtra

Learning Summary

Cards:

Subjects
Completed Chapters
Learning Progress
Identified Gaps

Current Learning

Show:

Mathematics
Chapter 4: Fractions
Progress: 70%

[Continue Learning]

Migration Timeline

Example:

Karnataka
     ↓
Maharashtra
     ↓
Current Location

---

9. Curriculum Gap Page

This is one of the most important pages.

Show:

Home Curriculum
Karnataka

Destination Curriculum
Maharashtra

Class
5

Button:

Analyze Curriculum Gap

Since there is no backend yet, clicking this can load predefined mock results.

---

10. Gap Report

Display the comparison clearly.

Example:

MATHEMATICS

Home Curriculum
✓ Numbers
✓ Addition
✓ Subtraction
✓ Multiplication
✓ Fractions

Destination Curriculum
✓ Numbers
✓ Addition
✓ Subtraction
✓ Multiplication
⚠ Fractions
⚠ Decimals
⚠ Basic Geometry

Then show:

Identified Learning Gaps

Subject| Topic| Status
Mathematics| Decimals| Missing
Mathematics| Basic Geometry| Missing
Science| States of Matter| Partial
English| Grammar Basics| Missing

Use visual indicators:

✓ Completed
◐ Partially Learned
⚠ Gap

---

11. Subject-wise Gap View

When the user clicks a subject, show:

Mathematics

Then display a chapter timeline:

Chapter 1
✓ Completed

Chapter 2
✓ Completed

Chapter 3
✓ Completed

Chapter 4
⚠ Learning Gap

Chapter 5
⚠ Learning Gap

Each gap should have:

View Gap

---

12. Gap Details

Example:

Mathematics
Decimals

Why this gap was identified

The destination curriculum introduces
Decimals before the child has completed
the equivalent concept in the home curriculum.

Prerequisite concepts:
• Place value
• Fractions
• Number comparison

Then:

Bridge Required
Yes

Button:

Start Bridge

---

13. Bridging Learning Page

This page is where the child learns the missing concept.

Example:

MATHEMATICS

Decimals

Bridge Lesson 01

Understanding Decimal Numbers

Show:

Learning Objective

By the end of this lesson,
you will understand what decimal
numbers represent.

Explanation

Use simple language.

Example

1/10 = 0.1
5/10 = 0.5

Visual Explanation

Use simple diagrams/cards.

Practice

Show simple questions:

What is 3/10 as a decimal?

○ 0.03
○ 0.3
○ 3.0
○ 30

Button:

Check Answer

---

14. Learning Content Types

The frontend should support three content formats.

Text

Display:

Lesson
Explanation
Examples
Practice Questions

Audio

Provide an audio player:

▶ Play

━━━━━━○━━━━
0:42 / 1:30

Use mock/local audio for now if needed.

PDF

Show:

Bridging Material

[Preview PDF]

[Download PDF]

For now, the button can point to a sample PDF stored in the frontend/public folder.

---

15. Language Selection

The interface should allow the coordinator/child to select:

English
Kannada
Hindi
Marathi
Tamil
Telugu

The selected language should appear clearly.

Example:

Learning Language

[ Kannada ▼ ]

For the prototype, use static translated content.

Do not implement automatic translation yet.

---

16. Child Learning Mode

Create a simplified interface for the child.

Avoid showing complicated dashboard information.

Show:

Hi Rahul 👋

Continue Learning

Mathematics
Decimals
70% Complete

[Continue]

Today's Goal

Complete 1 bridge lesson

Also show:

🔊 Listen
📖 Read
✏ Practice

---

17. Progress Page

Show overall learning progress.

Example:

Overall Progress
68%

Subject cards:

Mathematics      72%
Science          61%
English          80%
Social Science   54%

Show completed and remaining chapters.

Example:

8 / 12 Chapters Completed

---

18. Migration History

This is important because the child's learning record should continue during future migrations.

Create a timeline:

June 2026
Karnataka
Class 5
12 chapters completed

November 2026
Maharashtra
Curriculum gap identified

December 2026
Bridge lessons completed

January 2027
New migration
Learning record carried forward

Each migration should be displayed as a timeline card.

---

19. Learning Record

Create a page showing the child's persistent record.

Example:

Child Learning Record

Child:
Rahul

Current Class:
5

Home State:
Karnataka

Current State:
Maharashtra

Completed Chapters:
18

Bridged Chapters:
4

Pending Gaps:
2

Include:

Last Updated
Current Learning Level
Completed Bridge Lessons
Pending Learning Gaps
Migration History

---

20. Search and Filters

The coordinator should be able to search children.

Search:

Search child...

Filters:

State
Class
Subject
Learning Status

Example statuses:

Learning
Gap Identified
Bridge in Progress
Completed

---

21. Notifications

Create a simple notification dropdown.

Examples:

New curriculum gap identified
Rahul completed Mathematics Bridge
Learning package ready
Migration record updated

Use mock notifications.

---

22. Responsive Design

The website MUST work on:

Desktop

Sidebar + Main Content

Tablet

Collapsed Sidebar + Main Content

Mobile

Top Header
Main Content
Bottom Navigation

Cards should stack vertically on mobile.

Tables should become cards on mobile.

---

23. Suggested Folder Structure

Use:

src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── BottomNav.jsx
│   ├── StatCard.jsx
│   ├── ChildCard.jsx
│   ├── ProgressCard.jsx
│   ├── GapCard.jsx
│   ├── ChapterCard.jsx
│   ├── AudioPlayer.jsx
│   └── Timeline.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Children.jsx
│   ├── AddChild.jsx
│   ├── ChildProfile.jsx
│   ├── CurriculumGap.jsx
│   ├── GapDetails.jsx
│   ├── Learning.jsx
│   ├── Lesson.jsx
│   ├── Progress.jsx
│   ├── MigrationHistory.jsx
│   └── Settings.jsx
│
├── data/
│   ├── children.js
│   ├── curriculum.js
│   ├── gaps.js
│   └── lessons.js
│
├── assets/
│
├── App.jsx
├── main.jsx
└── index.css

---

24. Mock Data

Create mock data files so the frontend works independently.

Example:

const child = {
  name: "Rahul",
  age: 10,
  class: 5,
  homeState: "Karnataka",
  destinationState: "Maharashtra",
  language: "Kannada",
  progress: 68
};

Example gap:

const gap = {
  subject: "Mathematics",
  chapter: "Decimals",
  status: "Missing",
  priority: "High"
};

Example lesson:

const lesson = {
  title: "Understanding Decimal Numbers",
  subject: "Mathematics",
  language: "Kannada",
  progress: 70
};

---

25. Important: No Backend

The frontend developer should NOT wait for backend APIs.

Everything should work using:

Mock Data
↓
React State
↓
Local Components

Later, the backend team can replace the mock data with API calls.

For example:

Now

import { children } from "./data/children";

Later

fetch("/api/children")

The UI should not need to be redesigned.

---

26. Required Pages for Prototype

The minimum working prototype should contain:

1. Dashboard
2. Children List
3. Add Child
4. Child Profile
5. Curriculum Gap
6. Gap Report
7. Gap Details
8. Bridging Lesson
9. Audio Learning
10. PDF Learning Material
11. Progress
12. Migration History

---

27. Main Demo Flow

The frontend demo should support this complete flow:

Dashboard
     ↓
Select Child
     ↓
Child Profile
     ↓
View Migration
     ↓
Curriculum Gap
     ↓
Analyze Gap
     ↓
Subject-wise Gap Report
     ↓
Select Missing Chapter
     ↓
Bridge Lesson
     ↓
Read / Listen / Practice
     ↓
View Progress
     ↓
Learning Record Updated

Everything can use mock data at this stage.

---

28. Final Frontend Goal

By the end of frontend development, a person should be able to open the website and understand the complete concept without needing the backend.

The prototype should visually communicate:

A child's education does not restart when the family migrates.

The system identifies what the child already knows, what the destination curriculum expects, shows the exact learning gap, provides a personalized bridge, and preserves the learning record for the child's next migration.

---

29. Frontend Developer Checklist

UI

- [ ] Clean responsive design
- [ ] Dashboard
- [ ] Sidebar
- [ ] Mobile navigation
- [ ] Child cards
- [ ] Progress cards
- [ ] Gap cards
- [ ] Chapter timeline

Child Management

- [ ] Add child
- [ ] Child list
- [ ] Child profile
- [ ] Search
- [ ] Filters

Curriculum

- [ ] Home state selection
- [ ] Destination state selection
- [ ] Subject view
- [ ] Chapter view
- [ ] Gap report
- [ ] Gap details

Learning

- [ ] Bridge lesson
- [ ] Text content
- [ ] Practice questions
- [ ] Audio player
- [ ] PDF preview/download
- [ ] Language selection

Continuity

- [ ] Progress tracking
- [ ] Learning record
- [ ] Migration timeline
- [ ] Previous learning history

Technical

- [ ] React + Vite
- [ ] React Router
- [ ] Mock data
- [ ] Responsive design
- [ ] No backend dependency
- [ ] No API dependency
- [ ] Components reusable
- [ ] Easy to connect to backend later