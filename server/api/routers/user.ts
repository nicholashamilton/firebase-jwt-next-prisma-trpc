import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({

    /*
     * Get Public Profile
     */
    getPublicProfile: publicProcedure
        .input(z.object({
            username: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            const { username } = input;

            const user = await ctx.prisma.userAccount.findUnique({
                where: { username },
                include: {
                    _count: {
                        select: {
                            posts: true,
                        },
                    },
                },
            });

            if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

            return {
                user: {
                    username: user.username,
                    postsCount: user._count.posts,
                },
            };
        }),
});
