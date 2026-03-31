# Product Requirements Document (PRD): Real-Time Crowd Alert & Management System

## 1. Product Overview
The Real-Time Crowd Alert System is a mission-critical platform designed for use during crowded events. Its primary goal is to detect abnormal crowd density (congestion), facilitate immediate SOS emergency requests (e.g., medical emergency, fights, fire), and safely guide attendees away from danger. By providing real-time intelligence and calm instructions, the system aims to prevent crowd panic and dangerous outcomes such as stampedes and casualties.

## 2. Target Audience & Roles

### 2.1 Admin
- **View:** Global view of active incidents and venue map with live event updates.
- **Actions:** 
  - Manually trigger alerts.
  - Override AI-generated decisions and instructions if human judgment requires it.

### 2.2 Staff
- **View:** Receive specific task assignments and view incident locations.
- **Actions:**
  - Report new incidents.
  - Receive tasks based on location or nearby attendee SOS requests.
  - Divide work among available staff for evacuation or attendee movement.
  - Update the status of incidents (e.g., "In Progress", "Resolved").

### 2.3 Attendee
- **View:** Receive broadcast or zone-specific alerts and instructions. View a simplified map highlighting safe paths and exit directions based on blocked paths.
- **Actions:**
  - Trigger SOS panic button to request immediate help.

## 3. Key Features & Functional Requirements

### 3.1 Incident Reporting & SOS
- **Panic Button:** Accessible to both Staff and Attendees to trigger immediate alerts.
- **Incident Categorization:** Users must be able to select the type of incident (e.g., Medical Emergency, Fire, Congestion, Fight).
- **Location Tracking:** Incidents must capture location data seamlessly, utilizing either GPS coordinates or designated logical zones (e.g., Zone A, Zone B, Zone C).

### 3.2 Task Assignment System (Staff)
- **Automated Dispatch:** Tasks are dynamically allotted to staff members based on context (instructions, SOS requests, staff location, incident zone).
- **Actionable Guidance:** Staff receive clear, detailed instructions on how to naturally handle the situation according to their specific assignment.
- **Task Tracking:** The system must maintain a log of assigned tasks and their current statuses to ensure no incident is neglected.

### 3.3 Real-Time Communication & Notifications
- **Push Notifications:** Integrated via Firebase Cloud Messaging (FCM) to support global broadcast alerts and localized (zone-specific) alerts.
- **Role-Based Messaging:**
  - *Staff:* Receive detailed operational instructions and task specifics.
  - *Attendees:* Receive simple, calm directions to guide them out of danger zones using the map data.
- **Offline/Low-Network Support:** Push notification delivery must be resilient and localized for environments with poor, low, or absent network conditions.
- **Real-Time Data Sync:** WebSockets must be used to ensure minimal delay for live communication and updates.

### 3.4 AI-Powered Response Engine
- **Gemini Integration:** The system will use the Google Gemini API to analyze location and incident type inputs and instantly suggest safe exit routes and instructional messaging.
- **Tone Control:** Crucially, AI-generated prompts for attendees must be explicitly engineered to output calm, clear, and panic-free instructions.

### 3.5 Crowd Guidance Interface (Map)
- **Venue Layout:** A simple static image or interactive layout of the event venue.
- **Dynamic Highlighting:** 
  - Danger areas highlighted in **Red**.
  - Safe areas and exits highlighted in **Green**.
- **Movement Paths:** Clearly drawn suggested directional paths to redirect the crowd safely away from blockages.

### 3.6 Data & Backend Management
- All incident logs, zone data, and user role states must be securely stored in the backend database.

## 4. UI/UX & Design Guidelines
- **Color Palette:** The UI must adhere strictly to the following palette:
  - `#102B53` (Deep Navy)
  - `#CE85D4` (Soft Purple)
  - `#50698D` (Muted Blue-Grey)
  - `#4E7AB1` (Steel Blue)
  - `#7D9FC0` (Light Slate)
- **Philosophy:** Focus heavily on reliability, clarity, and ease of use over complex embellishments. Core functionality (SOS, alerts, map) must be prominently accessible without unnecessary features cluttering the interface.

## 5. Technology Stack
- **Frontend:** React (Web App, Mobile Responsive)
- **Backend:** Node.js with Express
- **Real-Time Communication:** Socket.io (for low latency live updates)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **AI Integration:** Google Gemini API
- **Database:** Firebase Firestore (for zones, incidents, and roles storage)
