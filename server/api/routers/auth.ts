import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedUserProcedure } from "@/server/api/trpc";
import { adminAuth } from '@/server/lib/firebaseAdmin';
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { prisma } from "@/server/lib/prisma";
import { UserAccount } from "@prisma/client";

type MessageType = 'default' | 'error' | 'info' | 'success' | 'warning';

enum UserRole {
    admin = 'admin',
    user = 'user',
};

export const authRouter = createTRPCRouter({

    /*
     * Sign Up
     */
    signUp: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string(),
            username: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {

            const signUpRes: {
                user?: UserRecord;
                token?: string;
                message: string;
                messageType: MessageType;
            } = {
                message: 'There was an issue creating the user',
                messageType: 'default',
            };

            // Username Verification
            const { errorMessage, messageType } = await verifyNewUsername(input.username);
            if (errorMessage) {
                signUpRes.message = errorMessage;
                signUpRes.messageType = messageType;
                return signUpRes;
            }

            // Create Firebase User
            try {
                const newFireUser = await adminAuth.createUser({
                    email: input.email,
                    password: input.password,
                    displayName: input.username,
                });

                signUpRes.user = newFireUser;

                await adminAuth.setCustomUserClaims(newFireUser.uid, {
                    role: UserRole.user,
                });

                signUpRes.token = await adminAuth.createCustomToken(newFireUser.uid);
            }
            catch (error) {
                if (signUpRes.user) await adminAuth.deleteUser(signUpRes.user.uid);
                signUpRes.message = error instanceof Error ? error.message : 'Unknown error occurred while creating user';
                return signUpRes;
            }

            // Create Prisma User
            try {
                await ctx.prisma.userAccount.create({
                    data: {
                        uid: signUpRes.user.uid,
                        email: input.email,
                        username: input.username,
                        role: UserRole.user,
                    },
                });
            }
            catch (error) {
                await adminAuth.deleteUser(signUpRes.user.uid);
                signUpRes.message = 'Unknown error occurred while creating user';
                signUpRes.messageType = 'error';
                return signUpRes;
            }

            // Success
            signUpRes.message = 'Account created';
            signUpRes.messageType = 'success';

            return signUpRes;
        }),

        /*
         * Get Profile
         */
        getProfile: protectedUserProcedure
            .query(async ({ ctx }) => {
                const user = await ctx.prisma.userAccount.findUnique({
                    where: { uid: ctx.user?.uid ?? '' },
                });
                return user;
            }),

        /*
         * Update Profile
         */
       updateProfile: protectedUserProcedure
            .input(z.object({
                email: z.string(),
                username: z.string(),
            }))
            .mutation(async ({ ctx, input }) => {

                const updateProfileRes: {
                    profile: UserAccount | null,
                    user?: UserRecord;
                    token?: string;
                    message: string;
                    messageType: MessageType;
                } = {
                    profile: null,
                    message: 'There was an issue creating the user',
                    messageType: 'default',
                };

                const fireUser = await adminAuth.getUser(ctx.user?.uid ?? '');
                const fireUserDisplayName = fireUser.displayName ?? '';

                // Username Verification
                if (input.username !== fireUserDisplayName) {
                    const { errorMessage, messageType } = await verifyNewUsername(input.username);
                    if (errorMessage) {
                        updateProfileRes.message = errorMessage;
                        updateProfileRes.messageType = messageType;
                        return updateProfileRes;
                    }
                }

                // Update Firebase User
                try {
                    const newFireUser = await adminAuth.updateUser(fireUser.uid, {
                        email: input.email,
                        displayName: input.username,
                    });

                    updateProfileRes.user = newFireUser;

                    updateProfileRes.token = await adminAuth.createCustomToken(newFireUser.uid);
                }
                catch (error) {
                    updateProfileRes.message = error instanceof Error ? error.message : 'Unknown error occurred while editing profile';
                    return updateProfileRes;
                }

                // Update Prisma User
                try {
                    const prismaUser = await ctx.prisma.userAccount.update({
                        where: { uid: fireUser.uid },
                        data: input,
                    });
                    updateProfileRes.profile = prismaUser;
                }
                catch (error) {
                    await adminAuth.updateUser(fireUser.uid, {
                        displayName: fireUser.displayName,
                    });
                    updateProfileRes.message = 'Unknown error occurred while editing profile';
                    updateProfileRes.messageType = 'error';
                    return updateProfileRes;
                }

                // Success
                updateProfileRes.message = 'Profile Updated';
                updateProfileRes.messageType = 'success';

                return updateProfileRes;
            }),
});

/*
 * Matches string that contains only alphanumeric characters, hyphens, and underscores
 */
function isUsernameFormatValid(username: string) {
    return new RegExp('^[a-zA-Z0-9-_]+$').test(username);
}

async function verifyNewUsername(username: string) {
    const res: {
        errorMessage: string;
        messageType: MessageType;
    } = {
        errorMessage: '',
        messageType: 'default',
    };

    try {
        if (!isUsernameFormatValid(username)) {
            res.errorMessage = 'Username must only contain letters, numbers, hyphens and underscores';
            res.messageType = 'warning';
        }

        if (!username) {
            res.errorMessage = 'Username can not be empty';
            res.messageType = 'warning';
        }

        if (username.length > 30) {
            res.errorMessage = 'Username can not be longer than 30 characters';
            res.messageType = 'warning';
        }

        const existingUsername = await prisma.userAccount.findUnique({ where: { username } });
        if (existingUsername) {
            res.errorMessage = 'Username is already taken';
            res.messageType = 'warning';
        }
    }
    catch (error) {
        res.errorMessage = 'Unknown error occurred while editing profile';
        res.messageType = 'error';
    }

    return res;
}