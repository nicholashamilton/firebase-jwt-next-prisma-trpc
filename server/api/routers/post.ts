import { z } from "zod";
import { createTRPCRouter, protectedUserWithAccountProcedure, publicProcedure } from "@/server/api/trpc";

export const postsRouter = createTRPCRouter({

    /*
     * Get All Posts
     */
    getAllPosts: publicProcedure
        .query(async ({ ctx }) => {
            return {
                posts: await ctx.prisma.post.findMany({
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
                }),
            };
        }),

    /*
     * Add Post
     */
    addPost: protectedUserWithAccountProcedure
        .input(z.object({
            title: z.string(),
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
