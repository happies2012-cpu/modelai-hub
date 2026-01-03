/**
 * SEO utilities for meta tags, schema markup, and OG tags
 */

import { useEffect } from 'react';

export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    schema?: Record<string, any>;
}

const defaultSEO = {
    title: 'Premium Digital Platform - Join Today',
    description: 'Join our exclusive platform with premium features, AI-powered assistance, and access to paid communities.',
    keywords: 'premium platform, subscription, AI chatbot, community access',
    image: '/og-image.jpg',
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'website' as const,
};

/**
 * SEO Hook for pages
 */
export const useSEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    schema,
}: SEOProps) => {
    useEffect(() => {
        const seo = {
            title: title ? `${title} | ${defaultSEO.title.split(' - ')[0]}` : defaultSEO.title,
            description: description || defaultSEO.description,
            keywords: keywords || defaultSEO.keywords,
            image: image || defaultSEO.image,
            url: url || defaultSEO.url,
            type: type || defaultSEO.type,
            author,
            publishedTime,
            modifiedTime,
        };

        const fullImageUrl = seo.image.startsWith('http')
            ? seo.image
            : `${window.location.origin}${seo.image}`;

        const fullUrl = seo.url.startsWith('http')
            ? seo.url
            : `${window.location.origin}${seo.url}`;

        // Update document title
        document.title = seo.title;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string, property = false) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let meta = document.querySelector(selector) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMetaTag('title', seo.title);
        updateMetaTag('description', seo.description);
        updateMetaTag('keywords', seo.keywords);
        if (author) updateMetaTag('author', author);

        // Open Graph
        updateMetaTag('og:type', seo.type, true);
        updateMetaTag('og:url', fullUrl, true);
        updateMetaTag('og:title', seo.title, true);
        updateMetaTag('og:description', seo.description, true);
        updateMetaTag('og:image', fullImageUrl, true);

        // Twitter
        updateMetaTag('twitter:card', 'summary_large_image', true);
        updateMetaTag('twitter:url', fullUrl, true);
        updateMetaTag('twitter:title', seo.title, true);
        updateMetaTag('twitter:description', seo.description, true);
        updateMetaTag('twitter:image', fullImageUrl, true);

        // Article specific
        if (seo.type === 'article') {
            if (author) updateMetaTag('article:author', author, true);
            if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
            if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
        }

        // Schema.org JSON-LD
        if (schema) {
            let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(schema);
        }
    }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, schema]);
};

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = (name: string, url: string, logo?: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logo ? `${url}${logo}` : undefined,
});

/**
 * Generate WebSite schema
 */
export const generateWebSiteSchema = (name: string, url: string, description?: string) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
});

/**
 * Generate Article schema
 */
export const generateArticleSchema = (
    headline: string,
    description: string,
    image: string,
    datePublished: string,
    dateModified?: string,
    author?: string
) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: author ? {
        '@type': 'Person',
        name: author,
    } : undefined,
});

/**
 * Generate Product schema for pricing
 */
export const generateProductSchema = (
    name: string,
    description: string,
    price: number,
    currency: string = 'INR'
) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
    },
});

