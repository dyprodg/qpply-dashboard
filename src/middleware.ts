import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// The issue is here - needs to match both /sign-in and any external URLS
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/api(.*)',
  '/static(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Check for public routes including sign-in
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};