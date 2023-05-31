import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
                            postedSpots: true,
                            followers: true,
                            following: true,
                        },
                    },
                },
            });

            if (!user) {
                return {
                    message: 'User not found',
                };
            }

            return {
                user: {
                    username: user.username,
                    profileImage: user.profileImage,
                    spotsCount: user._count.postedSpots,
                    followersCount: user._count.followers,
                    followingCount: user._count.following,
                },
            };
        }),
});
