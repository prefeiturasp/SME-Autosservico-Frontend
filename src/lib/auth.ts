import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
//import bcrypt from "bcryptjs"

// Simulação de banco de dados (em produção, use um banco real)
const users = [
    {
        id: "1",
        email:"admin@example.com",
        rf: "1234567", // Registro Funcional (RF)
        password: "admin123", // "admin123"
        name: "Admin User",
        image: null,
        abrangencia: {
            id: "1",
            nome: "Admin Area",
            descricao: "Área administrativa com acesso total",
            nivel: 1, // Nível de acesso mais alto
        },
    },
    {
        id: "2",
        email:"user@example.com",
        rf: "12345678", // Registro Funcional (RF)
        password: "user123", // "user123"
        name: "Regular User",
        image: null,
        abrangencia: {
            id: "2",
            nome: "User Area",
            descricao: "Área do usuário com acesso limitado",
            nivel: 2,
        },
    },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                rf: {
                    label: "RF",
                    type: "text",
                    placeholder: "1234567",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials?.rf || !credentials?.password) {
                    return null;
                }

                const user = users.find(
                    (user) =>
                        user.rf === credentials.rf &&
                        user.password === credentials.password
                );

                if (!user) {
                    return null;
                }

                // const isPasswordValid = await bcrypt.compare(
                //   credentials.password as string,
                //   user.password
                // )

                // if (!isPasswordValid) {
                //   return null
                // }

                return {
                    id: user.id,
                    email: user.email, // Adicionando o email
                    rf: user.rf, // Registro Funcional (RF)
                    name: user.name,
                    image: user.image,
                    abrangencia: user.abrangencia, // Incluindo os dados adicionais
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.rf = user.rf; // Registro Funcional (RF)
                token.abrangencia = user.abrangencia; // Adicionando ao token JWT
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.rf = token.rf as string; // Registro Funcional (RF)
                session.user.abrangencia = token.abrangencia; // Adicionando ao objeto de sessão
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
