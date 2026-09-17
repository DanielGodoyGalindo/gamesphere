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

##### TO-DO

* Endpoints:
  
POST   /api/users ✅
GET    /api/users ✅
GET    /api/users/:id ✅
PATCH  /api/users/:id ✅
DELETE /api/users/:id ✅