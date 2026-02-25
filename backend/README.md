# SmartfyAI Backend (Express)

This is the SmartfyAI backend built with **Express** + **TypeORM (Postgres/Supabase)** + **Clerk** and an **SSE** chat streaming endpoint backed by **Groq**.

## Local development

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

## Build

```bash
cd backend
npm run build
npm run start:prod
```

`npm run build` also builds the frontend from `../frontend` for convenience.

## Environment variables

See `backend/.env.example`. Minimum required:

- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `GROQ_API_KEY`
- `ALLOWED_ORIGINS`

For first deploy (empty DB), you can temporarily set `SYNC_DB=true` to auto-create tables, then set it back to `false`.

## Docker

```bash
cd backend
docker build -t smartfyai-backend .
docker run --rm -p 3000:3000 --env-file .env smartfyai-backend
```
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
