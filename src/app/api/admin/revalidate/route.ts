/**
 * POST /api/admin/revalidate
 *
 * Called by admin pages after successfully saving content.
 * Immediately busts the ISR cache for all public pages so that
 * the next visitor receives fresh Supabase data without waiting
 * the full revalidate interval.
 *
 * Requires REVALIDATE_SECRET env var (optional but recommended).
 */

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServerSideClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Optional secret validation
    const secret = process.env.REVALIDATE_SECRET;
    if (secret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Verify the caller is an authenticated admin
    const supabase = await createServerSideClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate all public-facing pages
    const paths = [
      '/',
      '/about',
      '/services',
      '/projects',
      '/contact',
    ];

    for (const path of paths) {
      revalidatePath(path);
    }

    // Also revalidate dynamic segments
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/projects/[slug]', 'page');

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[revalidate] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
