import { z } from "zod";
import { createTRPCRouter, protectedUserWithAccountProcedure, publicProcedure } from "@/server/api/trpc";

export const postsRouter = createTRPCRouter({

    /*
     * Get All Posts
     */
    getAllPosts: publicProcedure
        .input(z.object({
            sort: z.string().optional(),
            limit: z.number().min(1).max(50).nullish(),
            cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
            search: z.string().optional(),
        }))
        .query(async ({ ctx, input }) => {
            const { cursor, limit, search } = input;
            const takeLimit = limit ?? 40;
            const currentCursor = typeof cursor === 'number' ? cursor : undefined;

            const posts = await ctx.prisma.post.findMany({
                take: takeLimit + 1, // get an extra item at the end which we'll use as next cursor
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
                where: {
                    ...(search ? {
                        OR: [
                            { title: { contains: search } },
                        ],
                    } : {}),
                },
                cursor: typeof cursor === 'number' ? {
                    id: cursor,
                } : undefined,
            });

            let nextCursor: typeof currentCursor = undefined;
            if (posts.length > takeLimit) {
                const nextItem = posts.pop();
                nextCursor = nextItem!.id;
            }

            return {
                posts,
                nextCursor,
            };
        }),

    /*
     * Add Post
     */
    addPost: protectedUserWithAccountProcedure
        .input(z.object({
            title: z.string().min(2, {
                message: "Title must be at least 2 characters.",
            }),
        }))
        .mutation(async ({ ctx, input }) => {
            return {
                post: await ctx.prisma.post.create({
                    data: {
                        ownerId: ctx.userAccount.id,
                        title: input.title,
                    },
                }),
            };
        }),
});
