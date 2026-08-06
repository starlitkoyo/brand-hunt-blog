/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 本番では Amazon から許可された商品画像ホストのみを許可する。
    // 追加が必要になったら公式資料で確認したホストだけを足すこと。
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
    ],
  },
};

export default nextConfig;
