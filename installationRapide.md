

### Fais maintenant ceci

Dans ton terminal :

```bash
cd ~/Bureau/cvpro-ai

docker compose up -d postgres

docker ps | grep cvpro-postgres

nc -vz localhost 5437
```

Tu dois obtenir quelque chose comme :

```text
Connection to localhost 5437 port [tcp/*] succeeded!
```

Puis :

```bash
cd ~/Bureau/cvpro-ai/backend

npx prisma generate

npx prisma migrate status

npm run build
```

Ensuite démarre le backend :

```bash
npm run start:dev
```

Et dans **un deuxième terminal** :

```bash
cd ~/Bureau/cvpro-ai/frontend

npm run build
npm run start
```

Puis teste le proxy :

```bash
curl -i -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"noone@example.com","password":"bad"}'
```

