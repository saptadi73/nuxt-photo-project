# API Documentation - Slim Photo Project

## Table of Contents
- [Authentication](#authentication)
- [Member Management](#member-management)
- [User Management](#user-management)
- [Role Management](#role-management)
- [Category Management](#category-management-kategori)
- [Photo Management](#photo-management-foto)
- [Rental Package Management](#rental-package-management-paket-rental)
- [Rental Management](#rental-management)
- [Sale Orders Management](#sale-orders-management-e-commerce-sales)
- [Download Management](#download-management)
- [Services Documentation](#services-documentation)
- [Database Schema](#database-schema)

---

## Base URL
```
http://localhost:8000
```

---

## Authentication

### JWT Token System

The API uses separate JWT tokens for different user types to prevent cross-type authentication:

#### User JWT Token (System Admin/Staff)
- **Type:** `user`
- **Middleware:** `UserJwtMiddleware`
- **Used for:** Admin and staff endpoints
- **Payload includes:**
  ```json
  {
    "sub": "user-uuid",
    "type": "user",
    "name": "Admin Name",
    "email": "admin@example.com",
    "roles": ["admin", "moderator"],
    "iat": 1234567890,
    "exp": 1234571490
  }
  ```

#### Member JWT Token (Customer)
- **Type:** `member`
- **Middleware:** `MemberJwtMiddleware`
- **Used for:** Customer/member endpoints
- **Payload includes:**
  ```json
  {
    "sub": "member-uuid",
    "type": "member",
    "nama": "John Doe",
    "email": "john@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  }
  ```

**Important:** Using a user token on member endpoints (or vice versa) will result in a 403 Forbidden error.

### 1. Register New User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account with default 'user' role.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "User registered",
  "data": {
    "success": true,
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": [
        {
          "id": "role-uuid",
          "name": "user",
          "label": "Regular User"
        }
      ]
    }
  }
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "Invalid input"
}
```

---

### 2. Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token.

**Request Body (JSON or form-urlencoded):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Login success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "admin"
  }
}
```

**JWT Token Payload:**
```json
{
  "sub": "user-uuid",
  "type": "user",
  "name": "Admin",
  "email": "admin@example.com",
  "roles": ["admin"],
  "iat": 1234567890,
  "exp": 1234610690
}
```

**Response Error (401):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

### 3. Logout
**Endpoint:** `POST /auth/logout`

**Description:** Logout user (client should discard token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Logout success",
  "data": []
}
```

**Response Error (401):**
```json
{
  "status": "error",
  "message": "Invalid or missing token"
}
```

---

### 4. Get User Profile
**Endpoint:** `GET /auth/profile`

**Description:** Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Profile data",
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "Admin",
      "email": "admin@example.com",
      "created_at": "2026-01-09T10:00:00.000000Z",
      "updated_at": "2026-01-09T10:00:00.000000Z"
    },
    "role": null
  }
}
```

---

## User Management

**Note:** All user management endpoints require JWT authentication.

### 1. Get All Users
**Endpoint:** `GET /users`

**Description:** Get list of all users with their roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Users retrieved",
  "data": [
    {
      "id": "user-uuid-1",
      "name": "Admin",
      "email": "admin@example.com",
      "roles": [
        {
          "id": "role-uuid",
          "name": "admin",
          "label": "Administrator"
        }
      ]
    },
    {
      "id": "user-uuid-2",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": [
        {
          "id": "role-uuid",
          "name": "user",
          "label": "Regular User"
        }
      ]
    }
  ]
}
```

---

### 2. Get Single User
**Endpoint:** `GET /users/{id}`

**Description:** Get detailed information of a specific user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (required): User UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "User retrieved",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-09T10:00:00.000000Z",
    "updated_at": "2026-01-09T10:00:00.000000Z",
    "roles": [
      {
        "id": "role-uuid",
        "name": "user",
        "label": "Regular User"
      }
    ]
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

### 3. Update User
**Endpoint:** `PUT /users/{id}`

**Description:** Update user information and/or role.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (required): User UUID

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role_id": "role-uuid-here"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "User updated",
  "data": {
    "id": "user-uuid",
    "name": "Updated Name",
    "email": "updated@example.com"
  }
}
```

---

### 4. Delete User
**Endpoint:** `DELETE /users/{id}`

**Description:** Delete user and all associated role relationships.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (required): User UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "User deleted",
  "data": []
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

### 5. Update User Role
**Endpoint:** `POST /users/update/role`

**Description:** Update user role relationship in pivot table.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "user-uuid",
  "role_id": "role-uuid"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "User role updated",
  "data": {
    "success": true,
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "roles": [...]
    }
  }
}
```

---

## Role Management

**Note:** All role management endpoints require JWT authentication.

### 1. Get All Roles
**Endpoint:** `GET /roles`

**Description:** Get list of all available roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Roles retrieved",
  "data": [
    {
      "id": "role-uuid-1",
      "name": "admin",
      "label": "Administrator",
      "created_at": "2026-01-09T10:00:00.000000Z",
      "updated_at": "2026-01-09T10:00:00.000000Z"
    },
    {
      "id": "role-uuid-2",
      "name": "user",
      "label": "Regular User",
      "created_at": "2026-01-09T10:00:00.000000Z",
      "updated_at": "2026-01-09T10:00:00.000000Z"
    }
  ]
}
```

---

### 2. Get All Users with Roles
**Endpoint:** `GET /roles/users`

**Description:** Get all users with their associated roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Users retrieved with roles",
  "data": [
    {
      "id": "user-uuid",
      "name": "Admin",
      "email": "admin@example.com",
      "roles": [...]
    }
  ]
}
```

---

### 3. Assign Multiple Roles to User
**Endpoint:** `POST /roles/users/{userId}/roles`

**Description:** Assign multiple roles to a user (replaces existing roles).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `userId` (required): User UUID

**Request Body:**
```json
{
  "role_ids": ["role-uuid-1", "role-uuid-2"]
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Roles assigned successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "roles": [...]
  }
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "role_ids is required"
}
```

---

### 4. Add Single Role to User
**Endpoint:** `POST /roles/users/{userId}/roles/{roleId}`

**Description:** Add a single role to user without removing existing roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `userId` (required): User UUID
- `roleId` (required): Role UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Role added successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "roles": [...]
  }
}
```

---

### 5. Remove Single Role from User
**Endpoint:** `DELETE /roles/users/{userId}/roles/{roleId}`

**Description:** Remove a specific role from user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `userId` (required): User UUID
- `roleId` (required): Role UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Role removed successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "roles": [...]
  }
}
```

---

## Category Management (Kategori)

### 1. Get All Categories
**Endpoint:** `GET /kategori`

**Description:** Get list of all categories with their display photos.

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Categories retrieved",
  "data": [
    {
      "id": "category-uuid-1",
      "nama": "Landscape",
      "deskripsi": "Beautiful landscape photography",
      "url_foto": "/uploads/kategori/abc123def456.jpg",
      "created_at": "2026-01-09T10:00:00.000000Z",
      "updated_at": "2026-01-09T10:00:00.000000Z"
    },
    {
      "id": "category-uuid-2",
      "nama": "Portrait",
      "deskripsi": "Professional portrait photography",
      "url_foto": "/uploads/kategori/xyz789uvw012.jpg",
      "created_at": "2026-01-09T10:00:00.000000Z",
      "updated_at": "2026-01-09T10:00:00.000000Z"
    }
  ]
}
```

---

### 2. Get Category by ID
**Endpoint:** `GET /kategori/{id}`

**Description:** Get a specific category with all photos in that category.

**Path Parameters:**
- `id` (required): Category UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Category retrieved",
  "data": {
    "id": "category-uuid",
    "nama": "Landscape",
    "deskripsi": "Beautiful landscape photography",
    "url_foto": "/uploads/kategori/abc123def456.jpg",
    "created_at": "2026-01-09T10:00:00.000000Z",
    "updated_at": "2026-01-09T10:00:00.000000Z",
    "foto": [
      {
        "id": "foto-uuid-1",
        "judul": "Mountain View",
        "harga": 50000,
        "url_thumbnail": "/uploads/foto/thumbnail/abc123.jpg",
        "url_watermark": "/uploads/foto/watermark/abc123.jpg",
        "url_download": "/uploads/foto/download/abc123.jpg",
        "is_active": true,
        "is_rental": false
      }
    ]
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "Category not found"
}
```

---

### 3. Create New Category
**Endpoint:** `POST /kategori`

**Description:** Create a new category with display photo. The display photo is used as a sample/thumbnail when listing categories.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `nama` (required, string): Category name
- `deskripsi` (optional, string): Category description
- `url_foto` (optional, file): Display photo for category (JPG, PNG, GIF, WebP)

**cURL Example:**
```bash
curl -X POST http://localhost:8000/kategori \
  -F "nama=Landscape" \
  -F "deskripsi=Beautiful landscape photography" \
  -F "url_foto=@/path/to/landscape.jpg"
```

**Response Success (201):**
```json
{
  "status": "success",
  "message": "Category created",
  "data": {
    "id": "category-uuid",
    "nama": "Landscape",
    "deskripsi": "Beautiful landscape photography",
    "url_foto": "/uploads/kategori/abc123def456.jpg",
    "created_at": "2026-01-09T10:30:00.000000Z",
    "updated_at": "2026-01-09T10:30:00.000000Z"
  }
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "message": "Nama is required"
}
```

---

### 4. Update Category
**Endpoint:** `PUT /kategori/{id}`

**Description:** Update category name, description, and/or display photo. Old photo will be deleted when new one is uploaded.

**Path Parameters:**
- `id` (required): Category UUID

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `nama` (optional, string): Category name
- `deskripsi` (optional, string): Category description
- `url_foto` (optional, file): New display photo for category (old photo will be deleted)

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/kategori/{id} \
  -F "nama=Updated Landscape" \
  -F "deskripsi=Updated description" \
  -F "url_foto=@/path/to/new_landscape.jpg"
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Category updated",
  "data": {
    "id": "category-uuid",
    "nama": "Updated Landscape",
    "deskripsi": "Updated description",
    "url_foto": "/uploads/kategori/new_abc123def456.jpg",
    "created_at": "2026-01-09T10:00:00.000000Z",
    "updated_at": "2026-01-09T11:00:00.000000Z"
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "Category not found"
}
```

---

### 5. Delete Category
**Endpoint:** `DELETE /kategori/{id}`

**Description:** Delete a category and its display photo. Note: Photos within this category should be handled separately.

**Path Parameters:**
- `id` (required): Category UUID

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Category deleted"
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "message": "Category not found"
}
```

---

## Member Management

### Base URL
```
/member
```

### PUBLIC ENDPOINTS (No JWT Required)

### 1. Register New Member
**Endpoint:** `POST /member/register`

**Description:** Create a new member account.

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

**Required:** `nama`, `email`, `password`

**Response (201):**
```json
{
  "success": true,
  "message": "Member registered successfully",
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "email": "john@example.com",
    "is_active": true,
    "created_at": "timestamp"
  }
}
```

### 2. Member Login (Get JWT Token)
**Endpoint:** `POST /member/login`

**Description:** Authenticate member and receive JWT token with type='member'

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW1iZXItdXVpZCIsInR5cGUiOiJtZW1iZXIiLCJuYW1hIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjEyMzQ1Njc4OTAsImV4cCI6MTIzNDYwNzY5MH0...",
    "member": {
      "id": "uuid",
      "id_member": "uuid",
      "nama": "John Doe",
      "email": "john@example.com",
      "no_hp": "081234567890",
      "alamat": "Jl. Sudirman No. 123",
      "kota": "Jakarta",
      "provinsi": "DKI Jakarta",
      "kode_pos": "10210",
      "is_active": true
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

### 3. Get All Members (Public)
**Endpoint:** `GET /member`

**Response:** List of all active members

---

### PROTECTED ENDPOINTS (JWT Token Required - type='member')

**Authentication Header Required:**
```
Authorization: Bearer <member_jwt_token>
```

### 4. Get Member Profile
**Endpoint:** `GET /member/profile`

**Description:** Get authenticated member's own profile

**Response (200):**
```json
{
  "success": true,
  "message": "Member profile retrieved",
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "email": "john@example.com",
    "no_hp": "081234567890",
    "alamat": "Jl. Sudirman No. 123",
    "kota": "Jakarta",
    "provinsi": "DKI Jakarta",
    "kode_pos": "10210",
    "is_active": true,
    "last_login": "timestamp"
  }
}
```

### 5. Get Member by ID (Protected)
**Endpoint:** `GET /member/{id}`

**Description:** Get member profile (member can only view their own profile)

**Response Error (403):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 6. Update Member Profile (Protected)
**Endpoint:** `PUT /member/{id}`

**Description:** Update member profile (member can only update their own profile)

**Headers:**
```
Authorization: Bearer <member_jwt_token>
```

**Request Body:**
```json
{
  "nama": "John Doe Updated",
  "no_hp": "081987654321",
  "alamat": "Jl. Merdeka No. 456",
  "kota": "Bandung",
  "provinsi": "Jawa Barat",
  "kode_pos": "40123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member updated",
  "data": {...}
}
```

### 7. Change Password (Protected)
**Endpoint:** `POST /member/{id}/change-password`

**Headers:**
```
Authorization: Bearer <member_jwt_token>
```

**Request Body:**
```json
{
  "old_password": "old_password123",
  "new_password": "new_password456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "success": true,
    "message": "Password berhasil diubah"
  }
}
```

### 8. Delete Member Account (Protected)
**Endpoint:** `DELETE /member/{id}`

**Description:** Delete/deactivate member account (member can only delete their own account)

**Headers:**
```
Authorization: Bearer <member_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member deleted"
}
```

---

## Photo Management (Foto)

### Base URL
```
/foto
```

### 1. Upload Photo
**Endpoint:** `POST /foto/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: (image file)
id_kategori: uuid
judul: "Photo Title"
deskripsi: "Photo Description"
harga: 100000
```

**Response (201):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "id": "uuid",
    "judul": "Photo Title",
    "file_path": "/uploads/photo.jpg",
    "url_foto": "http://localhost:8000/uploads/photo.jpg"
  }
}
```

### 2. Get All Photos
**Endpoint:** `GET /foto`

**Query Parameters:**
- `kategori`: Filter by category ID
- `search`: Search by title or description

### 3. Get Photo by ID
**Endpoint:** `GET /foto/{id}`

### 4. Get Photos by Category
**Endpoint:** `GET /foto/kategori/{id_kategori}`

### 5. Get Photos by Multiple Categories
**Endpoint:** `POST /foto/by-multiple-kategoris`

**Request Body:**
```json
{
  "id_kategoris": ["uuid1", "uuid2", "uuid3"]
}
```

### 6. Update Photo
**Endpoint:** `PUT /foto/{id}`

**Request Body:**
```json
{
  "judul": "Updated Title",
  "deskripsi": "Updated Description",
  "id_kategori": "uuid",
  "harga": 150000
}
```

### 7. Delete Photo
**Endpoint:** `DELETE /foto/{id}`

---

## Rental Package Management (Paket Rental)

### Base URL
```
/paket-rental
```

### 1. Get All Packages
**Endpoint:** `GET /paket-rental`

**Response:**
```json
{
  "success": true,
  "message": "Rental packages retrieved",
  "data": [
    {
      "id": "uuid",
      "nama": "Paket Premium",
      "jumlah": 30,
      "harga": 500000,
      "deskripsi": "Paket rental 30 hari",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### 2. Get Package by ID
**Endpoint:** `GET /paket-rental/{id}`

### 3. Create Package
**Endpoint:** `POST /paket-rental`

**Request Body:**
```json
{
  "nama": "Paket Premium",
  "jumlah": 30,
  "harga": 500000,
  "deskripsi": "Paket rental 30 hari"
}
```

**Required:** `nama`, `jumlah`, `harga`

### 4. Update Package
**Endpoint:** `PUT /paket-rental/{id}`

**Request Body:**
```json
{
  "nama": "Paket Platinum",
  "jumlah": 60,
  "harga": 800000,
  "deskripsi": "Paket rental 60 hari"
}
```

### 5. Delete Package
**Endpoint:** `DELETE /paket-rental/{id}`

---

## Rental Orders Management (Rental Foto)

### Base URL
```
/rental-orders
```

**Description:** Rental orders work like sale orders - rental_foto is the order header and rental items are the line items.

### 1. Get All Rental Orders
**Endpoint:** `GET /rental-orders`

**Response:**
```json
{
  "success": true,
  "message": "Rental orders retrieved",
  "data": [
    {
      "id": "uuid",
      "id_member": "member-uuid",
      "id_paket_rental": "paket-uuid",
      "tanggal": "2026-01-13",
      "alamat": "Jl. Rental No. 123",
      "no_hp": "081234567890",
      "email": "customer@example.com",
      "harga": 1500000,
      "jumlah_foto": 10,
      "status": "pending",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "member": {
        "id": "member-uuid",
        "nama": "John Doe",
        "email": "john@example.com"
      },
      "paketRental": {
        "id": "paket-uuid",
        "nama": "Paket Premium",
        "harga": 500000
      },
      "rentals": [
        {
          "id": "rental-line-uuid",
          "id_rental_foto": "order-uuid",
          "id_foto": "foto-uuid",
          "jumlah": 3,
          "foto": {
            "id": "foto-uuid",
            "judul": "Foto 1",
            "display": "foto1.jpg",
            "url_thumbnail": "/uploads/foto/thumbnail/xxx.jpg"
          }
        }
      ]
    }
  ]
}
```

### 2. Get Rental Order by ID
**Endpoint:** `GET /rental-orders/{id}`

**Response:** Same structure as Get All with single order

### 3. Get Rental Orders by Member
**Endpoint:** `GET /rental-orders/member/{id_member}`

**Description:** Get all rental orders for a specific member

### 4. Get Rental Orders by Status
**Endpoint:** `GET /rental-orders/status/{status}`

**Status Values:** `pending`, `active`, `completed`, `cancelled`

### 5. Create Rental Order
**Endpoint:** `POST /rental-orders`

**Request Body:**
```json
{
  "tanggal": "2026-01-13",
  "id_member": "member-uuid",
  "id_paket_rental": "paket-uuid",
  "alamat": "Jl. Rental No. 123",
  "no_hp": "081234567890",
  "jumlah_foto": 10,
  "email": "customer@example.com",
  "status": "pending"
}
```

**Required:** `tanggal`, `id_member`, `id_paket_rental`, `alamat`, `no_hp`, `jumlah_foto`

**Response:**
```json
{
  "success": true,
  "message": "Rental order created",
  "data": {
    "id": "uuid",
    "id_member": "member-uuid",
    "id_paket_rental": "paket-uuid",
    "tanggal": "2026-01-13",
    "alamat": "Jl. Rental No. 123",
    "no_hp": "081234567890",
    "email": "customer@example.com",
    "harga": 0,
    "jumlah_foto": 10,
    "status": "pending",
    "rentals": []
  }
}
```

### 6. Add Photo Line Item to Order
**Endpoint:** `POST /rental-orders/{id}/items`

**Request Body:**
```json
{
  "id_foto": "foto-uuid",
  "jumlah": 3
}
```

**Required:** `id_foto`, `jumlah`

**Validation:**
- Sum of all `jumlah` in line items cannot exceed `jumlah_foto` in order header
- Returns 400 error if validation fails

**Error Response:**
```json
{
  "success": false,
  "message": "Cannot add 3 photos. Max allowed: 10, Current: 8"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Line item added to rental order",
  "data": {
    "id": "order-uuid",
    "harga": 1500000,
    "rentals": [
      {
        "id": "rental-line-uuid",
        "id_rental_foto": "order-uuid",
        "id_foto": "foto-uuid",
        "jumlah": 3,
        "foto": {...}
      }
    ]
  }
}
```

### 7. Remove Photo Line Item from Order
**Endpoint:** `DELETE /rental-orders/{id}/items/{id_rental}`

**Response:**
```json
{
  "success": true,
  "message": "Line item removed from rental order",
  "data": {...}
}
```

### 8. Recalculate Order Total
**Endpoint:** `POST /rental-orders/{id}/recalculate-total`

**Description:** Manually recalculate total (usually automatic, but available for debugging)

### 9. Update Rental Order Status
**Endpoint:** `PATCH /rental-orders/{id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

### 10. Delete Rental Order
**Endpoint:** `DELETE /rental-orders/{id}`

**Description:** Deletes order and all associated line items (cascade)

### 11. Get Rental Order Statistics
**Endpoint:** `GET /rental-orders/stats/summary`

**Response:**
```json
{
  "success": true,
  "message": "Rental order statistics retrieved",
  "data": {
    "total_orders": 5,
    "pending_orders": 2,
    "completed_orders": 3,
    "total_revenue": 7500000
  }
}
```

---

## Rental Management

### Base URL
```
/rental
```

### 1. Get All Rentals
**Endpoint:** `GET /rental`

**Response:**
```json
{
  "success": true,
  "message": "Rentals retrieved",
  "data": [
    {
      "id": "uuid",
      "id_member": "uuid",
      "id_paket_rental": "uuid",
      "harga": 500000,
      "status": "active",
      "member": {...},
      "paketRental": {...},
      "fotos": [...]
    }
  ]
}
```

### 2. Get Rental by ID
**Endpoint:** `GET /rental/{id}`

### 3. Get Rentals by Member
**Endpoint:** `GET /rental/member/{id_member}`

**Description:** Get all rentals for a specific member

### 4. Get Active Rentals by Member
**Endpoint:** `GET /rental/member/{id_member}/active`

### 5. Create Rental
**Endpoint:** `POST /rental`

**Request Body:**
```json
{
  "id_member": "uuid",
  "id_paket_rental": "uuid",
  "harga": 500000,
  "foto_ids": ["uuid1", "uuid2"]
}
```

**Required:** `id_member`, `id_paket_rental`, `harga`

### 6. Add Photo to Rental
**Endpoint:** `POST /rental/{id}/foto`

**Request Body:**
```json
{
  "id_foto": "uuid"
}
```

### 7. Remove Photo from Rental
**Endpoint:** `DELETE /rental/{id}/foto/{id_foto}`

### 8. Update Rental Status
**Endpoint:** `PATCH /rental/{id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

### 9. Delete Rental
**Endpoint:** `DELETE /rental/{id}`

---

## Sale Orders Management (E-Commerce Sales)

### Base URL
```
/sale-orders
```

### Overview
Sale Orders system implements proper e-commerce structure with headers and line items:
- **Sale Order (Header)**: Contains buyer info, date, and order total
- **Sale Order Lines (Items)**: Individual items with photo, price, and quantity

### 1. Get All Sale Orders
**Endpoint:** `GET /sale-orders`

**Response:**
```json
{
  "success": true,
  "message": "Sale orders retrieved",
  "data": [
    {
      "id": "uuid",
      "tanggal": "2026-01-13",
      "nama_pembeli": "John Doe",
      "alamat": "Jl. Sudirman No. 123, Jakarta",
      "no_hp": "081234567890",
      "email": "john@example.com",
      "total": 500000,
      "status": "completed",
      "lines": [
        {
          "id": "uuid",
          "id_foto": "uuid",
          "nama_foto": "Photo 1",
          "harga": 250000,
          "qty": 2,
          "subtotal": 500000,
          "foto": {...}
        }
      ],
      "created_at": "timestamp"
    }
  ]
}
```

### 2. Get Sale Order by ID
**Endpoint:** `GET /sale-orders/{id}`

**Description:** Get complete order with all line items and photo details

**Response:**
```json
{
  "success": true,
  "message": "Sale order retrieved",
  "data": {
    "id": "45b11e60-82a3-434c-8821-54bd191e1c8c",
    "id_member": "member-uuid",
    "tanggal": "2026-01-13",
    "nama_pembeli": "Test Customer",
    "alamat": "Jl. Testing No. 123",
    "no_hp": "081234567890",
    "email": "customer@example.com",
    "total": 2500000,
    "status": "paid",
    "created_at": "2026-01-13T10:24:46.000000Z",
    "updated_at": "2026-01-13T10:25:00.000000Z",
    "member": {
      "id": "member-uuid",
      "nama": "Test Customer",
      "email": "customer@example.com"
    },
    "lines": [
      {
        "id": "line-uuid",
        "id_sale_order": "45b11e60-82a3-434c-8821-54bd191e1c8c",
        "id_foto": "5b5d31a6-dca1-40c4-b55f-0c1dc87c1742",
        "nama_foto": "Gazebo Laut",
        "harga": 500000,
        "qty": 5,
        "subtotal": 2500000,
        "created_at": "2026-01-13T10:24:50.000000Z",
        "updated_at": "2026-01-13T10:24:50.000000Z",
        "foto": {
          "id": "5b5d31a6-dca1-40c4-b55f-0c1dc87c1742",
          "judul": "Gazebo Laut",
          "display": "gazebo-laut.jpg",
          "url_thumbnail": "/uploads/foto/thumbnail/19cd675685d129940851b62ecd2fad50.jpg",
          "url_watermark": "/uploads/foto/watermark/19cd675685d129940851b62ecd2fad50.jpg",
          "nama_kategori": "Landscape"
        }
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Sale order not found"
}
```

### 3. Get Sale Orders by Status
**Endpoint:** `GET /sale-orders/status/{status}`

**Status Values:** `pending`, `completed`, `cancelled`

### 4. Get Sale Orders by Date Range
**Endpoint:** `GET /sale-orders/date-range/{start}/{end}`

**Example:** `/sale-orders/date-range/2026-01-01/2026-01-31`

### 5. Get Sale Orders by Buyer Name
**Endpoint:** `GET /sale-orders/buyer/{nama}`

**Description:** Search orders by buyer name (partial match)

### 6. Get Sale Orders by Member ID
**Endpoint:** `GET /sale-orders/member/{id_member}`

**Description:** Get all orders for a specific member

**Response:**
```json
{
  "success": true,
  "message": "Sale orders by member retrieved",
  "data": [
    {
      "id": "uuid",
      "id_member": "member-uuid",
      "tanggal": "2026-01-13",
      "nama_pembeli": "John Doe",
      "alamat": "Jl. Sudirman No. 123, Jakarta",
      "no_hp": "081234567890",
      "email": "john@example.com",
      "total": 500000,
      "status": "completed",
      "member": {
        "id": "member-uuid",
        "nama": "John Doe",
        "email": "john@example.com"
      },
      "lines": [...]
    }
  ]
}
```

### 7. Create Sale Order
**Endpoint:** `POST /sale-orders`

**Request Body:**
```json
{
  "tanggal": "2026-01-13",
  "nama_pembeli": "John Doe",
  "alamat": "Jl. Sudirman No. 123, Jakarta",
  "no_hp": "081234567890",
  "email": "john@example.com",
  "id_member": "member-uuid",
  "status": "pending"
}
```

**Required:** `tanggal`, `nama_pembeli`, `alamat`, `no_hp`  
**Optional:** `email`, `id_member`, `status` (default: "pending")

**Response (201):**
```json
{
  "success": true,
  "message": "Sale order created",
  "data": {
    "id": "uuid",
    "id_member": "member-uuid",
    "tanggal": "2026-01-13",
    "nama_pembeli": "John Doe",
    "alamat": "Jl. Sudirman No. 123, Jakarta",
    "no_hp": "081234567890",
    "email": "john@example.com",
    "total": 0,
    "status": "pending",
    "lines": [],
    "member": {
      "id": "member-uuid",
      "nama": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 8. Update Sale Order (Buyer Info)
**Endpoint:** `PUT /sale-orders/{id}`

**Request Body:**
```json
{
  "nama_pembeli": "John Doe Updated",
  "alamat": "Jl. Merdeka No. 456",
  "no_hp": "081987654321",
  "email": "john.updated@example.com"
}
```

**Note:** Total is auto-calculated from line items

### 8. Update Sale Order Status
**Endpoint:** `PATCH /sale-orders/{id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

### 9. Recalculate Order Total
**Endpoint:** `POST /sale-orders/{id}/recalculate-total`

**Description:** Recalculate total from all line items' subtotals

**Response:**
```json
{
  "success": true,
  "message": "Sale order total recalculated",
  "data": {...}
}
```

### 10. Delete Sale Order
**Endpoint:** `DELETE /sale-orders/{id}`

**Description:** Delete order and all associated line items

### 11. Get Sales Statistics
**Endpoint:** `GET /sale-orders/stats/summary`

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total_orders": 100,
    "pending": 15,
    "completed": 80,
    "cancelled": 5,
    "total_revenue": 50000000
  }
}
```

---

### Sale Order Line Items Management

### Base URL
```
/sale-orders/{order_id}/items
```

### 1. Add Line Item to Order
**Endpoint:** `POST /sale-orders/{order_id}/items`

**Request Body:**
```json
{
  "id_foto": "uuid",
  "nama_foto": "Photo Name",
  "harga": 250000,
  "qty": 2
}
```

**Required:** `id_foto`, `nama_foto`, `harga`  
**Optional:** `qty` (default: 1)

**Response (201):**
```json
{
  "success": true,
  "message": "Line item added",
  "data": {
    "id": "uuid",
    "sale_order_id": "uuid",
    "id_foto": "uuid",
    "nama_foto": "Photo Name",
    "harga": 250000,
    "qty": 2,
    "subtotal": 500000,
    "foto": {...}
  }
}
```

**Auto-Actions:**
- Subtotal is automatically calculated: `qty * harga`
- Order total is recalculated automatically

### 2. Update Line Item Quantity
**Endpoint:** `PATCH /sale-orders/{order_id}/items/{line_id}`

**Request Body:**
```json
{
  "qty": 3
}
```

**Auto-Actions:**
- Subtotal recalculated: `qty * harga`
- Order total updated automatically

### 3. Remove Line Item
**Endpoint:** `DELETE /sale-orders/{order_id}/items/{line_id}`

**Auto-Actions:**
- Order total recalculated

---

## Download Management

### Base URL
```
/download
```

### 1. Get All Downloads
**Endpoint:** `GET /download`

### 2. Get Download by ID
**Endpoint:** `GET /download/{id}`

### 3. Record Download
**Endpoint:** `POST /download`

**Request Body:**
```json
{
  "id_user": "uuid",
  "id_foto": "uuid"
}
```

### 4. Get Downloads by User
**Endpoint:** `GET /download/user/{id_user}`

### 5. Get Downloads by Photo
**Endpoint:** `GET /download/foto/{id_foto}`

---

## Services Documentation

### AuthService

Location: `app/Services/AuthService.php`

#### Methods:

##### `login($email, $password)`
Authenticate user and generate JWT token.

**Parameters:**
- `$email` (string): User email address
- `$password` (string): User password (plain text)

**Returns:**
```php
// Success
[
    'success' => true,
    'token' => 'jwt_token_string',
    'user' => [
        'id' => 'user-uuid',
        'name' => 'User Name',
        'email' => 'user@example.com',
        'roles' => [
            [
                'id' => 'role-uuid',
                'name' => 'admin',
                'label' => 'Administrator'
            ]
        ]
    ]
]

// Failure
[
    'success' => false,
    'message' => 'Invalid credentials'
]
```

**JWT Payload Structure:**
```php
[
    'sub' => 'user-id',           // Subject (user ID)
    'name' => 'User Name',
    'email' => 'user@example.com',
    'roles' => ['admin', 'user'], // Array of role names
    'iat' => 1234567890,          // Issued at (timestamp)
    'exp' => 1234610690           // Expiration (timestamp + 12 hours)
]
```

**Throws:**
- `Exception` when `JWT_SECRET` is not configured

---

##### `register($name, $email, $password, $role_id = null)`
Register a new user account.

**Parameters:**
- `$name` (string): User's full name
- `$email` (string): User's email address
- `$password` (string): User's password (will be hashed)
- `$role_id` (string|null): Optional role UUID (defaults to 'user' role)

**Returns:**
```php
// Success
[
    'success' => true,
    'user' => User // User model with roles relationship loaded
]

// Failure (when default role not found)
[
    'success' => false,
    'message' => 'Default role not found'
]
```

**Features:**
- Automatically generates UUID for user ID
- Hashes password using `PASSWORD_DEFAULT`
- Assigns default 'user' role if no role_id provided
- Creates user-role relationship in pivot table
- Returns user with roles eager-loaded

---

### UserService

Location: `app/Services/UserService.php`

#### Methods:

##### `findByEmail($email)`
Find user by email address.

**Parameters:**
- `$email` (string): Email address to search

**Returns:**
- `User` model instance or `null` if not found

---

##### `findById($id)`
Find user by UUID.

**Parameters:**
- `$id` (string): User UUID

**Returns:**
- `User` model instance or `null` if not found

---

##### `create($name, $email, $password, $role_id = null)`
Create a new user with role assignment.

**Parameters:**
- `$name` (string): User's full name
- `$email` (string): User's email address
- `$password` (string): User's password (will be hashed)
- `$role_id` (string|null): Optional role UUID

**Returns:**
- `User` model with roles relationship loaded

**Throws:**
- `Exception` if user ID is not generated after creation

**Features:**
- Generates UUID automatically
- Hashes password with `PASSWORD_DEFAULT`
- Validates user ID before role attachment
- Eager-loads roles relationship

---

##### `update($id, $data)`
Update user information and/or role.

**Parameters:**
- `$id` (string): User UUID
- `$data` (array): Array of fields to update
  - `name` (optional): New name
  - `email` (optional): New email
  - `role_id` (optional): New role UUID (syncs in pivot table)

**Returns:**
- `User` model instance or `null` if user not found
- `array` with error message if role not found:
```php
['success' => false, 'message' => 'Role not found']
```

**Features:**
- Validates role existence before updating
- Uses `sync()` to replace role in pivot table
- Updates other user fields separately

---

##### `delete($id)`
Delete user and all role relationships.

**Parameters:**
- `$id` (string): User UUID

**Returns:**
- `boolean`: `true` on success, `false` if user not found

**Features:**
- Automatically detaches all roles from pivot table
- Cascades deletion to role_users relationships

---

##### `updateRole($data)`
Update user's role in pivot table.

**Parameters:**
- `$data` (array):
  - `id` (required): User UUID
  - `role_id` (required): Role UUID

**Returns:**
- `array` with success status and user data
```php
// Success
['success' => true, 'user' => User, 'message' => '...']

// Failure
['success' => false, 'message' => 'Role not found']
```

**Features:**
- Validates role existence
- Uses `sync()` to replace role assignment

---

##### `getAllRoles()`
Get all available roles from database.

**Returns:**
- `Collection` of `Role` models

---

##### `getAllWithRoles()`
Get all users with their roles eager-loaded.

**Returns:**
- `Collection` of `User` models with `roles` relationship

---

##### `assignRoles($userId, $roleIds)`
Assign multiple roles to user (replaces existing).

**Parameters:**
- `$userId` (string): User UUID
- `$roleIds` (array): Array of role UUIDs

**Returns:**
```php
// Success
[
    'success' => true,
    'user' => User, // with roles loaded
    'message' => 'Roles assigned successfully'
]

// Failure
[
    'success' => false,
    'message' => 'User not found'
]
```

---

##### `addRole($userId, $roleId)`
Add a single role to user without removing existing roles.

**Parameters:**
- `$userId` (string): User UUID
- `$roleId` (string): Role UUID

**Returns:**
```php
// Success
[
    'success' => true,
    'user' => User,
    'message' => 'Role added successfully'
]

// Failure
[
    'success' => false,
    'message' => 'User not found' | 'Role not found'
]
```

---

##### `removeRole($userId, $roleId)`
Remove a specific role from user.

**Parameters:**
- `$userId` (string): User UUID
- `$roleId` (string): Role UUID

**Returns:**
```php
// Success
[
    'success' => true,
    'user' => User,
    'message' => 'Role removed successfully'
]

// Failure
[
    'success' => false,
    'message' => 'User not found'
]
```

---

## Error Responses

### Standard Error Format
All error responses follow this structure:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Flow

1. **Register** or use existing credentials
2. **Login** to receive JWT token
3. Include token in `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
4. Token expires after 12 hours
5. **Logout** (client discards token)

---

## Testing Endpoints

### Default Admin Credentials
```
Email: admin@example.com
Password: admin123
```

### Example cURL Requests

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Profile (with JWT):**
```bash
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get All Users:**
```bash
curl -X GET http://localhost:8000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Schema

### Tables

#### users
- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `email` (VARCHAR 255, Unique)
- `password` (VARCHAR 255, Hashed)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### roles
- `id` (UUID, Primary Key)
- `name` (VARCHAR 100, Unique)
- `label` (VARCHAR 255, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### role_users (Pivot Table)
- `id` (Auto Increment)
- `user_id` (UUID, Foreign Key → users.id)
- `role_id` (UUID, Foreign Key → roles.id)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Unique constraint on `(user_id, role_id)`

#### members
- `id` (UUID, Primary Key)
- `nama` (VARCHAR 255)
- `email` (VARCHAR 255, Unique)
- `password` (VARCHAR 255, Hashed)
- `no_hp` (VARCHAR 20, Nullable)
- `alamat` (TEXT, Nullable)
- `kota` (VARCHAR 100, Nullable)
- `provinsi` (VARCHAR 100, Nullable)
- `kode_pos` (VARCHAR 10, Nullable)
- `is_active` (BOOLEAN, Default: true)
- `last_login` (TIMESTAMP, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### kategori
- `id` (UUID, Primary Key)
- `nama_kategori` (VARCHAR 100, Unique)
- `deskripsi` (TEXT, Nullable)
- `url_foto` (VARCHAR 255, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### foto
- `id` (UUID, Primary Key)
- `id_kategori` (UUID, Foreign Key → kategori.id)
- `judul` (VARCHAR 255)
- `deskripsi` (TEXT, Nullable)
- `file_path` (VARCHAR 500)
- `url_foto` (VARCHAR 500)
- `file_size` (INTEGER)
- `mime_type` (VARCHAR 100)
- `harga` (DECIMAL 12,2)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### paket_rental
- `id` (UUID, Primary Key)
- `nama_paket` (VARCHAR 200)
- `durasi_hari` (INTEGER)
- `harga` (DECIMAL 12,2)
- `deskripsi` (TEXT, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### rental
- `id` (UUID, Primary Key)
- `id_member` (UUID, Foreign Key → members.id, CASCADE)
- `id_paket_rental` (UUID, Foreign Key → paket_rental.id, CASCADE)
- `harga` (DECIMAL 12,2)
- `status` (VARCHAR 50, Default: 'active')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Index on `(id_member, status)`

#### rental_foto (Pivot Table)
- `id` (UUID, Primary Key)
- `id_rental` (UUID, Foreign Key → rental.id, CASCADE)
- `id_foto` (UUID, Foreign Key → foto.id, CASCADE)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Unique constraint on `(id_rental, id_foto)`

#### sale_orders (E-Commerce Order Header)
- `id` (UUID, Primary Key)
- `id_member` (UUID, Foreign Key → members.id, SET NULL, Nullable)
- `tanggal` (DATE)
- `nama_pembeli` (VARCHAR 255)
- `alamat` (TEXT)
- `no_hp` (VARCHAR 20)
- `email` (VARCHAR 255, Nullable)
- `total` (DECIMAL 15,2, Default: 0)
- `status` (VARCHAR 50, Default: 'pending')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Index on `(tanggal, status)`
- Index on `status`
- Index on `id_member`
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Index on `(tanggal, status)`
- Index on `status`

#### sale_order_lines (E-Commerce Order Items)
- `id` (UUID, Primary Key)
- `sale_order_id` (UUID, Foreign Key → sale_orders.id, CASCADE)
- `id_foto` (UUID, Foreign Key → foto.id, RESTRICT)
- `nama_foto` (VARCHAR 255)
- `harga` (DECIMAL 12,2)
- `qty` (INTEGER, Default: 1)
- `subtotal` (DECIMAL 15,2)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Foreign key on `sale_order_id` (CASCADE)
- Foreign key on `id_foto` (RESTRICT - prevent photo deletion if used in orders)
- Index on `sale_order_id`
- Index on `id_foto`

#### download
- `id` (UUID, Primary Key)
- `id_user` (UUID, Foreign Key → users.id)
- `id_foto` (UUID, Foreign Key → foto.id)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

---

## Environment Variables

Required in `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_secret_key_here

# Database Configuration
DB_DRIVER=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=foto_project
DB_USERNAME=openpg
DB_PASSWORD=openpgpwd
DB_CHARSET=utf8
DB_SCHEMA=public

# Application Configuration
APP_ENV=development
APP_DEBUG=true
APP_TZ=Asia/Jakarta
```

---

## Notes

1. **UUID Primary Keys**: All IDs use UUID v4 format
2. **Password Security**: Passwords are hashed using PHP's `password_hash()` with `PASSWORD_DEFAULT`
3. **JWT Expiration**: Tokens expire after 12 hours
4. **Role Assignment**: Users can have multiple roles (many-to-many relationship)
5. **Cascade Deletion**: 
   - Deleting a user removes all role assignments from pivot table
   - Deleting a member removes all related rentals and sale orders
   - Deleting a rental removes all rental_foto associations
   - Deleting a sale order removes all line items (CASCADE)
6. **Member vs User**: 
   - `users` table for admin/system users
   - `members` table for customers/clients
   - `rental` uses `id_member` (not `id_user`)
7. **Status Values**:
   - Rental status: `active`, `completed`, `cancelled`
   - Sale Order status: `pending`, `paid`, `completed`, `cancelled`

---

**Last Updated:** January 13, 2026  
**Version:** 2.0.0
