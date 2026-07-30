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