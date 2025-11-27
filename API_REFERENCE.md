# API Endpoints Reference

## Base URL
```
http://localhost/userpanel-event/userpanel-backend
```

---

## Authentication

### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

### POST /auth/login
Login with credentials.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### GET /auth/logout
Logout current user (destroys session).

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Pets Management

### GET /pets
Fetch all pets for logged-in user.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Max",
      "species": "Dog",
      "breed": "Golden Retriever",
      "birthdate": "2020-05-15",
      "age": 4,
      "medical_history": "Vaccinated",
      "photo": "uploads/pets/max_photo.jpg",
      "qr_code": "writable/qrcodes/pet_1.png"
    }
  ]
}
```

---

### POST /pets/add
Add a new pet (with photo upload).

**Request** (FormData):
```
name: "Bella"
species: "Cat"
breed: "Persian"
birthdate: "2021-03-20"
medical_history: "Spayed"
photo: [File]
```

**Response**:
```json
{
  "success": true,
  "message": "Pet added successfully",
  "pet_id": 2
}
```

---

### POST /pets/edit/{id}
Update pet details.

**Request** (FormData):
```
name: "Bella Updated"
species: "Cat"
breed: "Persian"
birthdate: "2021-03-20"
medical_history: "Updated history"
photo: [File] (optional)
```

**Response**:
```json
{
  "success": true,
  "message": "Pet updated successfully"
}
```

---

### POST /pets/delete/{id}
Delete a pet.

**Response**:
```json
{
  "success": true,
  "message": "Pet deleted successfully"
}
```

---

### GET /pets/qr/{id}
Get QR code image for a pet.

**Response**: PNG image

---

### GET /pets/download-qr/{id}
Download QR code as file.

**Response**: PNG file download

---

## Appointments

### GET /appointments
Fetch all appointments for logged-in user.

**Response**:
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "id": 1,
        "appointment_date": "2025-01-20",
        "appointment_time": "10:00",
        "status": "Pending",
        "remarks": null,
        "pet_name": "Max",
        "vet_name": "Dr. Smith",
        "service_name": "General Checkup"
      }
    ],
    "all": [...]
  }
}
```

---

### POST /appointments/book
Book a new appointment.

**Request Body**:
```json
{
  "pet_id": 1,
  "vet_id": 2,
  "service_id": 3,
  "appointment_date": "2025-01-25",
  "appointment_time": "14:00"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment_id": 5
}
```

---

### GET /appointments/booked-slots
Get booked time slots for a veterinarian on a specific date.

**Query Parameters**:
- `vet_id`: Veterinarian ID
- `date`: Date in YYYY-MM-DD format

**Example**: `/appointments/booked-slots?vet_id=2&date=2025-01-20`

**Response**:
```json
{
  "bookedSlots": ["09:00", "10:00", "14:00", "15:00"]
}
```

---

### POST /appointments/cancel/{id}
Cancel an appointment.

**Response**:
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

---

## Services

### GET /services
Fetch all available services.

**Response**:
```json
{
  "success": true,
  "services": [
    {
      "id": 1,
      "service_name": "General Checkup",
      "fee": "500.00",
      "description": "Routine health examination"
    },
    {
      "id": 2,
      "service_name": "Vaccination",
      "fee": "300.00",
      "description": "Pet vaccination service"
    },
    {
      "id": 3,
      "service_name": "Dental Cleaning",
      "fee": "800.00",
      "description": "Professional teeth cleaning"
    }
  ]
}
```

---

## Veterinarians

### GET /veterinarians
Fetch all active veterinarians.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "specialization": "General Veterinary",
      "email": "sarah.johnson@vet.com",
      "contact_number": "09123456789",
      "years_of_experience": 8,
      "photo": "uploads/vets/dr_sarah.jpg",
      "is_active": 1
    }
  ]
}
```

---

## User Settings

### GET /settings
Fetch current user profile.

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### POST /settings/update_profile
Update user profile information.

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### POST /settings/change_password
Change user password.

**Request Body**:
```json
{
  "current_password": "oldpass123",
  "new_password": "newpass123",
  "confirm_password": "newpass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Dashboard

### GET /dashboard
Get dashboard overview data.

**Response**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_pets": 3,
      "total_appointments": 5,
      "upcoming_appointments": 2,
      "total_vets": 4
    },
    "recent_appointments": [...],
    "pets_summary": [...]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Request Headers

All API requests should include:

```http
Accept: application/json
Content-Type: application/json
```

For file uploads (pets/add, pets/edit):
```http
Accept: application/json
Content-Type: multipart/form-data
```

---

## Authentication

Sessions are used for authentication. After successful login, the session cookie is automatically included in subsequent requests when using `credentials: 'include'` in fetch or `withCredentials: true` in axios.

**Axios Configuration**:
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost/userpanel-event/userpanel-backend/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt
```

### Get Pets (with session)
```bash
curl -X GET http://localhost/userpanel-event/userpanel-backend/pets \
  -H "Accept: application/json" \
  -b cookies.txt
```

### Book Appointment
```bash
curl -X POST http://localhost/userpanel-event/userpanel-backend/appointments/book \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b cookies.txt \
  -d '{"pet_id":1,"vet_id":2,"service_id":3,"appointment_date":"2025-01-25","appointment_time":"14:00"}'
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- Max 100 requests per minute per IP
- Max 1000 requests per hour per user

---

## CORS Configuration

Allowed origins:
- http://localhost:5173
- http://localhost:5174
- http://localhost:3000

Credentials enabled for session management.

---

**Last Updated**: January 16, 2025
