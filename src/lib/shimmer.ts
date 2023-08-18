export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="a">
            <stop stop-color="#333" offset="0%"/>
            <stop stop-color="#222" offset="30%"/>
            <stop stop-color="#111" offset="70%"/>
            <stop stop-color="#222" offset="85%"/>
            <stop stop-color="#333" offset="100%"/>
        </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#a)">
        <animate attributeName="x" repeatCount="indefinite" dur="1.5s" values="-${w};${w}" />
        <animate attributeName="width" repeatCount="indefinite" dur="1.5s" values="${w};${
  w * 2
}" />
    </rect>
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
