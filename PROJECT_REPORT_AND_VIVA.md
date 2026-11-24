# CampusConnect – Project Report & Viva Voce Guide

**Project Name:** CampusConnect – Student Campus Management System  
**Document Purpose:** Academic Project Submission, System Documentation & Technical Viva Preparation  
**Target Roles:** Student & College Administrator  
**Architecture:** MERN (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS & Vite  

---

# PART 1: ACADEMIC PROJECT REPORT

## 1. Project Abstract
In modern collegiate environments, communication between academic departments, event organizers, and students remains fragmented across isolated notice boards, messaging groups, and physical sign-up sheets. This disorganization causes low student participation in co-curricular events, uncoordinated registration overbooking, missed exam deadlines, and difficulty in distributing academic course materials.

**CampusConnect** is a centralized, role-based campus management web application engineered using the MERN stack. The platform provides students with a unified portal to discover campus events, register with 1-click atomic capacity checks, read prioritized notices, and download semester-wise study materials. College administrators benefit from an analytics dashboard, attendee roster generation, event scheduling controls, and circular broadcast facilities.

---

## 2. Problem Statement & Objectives

### Problem Statement
* Physical circulars and messaging threads fail to convey urgent notifications (exam guidelines, placement schedules) reliably.
* Event registrations conducted via spreadsheets or paper forms suffer from double registrations and lack real-time capacity cutoffs.
* Academic course notes are scattered across private drives without centralized semester or department indexing.
* College administrators lack real-time visibility into student engagement and cross-departmental co-curricular participation.

### Project Objectives
1. **Develop a Secure Role-Based Authentication System**: Provide self-service registration for students and restricted access for college administrators using JWT and bcrypt.
2. **Implement Event Capacity & Concurrency Safeguards**: Guarantee that events cannot exceed seat capacity, prevent duplicate enrollments, and support clean self-service cancellations.
3. **Establish a Priority Notice Board**: Support categorized circulars with high/urgent priority visual indicators and top-pinned dashboard alerts.
4. **Build a Digital Academic Repository**: Enable faculty to upload syllabus documents, slides, and notes with semester (1–8) and department filtering for students.
5. **Deliver an Administrative Analytics Console**: Offer visual insights into event popularity, category distributions, and real-time student attendance rosters.

---

## 3. System Requirements Specification

### Software Requirements
* **Operating System**: macOS, Linux (Ubuntu/Debian), or Windows 10/11
* **Development Environment**: Visual Studio Code / Antigravity IDE
* **Runtime Engine**: Node.js v18.0.0 or higher
* **Database Engine**: MongoDB v6.0+ (Local Community Server or MongoDB Atlas Cloud)
* **Frontend Library**: React 18 with Vite 5
* **CSS Framework**: Tailwind CSS v3.4
* **API Testing Tool**: Postman / Thunder Client / Native Axios

### Hardware Requirements
* **Processor**: Dual-Core 2.0 GHz or higher (Intel Core i3/i5/i7 or Apple Silicon M1/M2/M3)
* **RAM**: 4 GB minimum (8 GB recommended for simultaneous backend and frontend dev servers)
* **Storage**: 500 MB free hard disk space for code, dependencies, and media storage

---

## 4. Database Design & Schema Entities

### 1. `User` Entity
* `_id`: ObjectId (Primary Key)
* `name`: String (Required, trimmed)
* `email`: String (Required, unique, lowercase, regex validated)
* `password`: String (Required, bcrypt hashed with 10 salt rounds, `select: false`)
* `role`: Enum `['student', 'admin']` (Default: `'student'`)
* `studentId`: String (Indexed, uppercase, optional for admins)
* `department`: String (e.g., Computer Science, Information Technology)
* `semester`: Number (1 to 8, validated)
* `phone`: String
* `avatar`: String (Relative file URL)
* `createdAt`, `updatedAt`: Timestamps

### 2. `Event` Entity
* `_id`: ObjectId (Primary Key)
* `title`: String (Required)
* `description`: String (Required)
* `category`: Enum `['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Academic', 'Other']`
* `venue`: String (Required)
* `eventDate`: Date (Indexed)
* `eventTime`: String (e.g., `'10:00 AM'`)
* `bannerImage`: String (Relative URL)
* `capacity`: Number (Required, min: 1)
* `registeredCount`: Number (Default: 0)
* `status`: Enum `['Upcoming', 'Ongoing', 'Completed', 'Cancelled']`
* `createdBy`: ObjectId (Ref: `User`)
* Virtual Fields: `isFull`, `spotsLeft`

### 3. `EventRegistration` Entity
* `_id`: ObjectId (Primary Key)
* `event`: ObjectId (Ref: `Event`, Required)
* `student`: ObjectId (Ref: `User`, Required)
* `registrationDate`: Date (Default: `Date.now`)
* `status`: Enum `['confirmed', 'cancelled', 'attended']`
* **Integrity Constraint**: Compound Unique Index `{ event: 1, student: 1 }`

### 4. `Announcement` Entity
* `_id`: ObjectId (Primary Key)
* `title`: String (Required)
* `content`: String (Required)
* `priority`: Enum `['urgent', 'high', 'medium', 'low']`
* `category`: Enum `['General', 'Academic', 'Exam', 'Event', 'Placement', 'Urgent']`
* `isPinned`: Boolean (Default: `false`)
* `author`: ObjectId (Ref: `User`)
* Index: `{ isPinned: -1, createdAt: -1 }`

### 5. `StudyMaterial` Entity
* `_id`: ObjectId (Primary Key)
* `title`: String (Required)
* `description`: String
* `subject`: String (Indexed)
* `department`: String (Indexed)
* `semester`: Number (1 to 8, Indexed)
* `fileUrl`: String (Relative file path)
* `originalFileName`: String
* `fileType`: String (MIME type)
* `fileSize`: Number (in bytes)
* `uploadedBy`: ObjectId (Ref: `User`)
* Index: `{ department: 1, semester: 1, subject: 1 }`

---

## 5. Module-by-Module Description

### Module 1: Authentication & RBAC
* **Student Registration**: Students register with academic credentials. Passwords are automatically hashed via Mongoose pre-save hooks.
* **Dual Login**: Unified login screen authenticating both roles and signing a 7-day JWT token with payload `{ id, role }`.
* **Route Protection**: Client-side `<ProtectedRoute>` and `<PublicRoute>` prevent unauthorized page navigation, while server-side `protect` and `authorize` middlewares guard endpoints.

### Module 2: Student Dashboard
* Personal greeting displaying current department and semester.
* 4 KPI summary cards (*My Registrations*, *Upcoming Events*, *Campus Notices*, *Study Resources*).
* Pinned circular alert cards with direct link to the notice board.
* Quick enrollment schedule displaying confirmed bookings and venue information.

### Module 3: Event Discovery & Registration
* Real-time search across title, venue, and description.
* Category filtering across 7 specialized tracks.
* Visual capacity indicators with spots remaining.
* Concurrency-safe registration updating registered counts atomically.
* Seat surrender modal allowing students to cancel their bookings cleanly.

### Module 4: Campus Notice Board
* Official circulars tagged by priority (`urgent`, `high`, `medium`, `low`).
* Category filters (`Exam`, `Placement`, `Academic`, `Event`, `General`).
* Expandable reading view for detailed circular messages.

### Module 5: Academic Study Repository
* Subject search and dual dropdown filtering by Department and Semester (1 to 8).
* Direct file downloading streamed securely through `/api/materials/:id/download`.
* Displays file sizes and upload timestamps.

### Module 6: Institutional Admin Console
* Executive metrics: Total Enrolled Students, Total Published Events, Total Registrations, Active Notices, Repository Documents.
* Proportional category distribution bar chart.
* Real-time student enrollment feed.
* Full event CRUD with image banner upload and attendee roster generation.
* Circular broadcast composer with pinned banner toggling.
* File upload manager with automatic disk storage cleanup upon deletion.
* Student directory management.

---

## 6. Test Cases & Verification Matrix

| Test ID | Module | Test Scenario | Input Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Auth | Student Registration with valid data | Name, Email, Password, Student ID, Dept, Sem | User created, bcrypt hash stored, JWT returned | 201 Created with JWT & profile | **PASS** |
| **TC-02** | Auth | Registration with short password | Password: `123` | Validation error: password >= 6 characters | 400 Bad Request with error message | **PASS** |
| **TC-03** | Auth | Duplicate email registration | Same email twice | MongoDB E11000 duplicate key caught | 400 Bad Request with friendly error | **PASS** |
| **TC-04** | Auth | Login with incorrect password | Valid email, wrong password | bcrypt.compare fails | 401 Unauthorized "Invalid credentials" | **PASS** |
| **TC-05** | Auth | Student attempts accessing Admin routes | Student Bearer token to `/api/admin/stats` | `authorize('admin')` blocks request | 403 Forbidden with role restriction message | **PASS** |
| **TC-06** | Events | Student registers for event with open seats | Valid event ID, student token | `registeredCount` increments by 1, registration created | 201 Created, UI updates to "Enrolled" | **PASS** |
| **TC-07** | Events | Student registers for same event twice | Same event ID repeated | Compound index `{ event: 1, student: 1 }` blocks | 400 Bad Request "Already registered" | **PASS** |
| **TC-08** | Events | Student registers for full event | Event with `registeredCount >= capacity` | Capacity check blocks registration | 400 Bad Request "Event full" | **PASS** |
| **TC-09** | Events | Student cancels registration | Confirmed registration ID | Registration removed, `registeredCount` decremented | 200 OK, event status restored to "Register" | **PASS** |
| **TC-10** | Admin | Create event with image poster | Multipart title, date, venue, banner.png | Multer saves to `/uploads/banners/`, event saved | 201 Created with relative banner URL | **PASS** |
| **TC-11** | Admin | Reduce capacity below current attendees | New capacity = 10 when 15 students registered | Validation rule catches violation | 400 Bad Request with explanation | **PASS** |
| **TC-12** | Admin | Upload invalid file type for study material | Uploading `.exe` or `.sh` file | Multer MIME filter rejects file | 400 Bad Request "Invalid file format" | **PASS** |
| **TC-13** | Notice | Pinned announcement ordering | Broadcast notice with `isPinned: true` | Notice appears first on student dashboard | Pinned notice displays in top banner | **PASS** |
| **TC-14** | Material | Direct file download | Click "Download" on DSA slides | Server streams file with Content-Disposition | Browser downloads original file | **PASS** |

---

# PART 2: COMPREHENSIVE VIVA VOCE QUESTIONS & ANSWERS

### Q1: What is the MERN stack, and why was it chosen for CampusConnect?
**Answer:**  
MERN stands for **MongoDB, Express.js, React.js, and Node.js**. It was chosen because:
1. **Single Language Across the Entire Stack**: Both client and server use JavaScript/ES6+, allowing code reuse (validation logic, formatters) and lower cognitive context switching.
2. **JSON Everywhere**: MongoDB stores documents in BSON/JSON, Express communicates via JSON REST APIs, and React natively parses JSON objects, eliminating object-relational mapping impedance mismatches.
3. **High Concurrency & Fast I/O**: Node.js's asynchronous non-blocking event-driven architecture handles high volumes of concurrent event registrations efficiently.
4. **Rich Component-Driven UI**: React's component hierarchy enables reusable interactive elements (cards, modal dialogs, status badges).

---

### Q2: How is user authentication implemented, and why is JWT preferred over session cookies?
**Answer:**  
Authentication is implemented using **JSON Web Tokens (JWT)** and **bcryptjs**:
1. When a user submits credentials, the backend validates the email, retrieves the user document including the bcrypt hash (`.select('+password')`), and compares passwords using `bcrypt.compare()`.
2. Upon match, `generateToken(user._id, user.role)` cryptographically signs a token with a private `JWT_SECRET` containing the user's ID and role, valid for 7 days.
3. **Why JWT over server sessions**: JWTs are **stateless**. The server does not maintain an in-memory session table or Redis session store. Each incoming HTTP request passes the token in the `Authorization: Bearer <token>` header, allowing horizontal scaling across multiple servers without sticky sessions.

---

### Q3: Why is `select: false` used on the password field in the Mongoose User schema?
**Answer:**  
By default in MongoDB/Mongoose, querying a document (`User.find()` or `User.findById()`) returns all schema fields. Setting `select: false` on `password` guarantees that queries (such as listing all students in the admin directory or fetching event attendees) will **never accidentally leak password hashes** in API responses. When the authentication controller specifically needs to verify credentials during login, it must explicitly request the field using `.select('+password')`.

---

### Q4: How does CampusConnect prevent duplicate event registrations?
**Answer:**  
Duplicate registrations are prevented at two independent layers:
1. **Database Layer (Absolute Guarantee)**: In `EventRegistration.js`, a **compound unique index** is defined:
   ```javascript
   eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });
   ```
   Even if two simultaneous requests bypass application logic, MongoDB's storage engine enforces uniqueness and rejects the second insert with an `E11000` duplicate key error.
2. **Application Layer**: In `eventController.js`, `EventRegistration.findOne({ event, student })` is checked prior to processing.

---

### Q5: How are race conditions handled when multiple students register for the last seat of an event?
**Answer:**  
Race conditions are mitigated by using **atomic database operations**:
1. The controller verifies that `event.registeredCount < event.capacity`.
2. Upon confirmation, the counter is incremented using MongoDB's atomic operator:
   ```javascript
   await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
   ```
   MongoDB guarantees that `$inc` executes as an isolated atomic operation at the document level, avoiding lost-update phenomena common with manual `event.registeredCount = event.registeredCount + 1; await event.save()`.

---

### Q6: What is Role-Based Access Control (RBAC), and how is it enforced?
**Answer:**  
RBAC restricts system features to authorized roles (`student` vs `admin`). It is enforced at two tiers:
1. **Backend Middleware (`roleMiddleware.js`)**:
   ```javascript
   const authorize = (...roles) => (req, res, next) => {
     if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
     next();
   };
   ```
   Applied to sensitive routes like `router.post('/', protect, authorize('admin'), createEvent)`.
2. **Frontend Route Guards (`ProtectedRoute.jsx`)**:
   Inspects `user.role` from `AuthContext`. If a student attempts to navigate to `/admin/*`, they are redirected to `/dashboard`.

---

### Q7: How does Multer work, and how are uploaded files secured?
**Answer:**  
Multer is a Node.js middleware for handling `multipart/form-data`. In CampusConnect:
1. **Disk Storage**: Files are saved to organized local subdirectories (`/uploads/banners`, `/uploads/avatars`, `/uploads/materials`).
2. **MIME-Type Filtering**: `fileFilter` functions inspect incoming extensions and MIME types. Executable scripts (`.exe`, `.sh`, `.php`, `.js`) are strictly rejected.
3. **File Size Caps**: `limits: { fileSize: 5 * 1024 * 1024 }` enforces a 5MB limit on images and 25MB on study documents.
4. **Collision Prevention**: Filenames are sanitized and prepended with a millisecond timestamp and random suffix:
   ```javascript
   filename: (req, file, cb) => cb(null, `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
   ```

---

### Q8: What are Axios Interceptors, and how are they used in this project?
**Answer:**  
Axios interceptors inspect or transform HTTP requests and responses globally before they are handled by `.then()` or `.catch()`:
1. **Request Interceptor**: Reads the token from `localStorage` and automatically attaches `config.headers.Authorization = 'Bearer ' + token` to every outgoing API request.
2. **Response Interceptor**: Catches global `401 Unauthorized` responses. If a token expires or becomes invalid, it purges `localStorage` and redirects the user to `/login` automatically.

---

### Q9: What is the Virtual DOM in React, and how does it optimize performance?
**Answer:**  
The Virtual DOM is a lightweight, in-memory JavaScript representation of the real DOM tree. When component state changes (e.g., student filters events by category), React creates a new Virtual DOM tree, performs a **reconciliation** (diffing) algorithm comparing it against the previous tree, and calculates the minimal set of batched DOM mutations required. This prevents expensive full-page browser repaints.

---

### Q10: What are Mongoose Virtuals, and where are they used in CampusConnect?
**Answer:**  
Virtuals are document properties that can be read like regular fields but are **not persisted** to MongoDB storage. In `Event.js`:
```javascript
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});
eventSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});
```
This avoids data redundancy (storing calculated fields that could become stale) while allowing the frontend to receive computed attributes seamlessly when `toJSON: { virtuals: true }` is enabled.

---

### Q11: What is the purpose of CORS, and how is it configured?
**Answer:**  
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web applications running at one origin (e.g. `http://localhost:5173`) from requesting resources from a different origin (e.g. `http://localhost:5000`). In `server.js`, the `cors` package is configured with:
```javascript
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
```
This permits API requests strictly from the designated frontend domain while blocking unauthorized third-party domains.

---

### Q12: Why is Vite preferred over Create React App (CRA)?
**Answer:**  
1. **Build Speed**: CRA bundles the entire project using Webpack before starting the dev server. Vite uses native browser **ES Modules (ESM)** to serve source files instantly on demand.
2. **Hot Module Replacement (HMR)**: Vite uses **esbuild** (written in Go), which pre-bundles dependencies 10–100x faster than JavaScript-based bundlers. Changes in React components reflect in the browser in milliseconds regardless of project size.
3. **Modern Defaults**: Vite comes pre-configured with PostCSS, modern minification, and cleaner build output chunks.

---

### Q13: What is the purpose of database indexing, and which indexes were created?
**Answer:**  
Without indexing, MongoDB must perform a **collection scan** ($O(N)$), inspecting every document sequentially to satisfy a query. Indexes create B-Tree structures ($O(\log N)$) enabling fast lookups:
* `User`: `{ email: 1 }` (unique), `{ studentId: 1 }` (sparse index).
* `Event`: `{ status: 1, eventDate: 1 }` for active upcoming schedules, and `{ category: 1, status: 1 }` for category filtering.
* `EventRegistration`: Compound unique `{ event: 1, student: 1 }` and `{ student: 1, createdAt: -1 }`.
* `Announcement`: `{ isPinned: -1, createdAt: -1 }` ensuring pinned alerts stay at the top.
* `StudyMaterial`: Compound `{ department: 1, semester: 1, subject: 1 }`.

---

### Q14: How does the application handle physical file cleanup when database records are deleted?
**Answer:**  
When an administrator deletes an event or study material, database removal alone would leave orphaned files consuming disk space. In `materialController.js`:
```javascript
if (material.fileUrl && material.fileUrl.startsWith('/uploads/')) {
  const fullPath = path.join(__dirname, '..', material.fileUrl);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath); // Safely deletes file from disk
  }
}
await StudyMaterial.findByIdAndDelete(req.params.id);
```

---

### Q15: What is the purpose of a database seed script?
**Answer:**  
A seeder script (`backend/utils/seeder.js`) populates an empty database with realistic mock data (admin accounts, students, events, circulars, study files, and registration links). This allows developers, evaluators, and examiners to immediately explore and verify all functional workflows without manually creating dozens of records from scratch.

---

### Q16: How is sensitive data protected against SQL/NoSQL Injection?
**Answer:**  
1. **Mongoose Schema Typing**: Mongoose strictly casts incoming parameters according to defined schema types (rejecting unexpected object injections).
2. **Parameterized Queries**: Mongoose queries do not concatenate raw strings, preventing classic injection exploits.
3. **Input Sanitization**: Express body parser parses incoming payloads into strictly typed JavaScript objects.

---

### Q17: What HTTP status codes are used across the REST APIs?
**Answer:**  
* `200 OK`: Successful retrieval or update (`GET`, `PUT`).
* `201 Created`: Resource successfully created (`POST` registration, event creation).
* `400 Bad Request`: Input validation failure, duplicate key, or full capacity.
* `401 Unauthorized`: Missing, expired, or invalid authentication token.
* `403 Forbidden`: Authenticated user lacks required role (e.g. Student calling Admin route).
* `404 Not Found`: Target resource does not exist.
* `500 Internal Server Error`: Unhandled server-side exception.

---

### Q18: What is Debouncing, and where is it applied on the frontend?
**Answer:**  
Debouncing delays the execution of a function until a specified idle duration has elapsed since the last event trigger. In `ExploreEvents.jsx` and `Announcements.jsx`, search inputs use a 250ms debounce. Instead of firing an HTTP request on every individual keystroke (which would flood the server), the request only executes 250ms after the student stops typing.

---

### Q19: What is the purpose of Centralized Error Handling in Express?
**Answer:**  
Instead of duplicating `try/catch` error response formatting in every controller, Express routes pass errors to `next(error)`. The centralized `errorMiddleware.js`:
1. Identifies the specific error type (Mongoose `ValidationError`, `CastError`, `E11000` duplicate key, JWT expiry).
2. Sets the appropriate HTTP status code.
3. Returns a standardized JSON payload: `{ success: false, message: ... }`.
4. Suppresses stack traces in production mode (`process.env.NODE_ENV === 'production'`).

---

### Q20: What are the primary future enhancements planned for CampusConnect?
**Answer:**  
1. **Real-time Notifications**: WebSockets (Socket.io) for instant notifications when urgent circulars are broadcasted.
2. **QR Code Attendance**: Generating unique QR codes for registered students to scan at physical event venue entrances.
3. **Automated Email Alerts**: Integration with Nodemailer/SendGrid for booking confirmation emails and reminder alerts 24 hours prior to events.
4. **Cloud Storage Migration**: Transitioning local `/uploads` storage to Amazon S3 or Cloudinary for distributed asset delivery.
