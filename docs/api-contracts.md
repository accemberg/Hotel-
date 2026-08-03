# Moksh Haveli Inn — API Endpoint Contracts (v1)
Owner: Adrija · Aligned to Aryan's Firestore Schema · Day 1

NOTE: Firestore field names below match Aryan's schema doc exactly.
Room/gallery/otaLinks docs use slug-style IDs (e.g. "standard-room-balcony")
unless Aryan confirms auto-IDs — pending confirmation.

## GET /api/rooms
Response 200:
[
  {
    "id": "standard-room-balcony",
    "name": "Standard Room with Balcony",
    "description": "string",
    "beds": "1 King Bed",
    "maxOccupancy": 3,
    "qty": 3,
    "rate": 1500,
    "size": "250 sq ft"
  }
]

## GET /api/rooms/:id
Same shape as above, single object. 404 if not found.

## GET /api/amenities
Response 200:
[
  { "id": "peep-hole", "category": "Security", "name": "Peep Hole", "notes": "Door security" }
]

## GET /api/gallery?category=Rooms
Response 200:
[
  { "id": "g1", "category": "Rooms", "imageUrl": "https://...", "order": 0 }
]

## POST /api/enquiry
Request body:
{
  "guestName": "string",
  "contact": "string",
  "message": "string",
  "roomId": "string | null"
}
Writes to `enquiries` with: guestName, contact, message, status: "New", createdAt: server timestamp
Response 200: { "success": true, "leadId": "string" }
Response 400: { "success": false, "error": "string" }

## GET /api/ota-links
Response 200:
[
  { "id": "makemytrip", "platform": "MakeMyTrip", "listingUrl": "https://...", "logoUrl": "https://...", "active": true }
]

## GET /api/site-config
Response 200:
{
  "aboutText": "string",
  "address": "string",
  "email": "string",
  "phone": "string",
  "whatsappNumber": "string"
}

## Admin (protected, Firebase Auth middleware — built Day 4)
POST/PUT/DELETE /api/admin/rooms
POST/PUT/DELETE /api/admin/amenities
POST/PUT/DELETE /api/admin/ota-links
GET/PUT /api/admin/enquiries  (status: New → Contacted → Confirmed → Closed)
# Moksh Haveli Inn — API Contracts (v2 — Day 2 update)

## GET /api/rooms
Returns all room documents from Firestore.
Response 200:
[
  {
    "id": "BY8VnmsB0Dn1hYjnxhCH",
    "name": "Standard Room with Balcony",
    "description": "string",
    "slug": "standard-room-with-balcony",
    "rate": 1500,
    "qty": 3,
    "size": "250 sq ft",
    "beds": "1 King Bed",
    "maxOccupancy": 3
  }
]
Status: LIVE (Firestore-backed)

## GET /api/rooms/:slug
Returns a single room by its slug field (NOT the Firestore doc ID).
Example: GET /api/rooms/standard-room-with-balcony
Response 200: single room object (same shape as above, includes "id" = Firestore doc ID)
Response 400: { "success": false, "error": "Missing slug parameter" }
Response 404: { "success": false, "error": "Room not found" }
Status: LIVE (Firestore-backed)
Note: replaces the earlier GET /api/rooms/:id design. The URL param is now
the human-readable slug (e.g. "deluxe-room-with-balcony"); the response body's
"id" field remains the Firestore auto-generated document ID, unchanged.

## GET /api/amenities
Returns all amenities.
Response 200:
[
  { "id": "string", "category": "In-room", "name": "Air Conditioning", "notes": "Split AC" }
]
Status: LIVE (Firestore-backed)

## GET /api/gallery?category=  (Day 3 — not yet built)
## GET /api/ota-links  (Day 3 — not yet built)

## POST /api/enquiry
Request body:
{
  "guestName": "string",
  "contact": "string",
  "message": "string",
  "roomName": "string (optional)"
}
Response 201: { "success": true, "id": "string" }
Response 400: { "success": false, "error": "guestName, contact, and message are required" }
Response 500: { "success": false, "error": "Failed to submit enquiry" }
Status: LIVE
Behavior: writes to Firestore "enquiries" collection with status: "New" and a
server timestamp. Also triggers two Resend emails — guest auto-reply (only
sent if "contact" is an email address) and an internal notification to the
front desk. Email failures are logged but do not fail the enquiry submission
itself, so a 201 response guarantees the Firestore write succeeded even if
email delivery had an issue.

## Firestore Security Rules (confirmed live, implemented by Aryan)
- Public read: rooms, amenities, gallery, otaLinks, siteConfig
- Public create only: enquiries (no public read/update/delete)
- All writes beyond the above require request.auth != null (admin login)
All routes in this doc respect these rules as-is — no auth required for
anything built so far, since Day 2 scope is read-only + enquiry-create.

## Error shape (all endpoints)
{ "success": false, "error": "human readable message" }

## GET /api/ota-links
Response 200: [{ "id": "string", "platform": "MakeMyTrip", "listingUrl": "string", "logoUrl": "string", "active": true }]
Status: LIVE

## GET /api/gallery?category=
Optional query param: category ("Property", "Dining", "Rooms")
Response 200: [{ "id": "string", "category": "string", "imageUrl": "string", "order": 0 }]
Status: LIVE — verified working, all 3 categories confirmed returning correctly.
Note: filtered queries require a Firestore composite index on
(category ASC, order ASC) — already created in the moksh-haveli-inn project.

## GET /api/admin/enquiries
Response 200: [{ "id": "string", "guestName": "...", "contact": "...", "message": "...",
                  "roomName": "string|null", "status": "New", "createdAt": "timestamp" }]
Status: LIVE but UNPROTECTED — Firebase Auth middleware protection is a Day 4
deliverable per the brief. Uses Firebase Admin SDK (src/lib/firebase-admin.js)
since client SDK cannot satisfy Firestore's admin-only read rule for enquiries.
Do not share this URL outside the dev team until Day 4 auth lands.

## CRM status field
enquiries.status defaults to "New" on creation via POST /api/enquiry.
Pipeline: New → Contacted → Confirmed → Closed.
Status UPDATES (PATCH) are scoped to Day 4 alongside admin CRUD + auth
middleware — not exposing a write endpoint before it's protected.
## Admin Endpoints (Day 4)
All routes below require a valid Firebase Auth ID token in the request header:
Authorization: Bearer <token>

Missing or invalid token → 401: { "success": false, "error": "Missing or invalid Authorization header" }
                                  or { "success": false, "error": "Invalid or expired token" }

---

### GET /api/admin/enquiries
Returns all enquiries, newest first. (Now protected — was unprotected as of Day 3.)
Response 200: [{ "id": "string", "guestName": "...", "contact": "...", "message": "...",
                  "roomName": "string|null", "status": "New", "notes": "string|undefined",
                  "createdAt": "timestamp" }]
Status: LIVE, PROTECTED

### PATCH /api/admin/enquiries/:id
Updates status and/or notes on a single enquiry.
Request body (at least one field required):
{ "status": "Contacted", "notes": "Called guest, confirming dates" }
Valid status values: "New" | "Contacted" | "Confirmed" | "Closed"
Response 200: { "success": true, "id": "string" }
Response 400: { "success": false, "error": "status must be one of: New, Contacted, Confirmed, Closed" }
              or { "success": false, "error": "Provide status and/or notes to update" }
Response 404: { "success": false, "error": "Enquiry not found" }
Status: LIVE, PROTECTED

### GET /api/admin/enquiries/export
Downloads all enquiries as a CSV file (Content-Type: text/csv).
Columns: id, guestName, contact, roomName, message, status, notes, createdAt
Status: LIVE, PROTECTED

---

### POST /api/admin/rooms
Creates a new room.
Request body: { "name": "string", "slug": "string", "description": "string (optional)",
                 "beds": "string (optional)", "maxOccupancy": number (optional, default 1),
                 "qty": number (required), "rate": number (required), "size": "string (optional)" }
Response 201: { "success": true, "id": "string" }
Response 400: { "success": false, "error": "name, slug, rate, and qty are required" }
Status: LIVE, PROTECTED

### PATCH /api/admin/rooms/:id
Updates any subset of room fields (e.g. manual price change, availability toggle).
Request body: any partial room object, e.g. { "rate": 1800 } or { "available": false }
Response 200: { "success": true, "id": "string" }
Response 400: { "success": false, "error": "No fields provided to update" }
Response 404: { "success": false, "error": "Room not found" }
Status: LIVE, PROTECTED

### DELETE /api/admin/rooms/:id
Response 200: { "success": true, "id": "string" }
Response 404: { "success": false, "error": "Room not found" }
Status: LIVE, PROTECTED

---

### POST /api/admin/amenities
Request body: { "name": "string", "category": "string", "notes": "string (optional)" }
Response 201: { "success": true, "id": "string" }
Status: LIVE, PROTECTED

### PATCH /api/admin/amenities/:id
Request body: any partial amenity object
Response 200: { "success": true, "id": "string" }
Status: LIVE, PROTECTED

### DELETE /api/admin/amenities/:id
Response 200: { "success": true, "id": "string" }
Status: LIVE, PROTECTED

---

### POST /api/admin/gallery
Request body: { "category": "string", "imageUrl": "string", "order": number (optional, default 0) }
Response 201: { "success": true, "id": "string" }
Response 400: { "success": false, "error": "category and imageUrl are required" }
Status: LIVE, PROTECTED
Note: "order" is validated as a Number type on write, to prevent the
String/Number mismatch bug found in Day 3 seed data.

### PATCH /api/admin/gallery/:id
Request body: any partial gallery object, e.g. { "order": 1 } for reordering
Response 400: { "success": false, "error": "order must be a number" } (if order is sent as non-number)
Status: LIVE, PROTECTED

### DELETE /api/admin/gallery/:id
Status: LIVE, PROTECTED

---

### POST /api/admin/ota-links
Request body: { "platform": "string", "listingUrl": "string", "logoUrl": "string (optional)",
                 "active": boolean (optional, default true) }
Response 201: { "success": true, "id": "string" }
Status: LIVE, PROTECTED

### PATCH /api/admin/ota-links/:id
Request body: any partial OTA link object, e.g. { "active": false } to toggle
Status: LIVE, PROTECTED

### DELETE /api/admin/ota-links/:id
Status: LIVE, PROTECTED

---

### GET /api/admin/site-config
Returns the single siteConfig document.
Response 200: { "id": "string", "aboutText": "...", "address": "...", "email": "...",
                 "phone": "...", "whatsappNumber": "...", "whatsappDefaultMessage": "...",
                 "mapEmbedUrl": "..." }
Status: LIVE, PROTECTED

### PATCH /api/admin/site-config
Request body: any partial site config object
Response 200: { "success": true }
Response 400: { "success": false, "error": "No fields provided to update" }
Status: LIVE, PROTECTED

---

## CRM status field (updated)
enquiries.status defaults to "New" on creation via POST /api/enquiry (public).
Pipeline: New → Contacted → Confirmed → Closed.
Status/notes updates now LIVE via PATCH /api/admin/enquiries/:id (protected, Day 4).