export const isDev = process.env.NODE_ENV === 'development';
export const imageUrl = isDev ? 'http://localhost:8080/uploads/' : 'http://localhost:8080/uploads/'