/**
 * Cloudflare Pages / Workers — Custom 404 Handler
 * 
 * Перехватывает все 404-ответы и подставляет содержимое /404.html
 * с правильным HTTP 404 статусом. Это нужно потому что Workers
 * не имеют автоматического 404.html fallback (как Pages).
 * 
 * Все остальные запросы (CSS, JS, картинки, главная) проходят
 * без изменений через env.ASSETS.
 */
export default {
  async fetch(request, env, ctx) {
    // Передаём запрос ассетам Pages/Workers (статические файлы)
    const response = await env.ASSETS.fetch(request);

    // Если файл не найден (404) — подменяем тело на /404.html
    if (response.status === 404) {
      const url = new URL(request.url);
      const fallbackUrl = new URL('/404.html', url.origin);
      const fallback = await env.ASSETS.fetch(new Request(fallbackUrl.toString()));

      if (fallback.ok) {
        // Получаем тело 404.html и возвращаем с корректным HTTP 404 кодом
        const body = await fallback.text();
        return new Response(body, {
          status: 404,
          statusText: 'Not Found',
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        });
      }
    }

    return response;
  },
};
