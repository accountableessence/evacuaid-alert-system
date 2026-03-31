# System Design Document: Real-Time Crowd Alert & Management System

## 1. Introduction
This document outlines the software architecture, data models, API endpoints, and real-time communication design for the Real-Time Crowd Alert System. It bridges the functionality described in the Product Requirements Document (PRD) with the technical implementation details necessary for development.

## 2. High-Level Architecture

The system utilizes a modern, real-time client-server architecture designed for high availability and low latency:
- **Client Application:** A unified React web application (highly mobile-responsive). It acts as the primary interface for Admins, Staff, and Attendees, utilizing geolocation APIs and WebSocket connections.
- **Backend Service:** A Node.js server powered by Express, providing REST API routes.
- **Real-Time Engine:** A Socket.io server integrated alongside the Node backend for bidirectional communication (live map updates, real-time incident notifications).
- **Core Database:** Firebase Firestore providing real-time NoSQL document storage.
- **External Services:** 
  - **Firebase Cloud Messaging (FCM):** For reliable push notifications, especially robust in variable network conditions.
  - **Google Gemini API:** Utilized as an automated response engine to draft safe instructions dynamically.

## 3. Data Schema (Firebase Firestore)

### 3.1 `Users` Collection
- `id` (String): Unique identifier (maps to Firebase Auth UID).
- `role` (Enum): `ADMIN`, `STAFF`, `ATTENDEE`.
- `currentLocation` (GeoPoint): Last known GPS coordinates.
- `currentZone` (String): Derived logical zone (e.g., "Zone-A").
- `fcmToken` (String): Device registration token for push notifications.

### 3.2 `Incidents` Collection
- `id` (String): Unique incident ID.
- `type` (Enum): `MEDICAL`, `FIRE`, `CONGESTION`, `FIGHT`, `OTHER`.
- `locationType` (Enum): `GPS`, `ZONE_BASED`.
- `location` (GeoPoint / String): Exact coordinates or Zone ID.
- `status` (Enum): `ACTIVE`, `RESOLVED`.
- `reportedBy` (String): User ID.
- `timestamp` (Timestamp): Time of report.

### 3.3 `Tasks` Collection (Staff Assignments)
- `id` (String): Unique task ID.
- `incidentId` (String): Reference to the origin incident.
- `assignedTo` (String): Assigned Staff User ID.
- `instructions` (String): AI-generated or Admin-drafted task descriptions.
- `status` (Enum): `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`.

### 3.4 `Zones` Collection
- `id` (String): e.g., "Zone-A".
- `name` (String): Display name (e.g., "Main Stage").
- `status` (Enum): `SAFE`, `DANGER`.
- `crowdLevel` (Number): 0-100 indicating congestion.

## 4. Real-Time Communication Design (Socket.io)

Namespaces/Rooms will be utilized heavily to segment traffic and prevent broadcast storms to unrelated attendees.

### 4.1 Client-to-Server Events
- `location:update`: Clients emit changes (GPS/Zone) periodically.
- `incident:report`: Triggered via the SOS panic button.

### 4.2 Server-to-Client Events
- `admin:map_update`: Broadcasts global crowd density and incident markers strictly to the Admin room.
- `staff:new_task`: Targeted payload sent to individual staff members for a dispatch assignment.
- `zone:status_change`: Broadcasts changes (e.g., transitioning from SAFE to DANGER) to users subscribed to specific zone rooms to update their visual map.

## 5. API Endpoints (Express REST)

- **`POST /api/incidents`**
  - Payload: `{ type, location, reportedBy }`
  - Action: Saves the incident to Firestore, calls Gemini API to draft instructions, dispatches `Tasks` to nearby Staff, and emits WebSockets.
- **`PUT /api/incidents/:id/status`**
  - Payload: `{ status: 'RESOLVED' }`
- **`GET /api/tasks`**
  - Action: Retrieves active tasks for the authenticated staff member.
- **`PUT /api/tasks/:id`**
  - Payload: `{ status: 'IN_PROGRESS' }`
- **`POST /api/alerts/broadcast`** (Admin Only)
  - Payload: `{ message, targetZone }`
  - Action: Manually triggers FCM notifications.

## 6. External Integrations Workflow

### 6.1 Google Gemini AI Flow
When an SOS is triggered:
1. Backend detects the incident type and zone context.
2. Backend submits a prompt: *"An active [Incident Type] report occurred in [Zone X]. Provide a 2-sentence calm exit guide for nearby attendees, and a concise actionable task for a security guard responding to the area."*
3. The response is parsed; the exit guide targets FCM Attendees, and the task targets the Staff `Tasks` document.

### 6.2 Push Notifications (FCM)
- **Topics:** Users automatically subscribe to FCM Topics based on their role and current zone (e.g., `topic:zone_A_alerts`, `topic:staff_alerts`).
- This offloads message routing to Google's infrastructure, ensuring delivery reliability even if the frontend app drops to the background or if network connectivity is highly fluctuating.

## 7. Frontend Architecture (React Components)

- **Authentication Module:** Handles login and local storage of user roles.
- **Interactive Map Layer:**
  - Subscribes to Socket `zone:status_change`.
  - Dynamically renders colored overlays (Red = danger, Green = open/safe) based on Firestore data.
  - Draws explicit navigation vectors pointing away from danger zones.
- **Universal SOS Button:** Floating UI element accessible globally to submit immediate `incident:report`.
- **Role-Based Container Views:**
  - *Admin Dashboard:* Comprehensive analytics, map toggles, manual overwrite features.
  - *Staff Dashboard:* Task queue overlay, updating progress controls, detailed map pinning incident locations.
  - *Attendee Dashboard:* Calming UI, uncluttered map highlighting safe paths, prominent SOS trigger.
