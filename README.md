# B2B Directory

Full-stack B2B Directory platform for companies, products, articles, events, and categories.

## Stack

- Backend: Django 5 + Django REST Framework
- Database: PostgreSQL
- Frontend: Next.js 15 App Router + TypeScript + Tailwind CSS

## Project Structure

```text
backend/   Django API, apps, migrations, and media/static configuration
frontend/  Next.js App Router frontend
docs/      Project documentation
```

## Local Development Setup

Requirements:

- Python 3.12+ recommended
- Node.js 20+ recommended
- PostgreSQL 17 or another supported PostgreSQL version
- Git

Clone the repository:

```powershell
git clone https://github.com/molialigholi-collab/b2b-directory.git
cd B2B-Directory
```

## PostgreSQL Setup

Create the local database and user:

```sql
CREATE USER b2b_user WITH PASSWORD 'b2b_password';
CREATE DATABASE b2b_directory OWNER b2b_user;
GRANT ALL PRIVILEGES ON DATABASE b2b_directory TO b2b_user;
```

Verify the connection:

```powershell
psql -h localhost -U b2b_user -d b2b_directory
```

## Backend Setup

Create and activate a virtual environment:

```powershell
cd backend
py -3 -m venv venv
.\venv\Scripts\activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

Create environment configuration:

```powershell
copy .env.example .env
```

Run migrations and checks:

```powershell
python manage.py migrate
python manage.py check
python manage.py createsuperuser
python manage.py runserver
```

Backend local URL:

```text
http://127.0.0.1:8000/api/
```

## Frontend Setup

Install dependencies and create frontend env configuration:

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend local URL:

```text
http://127.0.0.1:3000
```

## Environment Variables

Backend variables in `backend/.env`:

```text
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DJANGO_SECURE_PROXY_SSL_HEADER=False
POSTGRES_DB=b2b_directory
POSTGRES_USER=b2b_user
POSTGRES_PASSWORD=b2b_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Frontend variables in `frontend/.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

For production, set:

```text
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<strong-secret-from-server-env>
DJANGO_ALLOWED_HOSTS=api.example.com
CORS_ALLOWED_ORIGINS=https://example.com
CSRF_TRUSTED_ORIGINS=https://example.com
DJANGO_SECURE_PROXY_SSL_HEADER=True
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
```

## Production Deployment Notes

### Ubuntu VPS

- Create a non-root deploy user.
- Install system packages: Python, PostgreSQL, Nginx, Node.js, npm, build tools, and Git.
- Keep secrets in server environment files, not in Git.
- Use HTTPS with Certbot or another trusted certificate provider.
- Run `python manage.py check --deploy` before launch and review any warnings.

### PostgreSQL

- Create a dedicated production database and database user.
- Use a strong password and restrict database access to localhost or the private network.
- Enable regular backups before accepting real business data.
- Monitor disk usage and connection limits.

### Gunicorn

- Install backend requirements in a production virtual environment.
- Run Django through Gunicorn using `config.wsgi:application`.
- Use a systemd service to keep Gunicorn running and restart it on deploys.
- Run `python manage.py collectstatic` during deployment.

Example Gunicorn command:

```bash
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
```

### Nginx

- Terminate HTTPS at Nginx.
- Proxy API traffic to Gunicorn.
- Serve Django static/media files from the configured `STATIC_ROOT` and `MEDIA_ROOT`.
- Pass `X-Forwarded-Proto` so Django can detect HTTPS behind the proxy.

Example proxy headers:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### PM2 for Next.js

- Build the frontend with `npm run build`.
- Start Next.js with PM2 using `npm run start`.
- Configure the production API URL in `frontend/.env.production`.
- Put Nginx in front of the Next.js process and proxy frontend traffic to `127.0.0.1:3000`.

Example PM2 command:

```bash
pm2 start npm --name b2b-directory-frontend -- run start
pm2 save
pm2 startup
```