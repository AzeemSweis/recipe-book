import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/sign-in/[[...sign-in]]", "/sign-up/[[...sign-up]]"];

export default authMiddleware({
  publicRoutes,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};