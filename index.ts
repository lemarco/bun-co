export * from "./libs/server";

import { server } from "./libs/server";

server({
  config: {
    cookies: true,
    env: {
      path: ".env",
    },
    postgre: {
      fromEnv: true,
    },
    redis: {
      fromEnv: true,
    },
    jwt: {
      fromEnv: true,
    },
    logger: true,
  },
  path: "/api",
  routes: [
    {
      path: "/auth",
      routes: [
        {
          method: "GET",
          path: "/google-link",

          handler: async () => console.log("get-google-link handler"),
        },
        {
          method: "POST",
          path: "/signin/google",
          handler: async () => console.log("/signin/google handler"),
        },
        {
          before: [
            async ({ cookies, ctx, headers, redis, jwt, body }) => {
              let token = cookies?.stoken;
              if (!token) {
                let htoken = headers.get("Authorization");
                if (htoken) {
                  token = htoken;
                } else {
                  return Response.json(
                    { error: "NOT AUTHORIZED" },
                    { status: 401 }
                  );
                }
              }
              // const session = await getSession({ token: String(token), redis: redis!, jwt: jwt! });
              // const session = await getSession({
              //   token: String(token),
              //   redis: redis!,
              //   jwt: jwt!,
              // });
              // if (!session) {
              //   return Response.json({ error: "NOT AUTHORIZED" }, { status: 401 });
              // }
              // if (ctx && session) {
              //   ctx.id = session.id;
              // }
            },
          ],
          after: [async () => console.log("RESTRICTED group after")],
          routes: [
            {
              method: "POST",
              path: "/logout",
              handler: async ({ cookies, env }) => {
                const r = new Response();
                cookies.remove("stoken");
              },
            },
            {
              method: "GET",
              path: "/me",
              handler: async () => console.log("me handler"),
            },
            {
              method: "GET",
              path: "/test/:id/for/:smth",
              handler: async () => console.log("me handler"),
            },
          ],
        },
      ],
    },
    {
      path: "/articles",
      routes: [
        {
          method: "POST",
          path: "/",
          handler: async () => console.log("articles POST handler"),
        },
        {
          method: "PUT",
          path: "/",
          handler: async () => console.log("articles PUT handler"),
        },
      ],
    },
    {
      path: "/course",
      routes: [
        {
          method: "GET",
          path: "/",
          handler: async () => console.log("course GET all handler"),
        },
        {
          method: "GET",
          path: "/users",
          handler: async () =>
            console.log("course GET all course users handler"),
        },
        {
          method: "POST",
          path: "/",
          handler: async () => console.log("course POST handler"),
        },

        {
          path: "/:id",
          routes: [
            {
              method: "GET",
              path: "/",
              handler: async () => console.log("course GET id handler"),
            },
            {
              method: "PUT",
              path: "/",
              handler: async () => console.log("course PUT id handler"),
            },
            {
              method: "GET",
              path: "/:teacher",
              handler: async ({ params }) =>
                console.log("course GET teacher handler", params),
            },

            {
              path: "/lessons",
              routes: [
                {
                  method: "GET",
                  path: "/",
                  handler: async () =>
                    console.log("course GET all lessons handler"),
                },
                {
                  method: "GET",
                  path: "/:lessonId",
                  handler: async () =>
                    console.log("course GET  lesson by id handler"),
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  ctx: {
    id: null,
  },
}).start();
