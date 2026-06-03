import axios from "axios"
import { AboutPageData } from './types';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api` || "http://localhost:4321/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Интерцептор для добавления токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Collection {
  id: number
  name: string
  description: string
  featuredProductId: number
  products: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  videos: string[]
  images: string[]
  collection: Collection 
  color: Color
  density: string
  type: string
  resistance: string
  width: string
}

export interface Color {
  id: number
  name: string
  colorCode: string
}

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  message: string
}

type FabricPayload = {
  id?: number; // Optional for create, required for update
  name: string;
  description?: string;
  collection: number;
  type: string;
  density: string;
  resistance: string;
  width: string;
  images?: string[] ;
  videos?: string[];
};


// API методы
export const categoryAPI = {
  getAll: () => api.get<Collection[]>("/collections"),
  getById: (id: number) => api.get<Collection>(`/collections/${id}`),
  create: (data: Partial<Collection>) => api.post<Collection>("/collections", data),
  update: (id: number, data: Partial<Collection>) => api.put<Collection>(`/collections/${id}`, data),
  delete: (id: number) => api.delete(`/collections/${id}`),
}

export const fabricAPI = {
  getAll: () => api.get<Product[]>("/products"),
  getByCategory: (categoryId: number) =>
    api.get<Product[]>(`/products/category/${categoryId}`),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: FabricPayload) => api.post<Product>("/products", data),
  update: (id: number, data: FabricPayload) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  uploadImages: async (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file, file.name);
    });
    console.log(formData);
    const response = await api.post(`/products/${id}/upload/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  },
  uploadVideos: async (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file, file.name);
    });
    const response = await api.post(`/products/${id}/upload/videos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  },
  downloadImages: (filename: string) => api.get(`products/images/${filename}`),
  deleteImage: (id: number, filename: string) =>
    api.delete(`/products/${id}/images`, { data: { filename } }),
  deleteVideo: (id: number, filename: string) =>
    api.delete(`/products/${id}/videos`, { data: { filename } }),
};

export const colorAPI = {
  addColor: (colorData: Partial<Color>) =>
    api.post<Color>(`/colors`, colorData),
  getAll: () => api.get<Color[]>("/colors"),
}

// export const contactAPI = {
//   send: (data: ContactMessage) => api.post("/contact", data),
//   getAll: () => api.get("/contact"),
//   markAsRead: (id: number) => api.put(`/contact/${id}/read`),
// }

export const adminAPI = {
  login: (credentials: { login: string; password: string }) => api.post("/admin/login", credentials),
  changePassword: (data: {password: string}) => api.put("/users", data)
}




export const aboutAPI = {
  getPage: () => api.get<AboutPageData>("/about-page"),
  updatePage: (data: AboutPageData) => api.put<AboutPageData>(`about-page`, data),


  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/about-page/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Ошибка загрузки файла");
    const data = await res.json();
    return data.url;
  },
};

export const contactAPI = {
  getPage: async () => {
    const response = await api.get('/contact-page');
    return response.data;
  },
  updatePage: async (data: Record<string, any>) => {
    const response = await api.put('/contact-page', data);
    return response.data;
  },
  send: async (formData: { name: string; email: string; phone?: string; message: string }) => {
    // Для формы обратной связи, если нужно отправлять сообщения на сервер
    const response = await api.post('/feedback', formData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },
  delete: (id:number) => api.delete(`/feedback/${id}`),
  resend: (id: number) => api.patch(`/feedback/${id}/resend`),
    // Email для пересылки
  getEmail: () => api.get('/settings/contact-email'),
  updateEmail: (email: string) => api.put('/settings/contact-email', { contact_email: email }),
  deleteEmail: () => api.delete('/settings/contact-email'),
  createEmail: (email: string) => api.post('/settings/contact-email', { contact_email: email }),


};

export const homePageAPI = {
  getPage: async () => {
    const response = await api.get("/home-page");
    return response.data;
  },
  updateHeroAndAdvantages: async (data: {
    heroTitle: string;
    heroSubtitle: string;
    heroVideo: string;
    advantages: { title: string; description: string; icon: string }[];
  }) => {
    const response = await api.put("/home-page", data);
    return response.data;
  },
  updateCollections: async (collectionIds: number[]) => {
    const response = await api.put("/home-page/popular-collections", {
      collectionIds,
    });
    return response.data;
  },
  uploadVideo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/home-page/upload-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url; // возвращает путь к видео
  },
  deleteHeroVideo: async (): Promise<object> => {
    const response = await api.delete("/home-page/delete-video");
    return response.data
  }
};



export default api
