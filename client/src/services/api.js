const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include HttpOnly cookies
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Facilities
  getFacilities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/facilities${query ? `?${query}` : ''}`);
  },
  getFacilityById: (id) => request(`/facilities/${id}`),
  createFacility: (body) => request('/facilities', { method: 'POST', body: JSON.stringify(body) }),
  updateFacility: (id, body) => request(`/facilities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleFacilityStatus: (id) => request(`/facilities/${id}/status`, { method: 'PATCH' }),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/doctors${query ? `?${query}` : ''}`);
  },
  getDoctorById: (id) => request(`/doctors/${id}`),
  getDoctorAvailability: (id, date) => request(`/doctors/${id}/availability?date=${date}`),
  createDoctor: (body) => request('/doctors', { method: 'POST', body: JSON.stringify(body) }),
  updateDoctor: (id, body) => request(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleDoctorStatus: (id) => request(`/doctors/${id}/status`, { method: 'PATCH' }),

  // Appointments
  bookAppointment: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  getMyAppointments: () => request('/appointments/my'),
  cancelAppointment: (id, reason) =>
    request(`/appointments/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  adminGetAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments/admin${query ? `?${query}` : ''}`);
  },
  adminUpdateAppointment: (id, body) =>
    request(`/appointments/admin/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Health Articles
  getArticles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/articles${query ? `?${query}` : ''}`);
  },
  getArticle: (identifier) => request(`/articles/${identifier}`),
  createArticle: (body) => request('/articles', { method: 'POST', body: JSON.stringify(body) }),
  updateArticle: (id, body) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleArticleStatus: (id) => request(`/articles/${id}/status`, { method: 'PATCH' }),

  // Ambulance
  getAmbulanceContacts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/ambulances${query ? `?${query}` : ''}`);
  },
  createAmbulanceContact: (body) => request('/ambulances', { method: 'POST', body: JSON.stringify(body) }),
  updateAmbulanceContact: (id, body) => request(`/ambulances/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleAmbulanceStatus: (id) => request(`/ambulances/${id}/status`, { method: 'PATCH' }),

  // Health check
  getHealth: () => request('/health'),
};
