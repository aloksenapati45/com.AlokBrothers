Alok's & Brothers — Fish Dealership Management System

Full-stack scaffold: React frontend + Java Spring Boot backend + PostgreSQL.

Run (dev):

- Ensure Docker is running and start DB:

```bash
docker-compose up -d
```

- Backend (Maven):

```bash
cd backend
mvn spring-boot:run
```

- Frontend (React):

```bash
cd frontend
npm install
npm start
```

This repository is a scaffold containing authentication, basic entities, REST APIs and React pages for Dashboard, Inventory, Orders, Reports and Profile.

Logo:
- To use your logo file `C:\\Users\\ALOK\\OneDrive\\Desktop\\Alok & Brothers Logo.png` as the app logo, copy it into the frontend public folder as `frontend/public/logo.png`.
	Example (PowerShell):

```powershell
Copy-Item "C:\\Users\\ALOK\\OneDrive\\Desktop\\Alok & Brothers Logo.png" -Destination "frontend\\public\\logo.png"
```

The app header and favicon will use `/logo.png` when present.
