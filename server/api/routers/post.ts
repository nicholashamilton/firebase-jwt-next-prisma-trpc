import { z } from "zod";

import { createTRPCRouter, protectedUserProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({

    /*
     * Get All Posts
     */
    getAllPosts: publicProcedure
        .query(async ({ ctx }) => {

            const posts = await ctx.prisma.post.findMany({
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
            });

            return {
                posts,
            };
        }),

    /*
     * Add Post
     */
    addPost: protectedUserProcedure
        .input(z.object({
            title: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const fireUser = ctx.user;
            if (!fireUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

            const user = await ctx.prisma.userAccount.findUnique({ where: { uid: fireUser.uid } });
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

            const { title } = input;

            const post = await ctx.prisma.post.create({
                data: {
                    ownerId: user.id,
                    title,
                },
            });

            return {
                post,
            }
        }),
});
