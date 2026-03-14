import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Let API requests with Bearer auth through (iOS app uses Firebase JWT)
  if (isApiRoute(req) && req.headers.get("authorization")?.startsWith("Bearer ")) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
