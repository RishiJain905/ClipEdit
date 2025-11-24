# ClipEdit Backend Specification

**Purpose**: Define the data structure, database schema, and API endpoints for coordinated frontend/backend development.

---

## 1. USER DATA STRUCTURE

### User Profile (Supabase Auth Table Extension)

```typescript
interface User {
  // From Supabase Auth (auto-managed)
  id: string                    // UUID, unique user ID
  email: string                 // User email
  email_confirmed_at: Date      // When email was verified
  created_at: Date              // Account creation date
  updated_at: Date              // Last profile update

  // Custom fields (user_profiles table)
  full_name: string             // "John Doe"
  avatar_url?: string           // Profile picture URL
  bio?: string                  // Short bio
  subscription_tier: 'free' | 'creator' | 'pro'  // Current plan
  monthly_exports: number       // How many videos exported this month
  storage_used: number          // MB of storage used
  created_at: Date
  updated_at: Date
}
```

### Authentication

```typescript
// Login Response
interface AuthResponse {
  session: {
    access_token: string
    refresh_token: string
    expires_in: number
    user: User
  }
  error?: string
}
```

---

## 2. PROJECT/VIDEO SCHEMA

### Project (Main Container)

```typescript
interface Project {
  id: string                    // UUID
  user_id: string               // FK to users.id
  title: string                 // "Q4 Highlight Reel"
  description?: string          // Optional project description
  created_at: Date
  updated_at: Date
  
  // Status flow: 'uploading' → 'processing' → 'ready' → 'exported'
  status: 'uploading' | 'processing' | 'ready' | 'exported'
  
  // Progress tracking
  upload_progress: number       // 0-100%
  processing_progress: number   // 0-100% (for AI editing)
  
  // Storage info
  original_video_url: string    // URL to original video in storage
  processed_video_url?: string  // URL to edited video (after processing)
  file_size_mb: number
  duration_seconds: number      // Video length
  
  // AI Processing Results
  ai_results?: {
    captions: Caption[]
    suggested_cuts: Cut[]
    generated_thumbnails: Thumbnail[]
  }
}

interface Caption {
  id: string
  project_id: string
  timestamp_start: number       // Seconds
  timestamp_end: number
  text: string
  language: string              // 'en', 'es', 'fr', etc.
  confidence: number            // 0-1 accuracy score
}

interface Cut {
  id: string
  project_id: string
  timestamp_start: number
  timestamp_end: number
  reason: 'silence' | 'filler' | 'scene_change' | 'manual'
  confidence: number            // How confident AI is about this cut
}

interface Thumbnail {
  id: string
  project_id: string
  image_url: string
  variant: 'A' | 'B' | 'C' | 'D' | 'E'  // 5 variations
  ctr_estimate: number          // Estimated click-through rate
  selected: boolean             // User's chosen thumbnail
}
```

---

## 3. DATABASE TABLES (Supabase)

### Table: `users_profiles` (extends Supabase auth)

```sql
CREATE TABLE public.users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'creator', 'pro')) DEFAULT 'free',
  monthly_exports INTEGER DEFAULT 0,
  storage_used_mb BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `projects`

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users_profiles ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('uploading', 'processing', 'ready', 'exported')) DEFAULT 'uploading',
  upload_progress INTEGER DEFAULT 0,
  processing_progress INTEGER DEFAULT 0,
  original_video_url TEXT,
  processed_video_url TEXT,
  file_size_mb BIGINT,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for fast queries
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users_profiles(id)
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
```

### Table: `captions`

```sql
CREATE TABLE public.captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  timestamp_start FLOAT NOT NULL,
  timestamp_end FLOAT NOT NULL,
  text TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_captions_project_id ON public.captions(project_id);
```

### Table: `cuts`

```sql
CREATE TABLE public.cuts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  timestamp_start FLOAT NOT NULL,
  timestamp_end FLOAT NOT NULL,
  reason TEXT CHECK (reason IN ('silence', 'filler', 'scene_change', 'manual')),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cuts_project_id ON public.cuts(project_id);
```

### Table: `thumbnails`

```sql
CREATE TABLE public.thumbnails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  variant TEXT CHECK (variant IN ('A', 'B', 'C', 'D', 'E')),
  ctr_estimate FLOAT,
  selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_thumbnails_project_id ON public.thumbnails(project_id);
```

---

## 4. API ENDPOINTS

### Authentication Endpoints

#### `POST /api/auth/signup`
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "session": {
    "access_token": "jwt_token...",
    "refresh_token": "refresh_token...",
    "user": { ...user object... }
  }
}
```

---

#### `POST /api/auth/login`
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "session": {
    "access_token": "jwt_token...",
    "user": { ...user object... }
  }
}
```

---

#### `POST /api/auth/logout`
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Project Endpoints

#### `GET /api/projects`
**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)
- `status`: 'uploading' | 'processing' | 'ready' | 'exported' (optional filter)

**Response (200):**
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "My First Video",
      "status": "ready",
      "duration_seconds": 1200,
      "file_size_mb": 450,
      "upload_progress": 100,
      "processing_progress": 100,
      "created_at": "2025-11-24T10:30:00Z",
      "updated_at": "2025-11-24T10:35:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

---

#### `GET /api/projects/:id`
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": "uuid",
  "title": "My Video",
  "description": "Q4 highlights",
  "status": "ready",
  "duration_seconds": 1200,
  "file_size_mb": 450,
  "original_video_url": "https://...",
  "processed_video_url": "https://...",
  "created_at": "2025-11-24T10:30:00Z",
  "ai_results": {
    "captions": [...],
    "suggested_cuts": [...],
    "generated_thumbnails": [...]
  }
}
```

---

#### `POST /api/projects`
**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "title": "New Project",
  "description": "Optional description"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "New Project",
  "status": "uploading",
  "created_at": "2025-11-24T10:30:00Z"
}
```

---

#### `PUT /api/projects/:id`
**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "updated_at": "2025-11-24T10:35:00Z"
}
```

---

#### `DELETE /api/projects/:id`
**Headers:** `Authorization: Bearer {token}`

**Response (204):** No content

---

### Video Upload Endpoint

#### `POST /api/upload`
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body:**
```
- file: File (video)
- project_id: string (UUID)
```

**Response (200):**
```json
{
  "project_id": "uuid",
  "file_size_mb": 450,
  "duration_seconds": 1200,
  "upload_url": "https://...",
  "status": "uploaded"
}
```

---

#### `POST /api/upload/initiate-chunk`
**For large files, initiate chunked upload**

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "project_id": "uuid",
  "file_name": "video.mp4",
  "file_size_bytes": 500000000,
  "chunk_count": 10
}
```

**Response (200):**
```json
{
  "upload_session_id": "uuid",
  "chunk_urls": ["presigned_url_1", "presigned_url_2", ...]
}
```

---

#### `POST /api/upload/complete-chunk`
**Complete chunked upload**

**Body:**
```json
{
  "upload_session_id": "uuid",
  "project_id": "uuid"
}
```

**Response (200):**
```json
{
  "status": "processing",
  "message": "Video queued for AI processing"
}
```

---

### AI Processing Endpoints

#### `GET /api/projects/:id/captions`
**Get captions for a project**

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `language`: string (default: 'en')

**Response (200):**
```json
{
  "captions": [
    {
      "id": "uuid",
      "timestamp_start": 0,
      "timestamp_end": 5,
      "text": "Hello everyone",
      "language": "en",
      "confidence": 0.99
    }
  ]
}
```

---

#### `GET /api/projects/:id/thumbnails`
**Get generated thumbnails**

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "thumbnails": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "variant": "A",
      "ctr_estimate": 0.042,
      "selected": false
    },
    {
      "id": "uuid",
      "image_url": "https://...",
      "variant": "B",
      "ctr_estimate": 0.051,
      "selected": true
    }
  ]
}
```

---

#### `PUT /api/projects/:id/thumbnails/:thumbnail_id/select`
**Mark a thumbnail as selected**

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Thumbnail selected",
  "thumbnail_id": "uuid"
}
```

---

#### `POST /api/projects/:id/export`
**Trigger video export to YouTube/TikTok/Instagram**

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "platform": "youtube",
  "format": "16:9",
  "include_captions": true,
  "selected_thumbnail_id": "uuid"
}
```

**Response (200):**
```json
{
  "status": "exporting",
  "export_url": "https://...",
  "estimated_time_seconds": 180
}
```

---

## 5. RLS POLICIES (Row-Level Security)

All tables should have RLS enabled so users can only see their own data:

```sql
-- projects table
CREATE POLICY "Users can see their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 6. STORAGE BUCKETS (Supabase Storage)

### `videos` bucket
- Path: `/videos/{user_id}/{project_id}/original.mp4`
- Type: Private (requires auth)
- Max size: 5GB per file

### `processed-videos` bucket
- Path: `/processed-videos/{user_id}/{project_id}/edited.mp4`
- Type: Private (requires auth)

### `thumbnails` bucket
- Path: `/thumbnails/{user_id}/{project_id}/{variant}.jpg`
- Type: Private (requires auth)

---

## 7. ERROR RESPONSES

All errors follow this format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project not found",
    "status": 404
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401) - Missing/invalid token
- `FORBIDDEN` (403) - User doesn't own this resource
- `RESOURCE_NOT_FOUND` (404) - Project/file doesn't exist
- `VALIDATION_ERROR` (400) - Invalid input data
- `STORAGE_LIMIT_EXCEEDED` (413) - User exceeded storage quota
- `PROCESSING_ERROR` (500) - AI processing failed

---

## 8. RATE LIMITS

- **Upload**: 1 file per 10 seconds per user
- **API Calls**: 100 requests per minute per user
- **Processing**: 5 concurrent projects per user

---

## 9. FRONTEND INTEGRATION NOTES

### Auth Context (Frontend will need this)

```typescript
// The backend provides auth via Supabase
// Frontend creates a hook like:
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
  }, [])
  
  return { user, loading }
}
```

### Protected Routes

Frontend should check token before making requests:
```typescript
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 10. DEVELOPMENT CHECKLIST

### Backend 
- [ ] Supabase project created
- [ ] Auth setup (signup/login/logout)
- [ ] Database tables created with RLS
- [ ] Storage buckets configured
- [ ] Auth endpoints working
- [ ] Project CRUD endpoints
- [ ] Upload endpoint (with chunked support)
- [ ] Mock AI processing (returns dummy captions/thumbnails)
- [ ] Error handling middleware

### Frontend 
- [ ] Auth pages (login/signup) connected to `/api/auth/*`
- [ ] Dashboard layout created
- [ ] Project list view (`GET /api/projects`)
- [ ] Project detail view (`GET /api/projects/:id`)
- [ ] Upload UI with drag-and-drop (`POST /api/upload`)
- [ ] Project status indicator
- [ ] Delete project button
- [ ] Protected route wrapper

---

## 11. ENVIRONMENT VARIABLES

### Backend (.env.local)

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
OPENAI_API_KEY=xxxxx (for later)
```

### Frontend (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

---

## Ready to Build! 🚀

This spec is your shared contract. Use it as reference and update it if requirements change. Happy coding!
