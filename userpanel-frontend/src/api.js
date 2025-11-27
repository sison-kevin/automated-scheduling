const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost/userpanel-event/userpanel-backend/'

const apiClient = {
  async request(path, options = {}) {
    const url = API_BASE + path
    const config = {
      credentials: 'include',
      ...options
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers
      }
    } else {
      config.headers = {
        Accept: 'application/json',
        ...options.headers
      }
      // Remove Content-Type if it was set for FormData
      if (config.headers['Content-Type']) {
        delete config.headers['Content-Type']
      }
    }
    
    const res = await fetch(url, config)
    const ct = res.headers.get('content-type') || ''
    
    if (!res.ok) {
      // Try to extract JSON, otherwise get text and include snippet for debugging
      if (ct.includes('application/json')) {
        try {
          const errorObj = await res.json()
          throw new Error(errorObj.message || JSON.stringify(errorObj));
        } catch (e) {
          const txt = await res.text();
          const snippet = txt.slice(0, 320);
          throw new Error(`Server returned invalid JSON: ${snippet}`);
        }
      } else {
        const txt = await res.text();
        const snippet = txt.slice(0, 320);
        throw new Error(`Server error ${res.status}: ${snippet}`);
      }
    }

    if (ct.includes('application/json')) {
      try {
        return await res.json()
      } catch (e) {
        // JSON parsing failed despite content-type; return helpful message with body snippet
        const txt = await res.text();
        const snippet = txt.slice(0, 320);
        throw new Error(`Invalid JSON response from server: ${snippet}`);
      }
    }

    return res.text()
  },

  get(path) {
    return this.request(path, { method: 'GET' })
  },

  post(path, body) {
    const options = {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }
    return this.request(path, options)
  },

  put(path, body) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  },

  delete(path) {
    return this.request(path, { method: 'DELETE' })
  }
}

export const get = apiClient.get.bind(apiClient)
export const post = apiClient.post.bind(apiClient)
export const put = apiClient.put.bind(apiClient)
export const del = apiClient.delete.bind(apiClient)
export default apiClient
