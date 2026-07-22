import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/browser";
// If your Prisma file is located elsewhere, you can change the path


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    additionalFields: {
        role: {
            required: true,
            defaultValue: Role.PATIENT, 
        },
        status: {
            required: true,
            defaultValue: UserStatus.ACTIVE,
        },
        needPasswordChange: {
            required: true,
            defaultValue: false,
        },
        isDeleted: {
            required: true,
            defaultValue: false,
        },
        deletedAt: {
            required: false,
            defaultValue: null,
        },

        session:{
            expiresIn: 60*60*1000*24,
            updateAge: 60*60*1000*24,
            cookieCache:{
                enabled:true,
                maxAge: 60*60*1000*24
            }
        }
        // trustedOrigins:[envVars.BETTER_AUTH_URL || "http://localhost:5000"],
        // advanced:{
        //     disableCSRFCheck: true,
        // }


    }
});