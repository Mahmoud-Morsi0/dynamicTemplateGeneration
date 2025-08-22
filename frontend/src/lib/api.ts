import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized
        } else if (error.response?.status === 403) {
            // Handle forbidden
        } else if (error.response?.status >= 500) {
            // Handle server errors
        }
        return Promise.reject(error)
    }
)

export interface FieldSpec {
    key: string
    type: 'text' | 'number' | 'date' | 'select' | 'image' | 'array'
    label?: { en: string; ar: string }
    required?: boolean
    maxLength?: number
    min?: number
    max?: number
    step?: number
    options?: string[]
    default?: string | number
    constraints?: { width?: number; height?: number }
    itemShape?: Record<string, FieldSpec>
    format?: 'email'
}

export interface InspectResponse {
    success: boolean
    data: {
        templateId: string
        version: number
        fields: FieldSpec[]
    }
}

export interface RenderRequest {
    templateId?: string
    fileHash?: string
    data: Record<string, any>
}

// API functions
export const templatesApi = {
    inspect: async (file: File): Promise<InspectResponse> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/templates/inspect', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    render: async (request: RenderRequest): Promise<Blob> => {
        const response = await api.post('/templates/render/docx', request, {
            responseType: 'blob',
        })
        return response.data
    },

    getSpec: async (templateId: string, version?: number): Promise<InspectResponse> => {
        const params = version ? { version } : {}
        const response = await api.get(`/templates/${templateId}/spec`, { params })
        return response.data
    },
}
