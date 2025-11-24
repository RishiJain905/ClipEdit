# ClipEdit Frontend Specification

**Purpose**: Define the components, pages, and hooks your dashboard needs to build for seamless integration with the backend API.

---

## 1. PROJECT STRUCTURE

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx              (already exists - integrate API)
│   └── signup/
│       └── page.tsx              (already exists - integrate API)
├── dashboard/
│   ├── layout.tsx                ⭐ NEW - Protected layout
│   ├── page.tsx                  ⭐ NEW - Project list/dashboard
│   └── [projectId]/
│       ├── layout.tsx            ⭐ NEW - Project detail layout
│       ├── page.tsx              ⭐ NEW - Project detail view
│       └── editor/
│           └── page.tsx          ⭐ NEW - Video editor (future)
├── page.tsx                      (landing page - already done)
├── layout.tsx                    (root layout - already done)
└── globals.css                   (already done)

lib/
├── auth.ts                       ⭐ NEW - Auth context & hooks
├── api.ts                        ⭐ NEW - API client functions
└── utils.ts                      (already exists)

hooks/
├── useAuth.ts                    ⭐ NEW - Authentication hook
├── useProjects.ts                ⭐ NEW - Projects data hook
└── useUpload.ts                  ⭐ NEW - Video upload hook

components/
├── dashboard/
│   ├── ProjectCard.tsx           ⭐ NEW - Single project display
│   ├── ProjectList.tsx           ⭐ NEW - Grid of projects
│   ├── UploadModal.tsx           ⭐ NEW - Video upload modal
│   ├── StatusBadge.tsx           ⭐ NEW - Status indicator
│   └── ProtectedRoute.tsx        ⭐ NEW - Route protection wrapper
└── (existing UI components)
```

---

## 2. CORE HOOKS (Must Implement)

### Hook 1: `useAuth()` - Authentication State
**Location:** `lib/auth.ts` or `hooks/useAuth.ts`

```typescript
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (get token from localStorage)
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }

    // Fetch current user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        setError(err.message)
        localStorage.removeItem('access_token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  return { user, loading, error }
}
```

**Usage in Dashboard:**
```typescript
export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return null // Protected route will redirect

  return <div>Welcome, {user.full_name}!</div>
}
```

---

### Hook 2: `useProjects()` - Fetch User's Projects
**Location:** `hooks/useProjects.ts`

```typescript
import { useState, useEffect } from 'react'

export const useProjects = (options = {}) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchProjects = async (limit = 20, offset = 0, status = null) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(status && { status })
      })

      const response = await fetch(`/api/projects?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch projects')

      const data = await response.json()
      setProjects(data.projects)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    total,
    refetch: fetchProjects
  }
}
```

**Usage:**
```typescript
const { projects, loading, refetch } = useProjects()

return (
  <div>
    {projects.map(p => (
      <ProjectCard key={p.id} project={p} />
    ))}
    <button onClick={() => refetch()}>Refresh</button>
  </div>
)
```

---

### Hook 3: `useUpload()` - Handle Video Upload
**Location:** `hooks/useUpload.ts`

```typescript
import { useState } from 'react'

export const useUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadVideo = async (file, projectId) => {
    setUploading(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('project_id', projectId)

      // Simulate progress for demo (real implementation uses XMLHttpRequest)
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      clearInterval(interval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Upload failed')
      }

      setProgress(100)
      const data = await response.json()
      return data

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadVideo, uploading, progress, error }
}
```

**Usage:**
```typescript
const { uploadVideo, uploading, progress } = useUpload()

const handleDrop = async (file) => {
  try {
    await uploadVideo(file, projectId)
    // Success - refresh projects
  } catch (err) {
    // Show error to user
  }
}
```

---

## 3. API CLIENT FUNCTIONS

**Location:** `lib/api.ts`

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// Auth
export const authAPI = {
  signup: (email: string, password: string, fullName: string) =>
    fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName })
    }).then(r => r.json()),

  login: (email: string, password: string) =>
    fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  logout: (token: string) =>
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
}

// Projects
export const projectsAPI = {
  list: (token: string, limit = 20, offset = 0) =>
    fetch(`${API_BASE}/api/projects?limit=${limit}&offset=${offset}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  get: (token: string, projectId: string) =>
    fetch(`${API_BASE}/api/projects/${projectId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  create: (token: string, title: string, description?: string) =>
    fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    }).then(r => r.json()),

  update: (token: string, projectId: string, title: string, description?: string) =>
    fetch(`${API_BASE}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    }).then(r => r.json()),

  delete: (token: string, projectId: string) =>
    fetch(`${API_BASE}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
}

// Captions
export const captionsAPI = {
  get: (token: string, projectId: string, language = 'en') =>
    fetch(`${API_BASE}/api/projects/${projectId}/captions?language=${language}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
}

// Thumbnails
export const thumbnailsAPI = {
  get: (token: string, projectId: string) =>
    fetch(`${API_BASE}/api/projects/${projectId}/thumbnails`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),

  select: (token: string, projectId: string, thumbnailId: string) =>
    fetch(`${API_BASE}/api/projects/${projectId}/thumbnails/${thumbnailId}/select`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
}
```

---

## 4. PROTECTED ROUTE COMPONENT

**Location:** `components/dashboard/ProtectedRoute.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

**Usage in layout:**
```typescript
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
```

---

## 5. DASHBOARD COMPONENTS

### Component 1: `ProjectCard.tsx` - Single Project Display

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Trash2, Clock } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    status: 'uploading' | 'processing' | 'ready' | 'exported'
    upload_progress: number
    processing_progress: number
    duration_seconds: number
    file_size_mb: number
    created_at: string
  }
  onDelete?: (projectId: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter()

  const statusColor = {
    uploading: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    exported: 'bg-purple-100 text-purple-800'
  }

  const statusLabel = {
    uploading: `Uploading (${project.upload_progress}%)`,
    processing: `Processing (${project.processing_progress}%)`,
    ready: 'Ready',
    exported: 'Exported'
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
      <div onClick={() => router.push(`/dashboard/${project.id}`)}>
        {/* Thumbnail area */}
        <div className="w-full aspect-video bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Play className="w-12 h-12 text-white opacity-50" />
        </div>

        {/* Project info */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* Status badge */}
        <Badge className={`${statusColor[project.status]} mb-3`}>
          {statusLabel[project.status]}
        </Badge>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(project.duration_seconds)}</span>
          </div>
          <span>{project.file_size_mb} MB</span>
        </div>

        {/* Progress bars if uploading/processing */}
        {project.status === 'uploading' && (
          <div className="mb-3">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${project.upload_progress}%` }}
              />
            </div>
          </div>
        )}

        {project.status === 'processing' && (
          <div className="mb-3">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${project.processing_progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {project.status === 'ready' && (
          <Button
            size="sm"
            onClick={() => router.push(`/dashboard/${project.id}/editor`)}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
          >
            Edit
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete?.(project.id)}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
```

---

### Component 2: `ProjectList.tsx` - Grid of Projects

```typescript
'use client'

import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  projects: any[]
  onDelete?: (projectId: string) => void
  loading?: boolean
}

export function ProjectList({ projects, onDelete, loading }: ProjectListProps) {
  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p className="mb-2">No projects yet</p>
        <p className="text-sm">Create your first project to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
```

---

### Component 3: `StatusBadge.tsx` - Status Indicator

```typescript
'use client'

import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'uploading' | 'processing' | 'ready' | 'exported'
  progress?: number
}

export function StatusBadge({ status, progress = 0 }: StatusBadgeProps) {
  const styles = {
    uploading: {
      variant: 'outline',
      icon: Loader2,
      label: `Uploading (${progress}%)`
    },
    processing: {
      variant: 'outline',
      icon: Loader2,
      label: `Processing (${progress}%)`
    },
    ready: {
      variant: 'default',
      icon: CheckCircle,
      label: 'Ready'
    },
    exported: {
      variant: 'default',
      icon: CheckCircle,
      label: 'Exported'
    }
  }

  const config = styles[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3 animate-spin" />
      {config.label}
    </Badge>
  )
}
```

---

### Component 4: `UploadModal.tsx` - Video Upload

```typescript
'use client'

import { useState } from 'react'
import { useUpload } from '@/hooks/useUpload'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onSuccess?: () => void
}

export function UploadModal({
  open,
  onOpenChange,
  projectId,
  onSuccess
}: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const { uploadVideo, uploading, progress, error } = useUpload()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      await handleUpload(files[0])
    }
  }

  const handleUpload = async (file: File) => {
    try {
      await uploadVideo(file, projectId)
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your video here
          </p>
          <p className="text-xs text-gray-500 mb-4">
            or
          </p>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="hidden"
            id="file-input"
          />
          <Button
            onClick={() => document.getElementById('file-input')?.click()}
            variant="outline"
          >
            Browse Files
          </Button>
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

---

## 6. DASHBOARD PAGES

### Page 1: `app/dashboard/page.tsx` - Main Dashboard

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { projectsAPI } from '@/lib/api'
import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute'
import { ProjectList } from '@/components/dashboard/ProjectList'
import { UploadModal } from '@/components/dashboard/UploadModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { projects, loading, refetch } = useProjects()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [newProjectId, setNewProjectId] = useState(null)
  const router = useRouter()

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const data = await projectsAPI.create(
        token,
        `New Project ${new Date().toLocaleDateString()}`
      )
      setNewProjectId(data.id)
      setUploadOpen(true)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Delete this project?')) return

    try {
      const token = localStorage.getItem('access_token')
      await projectsAPI.delete(token, projectId)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
              </div>
              <Button
                onClick={handleCreateProject}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <ProjectList
            projects={projects}
            onDelete={handleDeleteProject}
            loading={loading}
          />
        </div>

        {/* Upload Modal */}
        <UploadModal
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          projectId={newProjectId}
          onSuccess={() => {
            refetch()
            setNewProjectId(null)
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
```

---

### Page 2: `app/dashboard/[projectId]/page.tsx` - Project Detail

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { projectsAPI, captionsAPI, thumbnailsAPI } from '@/lib/api'
import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState(null)
  const [captions, setCaptions] = useState([])
  const [thumbnails, setThumbnails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token')

        // Fetch project details
        const projectData = await projectsAPI.get(token, projectId)
        setProject(projectData)

        // Fetch captions if ready
        if (projectData.status === 'ready' || projectData.status === 'exported') {
          const captionsData = await captionsAPI.get(token, projectId)
          setCaptions(captionsData.captions || [])

          // Fetch thumbnails
          const thumbnailsData = await thumbnailsAPI.get(token, projectId)
          setThumbnails(thumbnailsData.thumbnails || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  if (loading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <StatusBadge
            status={project.status}
            progress={project.status === 'processing' ? project.processing_progress : project.upload_progress}
          />
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Duration</div>
            <div className="text-2xl font-bold">{Math.floor(project.duration_seconds / 60)}m</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">File Size</div>
            <div className="text-2xl font-bold">{project.file_size_mb} MB</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Created</div>
            <div className="text-lg font-bold">{new Date(project.created_at).toLocaleDateString()}</div>
          </Card>
        </div>

        {/* Video Player */}
        {project.processed_video_url && (
          <Card className="mb-8 p-6">
            <h2 className="font-bold mb-4">Video Preview</h2>
            <video
              src={project.processed_video_url}
              controls
              className="w-full rounded-lg"
            />
          </Card>
        )}

        {/* Captions */}
        {captions.length > 0 && (
          <Card className="mb-8 p-6">
            <h2 className="font-bold mb-4">Captions ({captions.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {captions.map(caption => (
                <div key={caption.id} className="border-l-4 border-violet-500 pl-3">
                  <div className="text-xs text-gray-500">
                    {caption.timestamp_start}s - {caption.timestamp_end}s
                  </div>
                  <div className="text-sm text-gray-900">{caption.text}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Thumbnails */}
        {thumbnails.length > 0 && (
          <Card className="p-6">
            <h2 className="font-bold mb-4">Thumbnails</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {thumbnails.map(thumb => (
                <div key={thumb.id} className="cursor-pointer group relative">
                  <img
                    src={thumb.image_url}
                    alt={`Thumbnail ${thumb.variant}`}
                    className="rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                  <Badge className="absolute top-2 right-2">
                    {thumb.variant}
                  </Badge>
                  {thumb.selected && (
                    <Badge className="absolute bottom-2 right-2 bg-green-600">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
```

---

## 7. AUTHENTICATION INTEGRATION

### Login Page Update (`app/(auth)/login/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(email, password)

      if (response.error) {
        setError(response.error.message || 'Login failed')
        return
      }

      // Store token
      localStorage.setItem('access_token', response.session.access_token)
      localStorage.setItem('refresh_token', response.session.refresh_token)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

---

## 8. ENVIRONMENT SETUP

### `.env.local` (Frontend)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 9. IMPLEMENTATION CHECKLIST

- [ ] Create `lib/auth.ts` and `lib/api.ts`
- [ ] Create `hooks/useAuth.ts`, `hooks/useProjects.ts`, `hooks/useUpload.ts`
- [ ] Create `components/dashboard/ProtectedRoute.tsx`
- [ ] Create `components/dashboard/ProjectCard.tsx`
- [ ] Create `components/dashboard/ProjectList.tsx`
- [ ] Create `components/dashboard/StatusBadge.tsx`
- [ ] Create `components/dashboard/UploadModal.tsx`
- [ ] Update `app/(auth)/login/page.tsx` to use API
- [ ] Update `app/(auth)/signup/page.tsx` to use API
- [ ] Create `app/dashboard/layout.tsx` with ProtectedRoute
- [ ] Create `app/dashboard/page.tsx` (main dashboard)
- [ ] Create `app/dashboard/[projectId]/page.tsx` (project detail)
- [ ] Test login → dashboard flow
- [ ] Test project creation
- [ ] Test video upload
- [ ] Test project deletion

---

## 10. KEY INTEGRATION POINTS

**What the Backend will send:**
```typescript
// GET /api/projects response
{
  projects: [
    {
      id: "uuid",
      title: "string",
      status: "uploading" | "processing" | "ready" | "exported",
      upload_progress: 0-100,
      processing_progress: 0-100,
      duration_seconds: number,
      file_size_mb: number,
      created_at: "2025-11-24T10:30:00Z"
    }
  ],
  total: number
}
```

**What the Frontend expects in localStorage:**
```
access_token: "jwt_token_from_login_response"
refresh_token: "refresh_token_from_login_response"
```

**What the Frontend sends with every API request:**
```
Authorization: Bearer {access_token}
```

---

## 11. COMMON PITFALLS TO AVOID

1. **Forgetting Authorization header** - All requests need `Authorization: Bearer {token}`
2. **Not storing token after login** - Save to localStorage so you can use it later
3. **Not checking token expiration** - Add token refresh logic
4. **Not handling 401 errors** - When token expires, redirect to login
5. **Not showing loading states** - Users need to know something is happening
6. **Not handling network errors** - Always show error messages to users

---

## Ready to Build! 🚀

Follow this spec exactly, use the components as templates, and you'll integrate perfectly with the backend!
