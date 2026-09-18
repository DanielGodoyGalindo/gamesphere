# GameSphere

Project to learn how to create an app for tracking your games, using Next.js + Prisma + PostgereSQL + React
## Development notes
* Run Next.js (bash)
``` 
npm run dev
```

* Run PostgreSQL (powershell)

Start
```
C:\PostgreSQL\pgsql\bin\pg_ctl.exe -D C:\PostgreSQL\data -l C:\PostgreSQL\postgres.log start
```

Execute
```
C:\PostgreSQL\pgsql\bin\psql.exe -U postgres -d gamesphere
```


* Prisma
1) Create model
2) Regenerate Prisma Client
3) Create migration and DB table for model (with name exampleModel)
4) Check in Prisma Studio
```
1) Add model in prisma\schema.prisma
2) (bash) npx prisma generate
3) (bash) npx prisma migrate dev --name create_exampleModel
4) (bash) npx prisma studio
```

## TO-DO

### Database

- [x] PostgreSQL configured
- [x] `gamesphere` database created
- [x] Prisma configured
- [x] `User` model
- [x] Initial migration
- [x] Prisma Client generated

### Endpoints — Users

- [x] POST    `/api/users`
- [x] GET     `/api/users`
- [x] GET     `/api/users/:id`
- [x] PATCH   `/api/users/:id`
- [x] DELETE  `/api/users/:id`

### Endpoints — Games

- [ ] POST    `/api/games`
- [ ] GET     `/api/games`
- [ ] GET     `/api/games/:id`
- [ ] PATCH   `/api/games/:id`
- [ ] DELETE  `/api/games/:id`

### Endpoints — Library

- [ ] POST    `/api/library`
- [ ] GET     `/api/users/:id/library`
- [ ] GET     `/api/library/:id`
- [ ] PATCH   `/api/library/:id`
- [ ] DELETE  `/api/library/:id`

### Endpoints — Reviews

- [ ] POST    `/api/reviews`
- [ ] GET     `/api/games/:id/reviews`
- [ ] GET     `/api/reviews/:id`
- [ ] PATCH   `/api/reviews/:id`
- [ ] DELETE  `/api/reviews/:id`

### Validation

- [ ] Validate request data
- [ ] Validate `username`
- [ ] Validate `email`
- [ ] Validate IDs
- [ ] Validate required fields
- [ ] Handle unique constraint errors
- [ ] Add Zod

### Authentication

- [ ] Configure Auth.js
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Protect API endpoints
- [ ] Associate actions with authenticated users

### External Games API

- [ ] Choose an external video game API
- [ ] Search games
- [ ] Get game details
- [ ] Get game cover
- [ ] Get game platforms
- [ ] Get game genres
- [ ] Get release dates

### Frontend — V1

- [ ] Home page
- [ ] Game catalog
- [ ] Game search
- [ ] Game filters
- [ ] Game details page
- [ ] Register / Login pages
- [ ] User profile
- [ ] Personal game library
- [ ] Add game to library
- [ ] Change game status
- [ ] Update game progress
- [ ] Create review
- [ ] Edit review
- [ ] Delete review

### V2 — Social

- [ ] Follow users
- [ ] Unfollow users
- [ ] Activity feed
- [ ] Likes
- [ ] Comments
- [ ] User activity

### V3 — Real-time

- [ ] Notifications
- [ ] Chat
- [ ] WebSockets
- [ ] Online / offline status

### V4 — Advanced Features

- [ ] Game recommendations
- [ ] User statistics
- [ ] Leaderboards
- [ ] AI features

### V5 — Integrations

- [ ] Steam integration
- [ ] Discord integration

### Testing

- [ ] Unit tests
- [ ] API tests
- [ ] End-to-end tests
- [ ] Configure Vitest
- [ ] Configure Playwright

### Deployment

- [ ] Production environment variables
- [ ] Frontend deployment
- [ ] PostgreSQL deployment
- [ ] API deployment
- [ ] CI/CD