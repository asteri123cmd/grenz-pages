export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Получить запрашиваемый путь
    const pathname = url.pathname;
    
    // Список путей, которые НЕ должны обрабатываться как 404
    const excludePaths = [
      '/uploads/',
      '/css/',
      '/js/',
      '/icons/',
      '/favicon.svg',
      '/apple-touch-icon.svg',
      '/site.webmanifest',
      '/robots.txt',
      '/sitemap.xml'
    ];
    
    // Проверить, нужно ли исключить этот путь
    const shouldExclude = excludePaths.some(path => pathname.startsWith(path));
    
    // Попытаться получить запрашиваемый файл
    const response = await env.ASSETS.fetch(request);
    
    // Если файл найден или это исключенный путь, вернуть оригинальный ответ
    if (response.status !== 404 || shouldExclude) {
      return response;
    }
    
    // Если это 404, попытаться получить 404.html
    const notFoundRequest = new Request(new URL('/404.html', url), {
      method: 'GET'
    });
    
    const notFoundResponse = await env.ASSETS.fetch(notFoundRequest);
    
    // Вернуть 404.html с статусом 404
    if (notFoundResponse.status === 200) {
      return new Response(notFoundResponse.body, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });
    }
    
    // Если 404.html не найден, вернуть пустой 404
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
};
