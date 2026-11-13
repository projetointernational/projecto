'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action: revalidateSiteAction
 *
 * Called whenever an admin saves or modifies content in the dashboard.
 * Purges the Next.js cache for the root layout and all public routes,
 * ensuring changes appear instantly on the frontend UI.
 */
export async function revalidateSiteAction() {
  try {
    // Purges cache for the root layout and all nested pages
    revalidatePath('/', 'layout');

    // Explicitly revalidate core public paths
    const paths = [
      '/',
      '/about',
      '/services',
      '/projects',
      '/contact',
      '/enquire',
    ];

    for (const path of paths) {
      revalidatePath(path);
    }

    // Dynamic segments
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/projects/[slug]', 'page');

    return { success: true };
  } catch (err) {
    console.error('[revalidateSiteAction] Failed to revalidate site:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown revalidation error',
    };
  }
}

