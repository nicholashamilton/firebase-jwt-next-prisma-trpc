/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "@/server/lib/prisma";

import { adminAuth } from '@/server/lib/firebaseAdmin';

type CreateContextOptions = {
    user: DecodedIdToken | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
    return {
        user: _opts.user,
        prisma,
    };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async(_opts: CreateNextContextOptions) => {

    const user = await getUserFromHeader(_opts);

    return createInnerTRPCContext({
        user,
    });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public procedure
 */
export const publicProcedure = t.procedure;

/**
 * Middleware to enforce a user is authenticated
 */
const isAuthed = t.middleware((opts) => {
    const { ctx } = opts;
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in.', });
    return opts.next({
        ctx: { user: ctx.user },
    });
});
const isAuthedWithUserAccount = t.middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in.', });
    const userAccount = await ctx.prisma.userAccount.findUnique({ where: { uid: ctx.user.uid } });
    if (!userAccount) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in.', });
    return opts.next({
        ctx: {
            user: ctx.user,
            userAccount,
        },
    });
});

/**
 * Protected user procedure
 */
export const protectedUserProcedure = t.procedure.use(isAuthed);

/**
 * Protected user procedure with account
 */
export const protectedUserWithAccountProcedure = t.procedure.use(isAuthedWithUserAccount);

/**
 * Middleware to enforce a user is an admin
 */
const isAdmin = t.middleware((opts) => {
    const { ctx } = opts;
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in.', });
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'UNAUTHORIZED' });
    return opts.next({
        ctx: {
            user: ctx.user,
        },
    });
});

/**
 * Protected admin user procedure
 */
export const protectedAdminProcedure = t.procedure.use(isAdmin);

/**
 * Gets user from authorization header
 */
async function getUserFromHeader(_opts: CreateNextContextOptions) {
    const authorization = _opts.req.headers.authorization;
    if (!authorization) return null;

    const token = authorization.split(' ')[1];
    if (!token) return null;

    const decodedIdToken = await adminAuth.verifyIdToken(token);
    if (!decodedIdToken) return null;

    return decodedIdToken;
}