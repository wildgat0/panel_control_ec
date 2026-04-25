# SISCOETHOS — Sistema de Control Ethos Corp

Panel de control web para gestionar y monitorear proyectos Docker alojados en un servidor VPS.

## Características

- **Gestión de contenedores Docker** — visualiza, inicia, detiene y reinicia contenedores agrupados por proyecto
- **Consola de logs** — visualiza los logs de cada contenedor en tiempo real con resaltado por nivel
- **Gestión de usuarios** — crea y administra usuarios con roles (admin / cliente)
- **Autenticación JWT** — acceso protegido con tokens de 8 horas de duración
- **Roles diferenciados** — los administradores gestionan contenedores y usuarios; los clientes tienen su propia vista

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL 16 |
| Contenedores | Docker + Docker Compose |
| Iconos | Lucide React |

## Requisitos

- Docker y Docker Compose instalados en el servidor

## Instalación

```bash
git clone https://github.com/wildgat0/panel_control_ec.git
cd panel_control_ec
docker compose up --build -d
```

El panel queda disponible en `http://tu-ip:3000`.

Al iniciar por primera vez se crea automáticamente el usuario administrador:

| Campo | Valor |
|-------|-------|
| Usuario | `ethos_corp` |
| Contraseña | `1234` |

> Cambia la contraseña desde el módulo **Usuarios** después del primer ingreso.

## Variables de entorno

Editables en `docker-compose.yml`:

```yaml
environment:
  - JWT_SECRET=cambiar_por_un_secreto_seguro
  - DATABASE_URL=postgresql://panel_user:panel_pass@postgres:5432/panel_control
```

## Deploy en VPS

El repositorio incluye un script de deploy. Luego de hacer `git push`, ejecuta en el servidor:

```bash
/opt/panel_control_ec/deploy.sh
```

El script realiza `git pull` + `docker compose up --build -d` automáticamente.

## Estructura del proyecto

```
panel_control_ec/
├── docker-compose.yml
├── backend/
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── migrate.js
│       ├── middleware/auth.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── containers.js
│       │   └── users.js
│       └── services/docker.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Contenedores.jsx
        │   ├── Usuarios.jsx
        │   └── ClienteHome.jsx
        └── components/
            ├── ContainerCard.jsx
            ├── ProjectCard.jsx
            ├── ProjectModal.jsx
            ├── LogsModal.jsx
            └── Footer.jsx
```

## Licencia

Uso privado — Ethos Corp © 2026
