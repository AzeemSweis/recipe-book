import { clerkMiddleware } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/sign-in/[[...sign-in]]", "/sign-up/[[...sign-up]]"];

export default clerkMiddleware({
  publicRoutes,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};