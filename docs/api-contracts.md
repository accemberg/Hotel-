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