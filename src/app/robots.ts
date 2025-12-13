import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://calcbz.com'; // Update with actual domain

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/private/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
