import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/sign-in/[[...sign-in]]", "/sign-up/[[...sign-up]]"];

export default authMiddleware({
  publicRoutes,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
</xai:function_call name="write">
<parameter name="path">recipe-book/src/app/sign-in/page.tsx