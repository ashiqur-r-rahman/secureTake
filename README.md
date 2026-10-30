# Secure Dynamic Attendance System

SDAS is a zero-trust attendance system built around one-student, one-QR-token sessions. A check-in must pass the signed-token, identity, geofence, subnet, and device checks defined by the selected attendance policy.

## Step 1: local platform setup

### Prerequisites

- Node.js 20+
- Docker Desktop or Docker Engine with Compose

### Configure and run

```bash
cp .env.example .env
# Replace every `change_me` / `replace_with` value in .env.
docker compose up --build
```

The web portal is available at `http://localhost:3000`; the API health endpoint is available at `http://localhost:5000/health`.

## Planned delivery sequence

1. Platform scaffold, environment configuration, Docker, and PostGIS.
2. Relational schema, PostGIS extensions, migrations, and indexes.
3. Teacher and student authentication flows.
4. HMAC-SHA256, student-bound QR session tokens with a 120-second expiry.
5. Token, geofence, subnet, and device verification facade.
6. Teacher and student React interfaces.
7. Editable final attendance report and cache synchronization.
8. Automated tests, CI, API documentation, and deployment guide.

## Security notes

- Never commit `.env` or real credentials.
- Generate independent, high-entropy values for `JWT_SECRET` and `QR_HMAC_SECRET`.
- The API starts with restrictive CORS; allowed origins will be configured when the web client is added.
