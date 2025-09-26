export default function imageLoader({ src, width, quality }) {
  // Handle external URLs (like Unsplash)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Handle local images with base path
  const basePath = process.env.NODE_ENV === 'production' ? '/tourismo' : '';
  return `${basePath}${src}?w=${width}&q=${quality || 75}`;
}
