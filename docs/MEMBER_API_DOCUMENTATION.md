# Member API Documentation

## Overview

The Member API provides complete authentication and user management functionality for the Slim Foto project. This includes member registration, login, profile management, and password handling.

## Base URL

```
http://localhost:8000/member
```

## Endpoints

### 1. Register New Member

Create a new member account.

**Endpoint:** `POST /member/register`

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "no_hp": "081234567890",
  "alamat": "Jl. Sudirman No. 123",
  "kota": "Jakarta",
  "provinsi": "DKI Jakarta",
  "kode_pos": "12345"
}
```

**Required Fields:**
- `nama` (string): Full name of the member
- `email` (string): Valid email address (must be unique)
- `password` (string): Password (minimum 6 characters)

**Optional Fields:**
- `no_hp` (string): Phone number
- `alamat` (string): Address
- `kota` (string): City name
- `provinsi` (string): Province name
- `kode_pos` (string): Postal code

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "John Doe",
  "email": "john@example.com",
  "no_hp": "081234567890",
  "alamat": "Jl. Sudirman No. 123",
  "kota": "Jakarta",
  "provinsi": "DKI Jakarta",
  "kode_pos": "12345",
  "is_active": true,
  "last_login": null,
  "created_at": "2024-01-13T03:01:46.000000Z",
  "updated_at": "2024-01-13T03:01:46.000000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Email sudah terdaftar",
  "message": "Email address already registered"
}
```

---

### 2. Member Login

Authenticate a member and retrieve member data.

**Endpoint:** `POST /member/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Required Fields:**
- `email` (string): Member email
- `password` (string): Member password

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "John Doe",
  "email": "john@example.com",
  "no_hp": "081234567890",
  "alamat": "Jl. Sudirman No. 123",
  "kota": "Jakarta",
  "provinsi": "DKI Jakarta",
  "kode_pos": "12345",
  "is_active": true,
  "last_login": "2024-01-13T03:02:03.000000Z",
  "created_at": "2024-01-13T03:01:46.000000Z",
  "updated_at": "2024-01-13T03:02:03.000000Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Email atau password salah"
}
```

---

### 3. Get Member Profile

Retrieve a specific member's profile information.

**Endpoint:** `GET /member/{id}`

**URL Parameters:**
- `id` (string, UUID): Member ID

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "John Doe",
  "email": "john@example.com",
  "no_hp": "081234567890",
  "alamat": "Jl. Sudirman No. 123",
  "kota": "Jakarta",
  "provinsi": "DKI Jakarta",
  "kode_pos": "12345",
  "is_active": true,
  "last_login": "2024-01-13T03:02:03.000000Z",
  "created_at": "2024-01-13T03:01:46.000000Z",
  "updated_at": "2024-01-13T03:02:03.000000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Member not found"
}
```

---

### 4. Update Member Profile

Update member information (except password - use change-password for that).

**Endpoint:** `PUT /member/{id}`

**URL Parameters:**
- `id` (string, UUID): Member ID

**Request Body:**
```json
{
  "nama": "John Doe Updated",
  "no_hp": "081987654321",
  "alamat": "Jl. Merdeka No. 456",
  "kota": "Bandung",
  "provinsi": "Jawa Barat"
}
```

**Fields (all optional):**
- `nama` (string): Full name
- `no_hp` (string): Phone number
- `alamat` (string): Address
- `kota` (string): City
- `provinsi` (string): Province
- `kode_pos` (string): Postal code

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "John Doe Updated",
  "email": "john@example.com",
  "no_hp": "081987654321",
  "alamat": "Jl. Merdeka No. 456",
  "kota": "Bandung",
  "provinsi": "Jawa Barat",
  "kode_pos": "12345",
  "is_active": true,
  "last_login": "2024-01-13T03:02:03.000000Z",
  "created_at": "2024-01-13T03:01:46.000000Z",
  "updated_at": "2024-01-13T04:15:30.000000Z"
}
```

---

### 5. Change Password

Update member password (requires verification of old password).

**Endpoint:** `POST /member/{id}/change-password`

**URL Parameters:**
- `id` (string, UUID): Member ID

**Request Body:**
```json
{
  "old_password": "password123",
  "new_password": "newpassword456"
}
```

**Required Fields:**
- `old_password` (string): Current password
- `new_password` (string): New password (minimum 6 characters)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Password lama tidak sesuai"
}
```

---

### 6. Delete Member

Soft delete a member (deactivate account).

**Endpoint:** `DELETE /member/{id}`

**URL Parameters:**
- `id` (string, UUID): Member ID

**Response (200 OK):**
```json
{
  "message": "Member deleted"
}
```

---

### 7. Get All Members

Retrieve all active members.

**Endpoint:** `GET /member`

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "John Doe",
    "email": "john@example.com",
    "no_hp": "081234567890",
    "alamat": "Jl. Sudirman No. 123",
    "kota": "Jakarta",
    "provinsi": "DKI Jakarta",
    "kode_pos": "12345",
    "is_active": true,
    "last_login": "2024-01-13T03:02:03.000000Z",
    "created_at": "2024-01-13T03:01:46.000000Z",
    "updated_at": "2024-01-13T03:02:03.000000Z"
  }
]
```

---

### 8. Get Paginated Members

Retrieve members with pagination support (15 members per page).

**Endpoint:** `GET /member/paginated/{page}`

**URL Parameters:**
- `page` (integer): Page number (starting from 1)

**Response (200 OK):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "John Doe",
      "email": "john@example.com",
      ...
    }
  ],
  "first_page_url": "/?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "/?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "/",
  "per_page": 15,
  "prev_page_url": null,
  "to": 10,
  "total": 10
}
```

---

### 9. Search Members

Search members by name or email.

**Endpoint:** `GET /member/search/{query}`

**URL Parameters:**
- `query` (string): Search keyword (name or email)

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "John Doe",
    "email": "john@example.com",
    "no_hp": "081234567890",
    "alamat": "Jl. Sudirman No. 123",
    "kota": "Jakarta",
    "provinsi": "DKI Jakarta",
    "kode_pos": "12345",
    "is_active": true,
    "last_login": "2024-01-13T03:02:03.000000Z",
    "created_at": "2024-01-13T03:01:46.000000Z",
    "updated_at": "2024-01-13T03:02:03.000000Z"
  }
]
```

---

## HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "message": "Optional detailed message"
}
```

---

## Authentication Flow

### Basic Login Flow:

1. **Register new member** (POST /member/register)
   - Provide nama, email, password, and optional profile info
   - Returns member object with UUID

2. **Login** (POST /member/login)
   - Provide email and password
   - Returns member object with updated last_login timestamp

3. **Retrieve profile** (GET /member/{id})
   - Use member ID from login response
   - Returns current member information

---

## Password Security

- Passwords are hashed using bcrypt algorithm
- Password is never returned in API responses
- Password change requires old password verification
- Passwords must be at least 6 characters long

---

## Testing

### Using the Web UI

Open in browser: `http://localhost:8000/test-member-api.html`

This provides a interactive interface to test all endpoints.

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/member/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/member/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl http://localhost:8000/member/550e8400-e29b-41d4-a716-446655440000
```

**Update Profile:**
```bash
curl -X PUT http://localhost:8000/member/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Updated"
  }'
```

---

## Database Schema

### Members Table

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  no_hp VARCHAR(20),
  alamat TEXT,
  kota VARCHAR(100),
  provinsi VARCHAR(100),
  kode_pos VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_is_active ON members(is_active);
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Email addresses are case-insensitive for login but stored as provided
- Email must be unique across all members
- `is_active` field used for soft delete (deactivation)
- `last_login` updated automatically on successful login
- UUID is auto-generated for each new member
