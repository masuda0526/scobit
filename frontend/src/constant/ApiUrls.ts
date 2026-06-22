// console.log(import.meta.env);

// 開発環境
// export const ADMIN_BASE_URL = 'https://jxopq2bd8d.execute-api.ap-northeast-1.amazonaws.com/stage/';
// export const PUBLIC_BASE_URL = 'https://thfw50i46k.execute-api.ap-northeast-1.amazonaws.com/stage/';

// 本番環境
// export const ADMIN_BASE_URL = 'https://hd5zea86xa.execute-api.ap-northeast-1.amazonaws.com/product/';
// export const PUBLIC_BASE_URL = 'https://njbugg1fnh.execute-api.ap-northeast-1.amazonaws.com/product/'
export const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;
export const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;