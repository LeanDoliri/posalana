import { lucia } from "./auth.js";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		context.locals.user = null;
		context.locals.session = null;
	} else {
		const { session, user } = await lucia.validateSession(sessionId);
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		context.locals.session = session;
		context.locals.user = user;
	}

	const response = await next();
	
	// Disable caching for HTML pages so that state mutations are immediately visible
	if (response.headers.get("content-type")?.includes("text/html")) {
		response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");
	}
	
	return response;
});
