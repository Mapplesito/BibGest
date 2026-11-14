# 📚 BibGest - Sistema Inteligente de Gestión Bibliotecaria

**Proyecto Integrador — Entorno de Desarrollo de Software**  
**Estudiantes:** Johan Samuel Oviedo Granados y Juan Sebastian Baena 
**Docente:** Juan Camilo Olarte Betancourt  

---

## 📌 1. Descripción del Proyecto

**BibGest** es una solución full-stack diseñada para centralizar, automatizar y optimizar la administración de bibliotecas académicas o institucionales. Permite gestionar de forma eficiente libros, lectores y préstamos, con control automatizado de la disponibilidad y de las fechas de devolución.

El proyecto resuelve la problemática del control manual y los registros dispersos, aportando trazabilidad, agilidad y consistencia en tiempo real sobre la disponibilidad de los recursos bibliográficos.

---

## 👥 2. Actores y Roles del Sistema

- **Bibliotecario / Administrador:** Encargado de la gestión completa del inventario, registro de lectores, control de préstamos, devoluciones y supervisión del historial de movimientos.
- **Lector (Estudiante / Usuario):** Usuario final con acceso a la consulta del catálogo general, verificación de disponibilidad en tiempo real y revisión de su historial de préstamos activos y pasados.

---

## 🚀 3. Requisitos Funcionales (RF) y No Funcionales (RNF)

### Requisitos Funcionales
- **RF01 - Gestión de Libros:** Alta, edición, consulta y eliminación de registros bibliográficos (título, autor y estado *Disponible* / *Prestado*).
- **RF02 - Gestión de Lectores:** Administración de datos de identificación y contacto (nombre, documento único y correo).
- **RF03 - Control de Préstamos:** Vinculación de un lector con un libro disponible, validando restricciones (un solo préstamo activo por libro y por lector) y asignando la fecha límite de devolución.
- **RF04 - Registro de Devoluciones:** Cierre de préstamos activos y actualización automática de la disponibilidad del libro.
- **RF05 - Búsqueda e Historial:** Búsqueda rápida por múltiples filtros y trazabilidad completa de los préstamos y devoluciones.

### Requisitos No Funcionales
- **RNF01 (Rendimiento):** Las consultas de búsqueda y el filtrado en el catálogo deben responder en un tiempo inferior a 2 segundos.
- **RNF02 (Seguridad y Persistencia):** Almacenamiento estructurado e íntegro de la información en una base de datos relacional, garantizando la consistencia transaccional.
- **RNF03 (Mantenibilidad y Arquitectura):** Código modular y desacoplado, con el frontend y el backend separados en carpetas independientes.

---

## 🛠️ 4. Arquitectura y Stack Tecnológico

El sistema sigue una arquitectura cliente-servidor desacoplada, con contenedores para asegurar la portabilidad del entorno:

* **Frontend (`frontend/`):** **React** y **Vite**, organizado en páginas, componentes, hooks personalizados y una capa de servicios para consumir la API.
* **Backend (`backend/`):** API REST en **Node.js** con **Express**, que expone los endpoints de libros, lectores y préstamos.
* **Base de Datos:** **PostgreSQL**, con integridad referencial entre Libros, Lectores y Préstamos.
* **Contenedorización:** **Docker** y **Docker Compose** para levantar la base de datos, el backend y el frontend.
* **Control de Versiones:** Git y GitHub con una estrategia de ramas estructurada (`main`, `develop` y ramas `feature/`).

---

## 📂 5. Estructura del Repositorio

```text
BibGest/
├── README.md              # Documentación principal del proyecto
├── docs/                  # Documentación técnica y diagramas UML
│   ├── Diagrama_flujo.pdf
│   ├── Diagrama_Clases.pdf
│   └── Diagrama_Secuencia.pdf
├── frontend/              # Aplicación web en React
└── backend/               # API y lógica de negocio
```

| Carpeta / Archivo | Descripción |
|---|---|
| `README.md` | Documentación principal del proyecto. |
| `docs/` | Diagramas UML: casos de uso, clases y secuencia. |
| `frontend/` | Aplicación web en React (Vite). |
| `backend/` | API REST en Node.js / Express conectada a PostgreSQL. |

---

## 📊 6. Documentación UML

Los diagramas del sistema están en la carpeta [`docs/`](./docs):

- **Diagrama de flujo:** `docs/Diagrama_flujo.pdf`
- **Diagrama de clases:** `docs/Diagrama_Clases.pdf`
- **Diagrama de secuencia:** `docs/Diagrama_Secuencia.pdf`

---

## ⚙️ 7. Guía de Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mapplesito/BibGest.git
cd BibGest
```

### 2. Opción A: Docker Compose (recomendada)

Levanta PostgreSQL, el backend y el frontend con un solo comando:

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend (API) | http://localhost:5000/api |
| PostgreSQL | localhost:5432 |

### 3. Opción B: Ejecución manual

**Backend** (requiere una instancia de PostgreSQL en ejecución):

```bash
cd backend
npm install
# Variables de entorno (opcionales, estos son los valores por defecto):
# DB_HOST=localhost  DB_USER=admin  DB_PASSWORD=password123
# DB_NAME=bibgest_db DB_PORT=5432   PORT=5000
node index.js
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

El frontend usa `http://localhost:5000/api` por defecto; se puede cambiar con la variable `VITE_API_URL`.s