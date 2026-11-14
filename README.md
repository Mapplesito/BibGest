# 📚 BibGest - Sistema Inteligente de Gestión Bibliotecaria

**Proyecto Integrador — Entorno de Desarrollo de Software**  
**Estudiante:** Johan Samuel Oviedo Granados  
**Co-desarrollador / Socio:** Sebastian Alzate Velasquez  
**Docente:** Juan Camilo Olarte Betancourt  

---

## 📌 1. Descripción del Proyecto

**BibGest** es una solución full-stack diseñada para centralizar, automatizar y optimizar la administración de bibliotecas académicas o institucionales. Permite gestionar de forma eficiente títulos, ejemplares físicos, lectores, préstamos y el control automatizado de fechas y multas.

El proyecto resuelve la problemática del control manual y los registros dispersos, aportando trazabilidad, agilidad y consistencia en tiempo real sobre la disponibilidad de los recursos bibliográficos.

---

## 👥 2. Actores y Roles del Sistema

- **Bibliotecario / Administrador:** Encargado de la gestión completa del inventario (títulos y ejemplares), registro de lectores, control de préstamos, devoluciones y supervisión del historial de movimientos.
- **Lector (Estudiante / Usuario):** Usuario final con acceso a la consulta del catálogo general, verificación de disponibilidad de ejemplares en tiempo real y revisión de su historial de préstamos activos y pasados.

---

## 🚀 3. Requisitos Funcionales (RF) y No Funcionales (RNF)

### Requisitos Funcionales
- **RF01 - Gestión de Títulos:** Alta, edición, consulta y desactivación de registros bibliográficos (ISBN, título, autor, editorial, categoría).
- **RF02 - Gestión de Ejemplares:** Control de copias físicas vinculadas a un título con identificador único y estados dinámicos (*Disponible*, *Prestado*, *En mantenimiento*).
- **RF03 - Gestión de Lectores:** Administración de datos de identificación y contacto de los usuarios autorizados.
- **RF04 - Control de Préstamos:** Vinculación de un lector con un ejemplar disponible, validando restricciones y asignando fechas de devolución.
- **RF05 - Registro de Devoluciones:** Cierre de préstamos activos y actualización automática de la disponibilidad del ejemplar.
- **RF06 - Búsqueda e Historial:** Motor de búsqueda rápida por múltiples filtros y trazabilidad completa de movimientos.

### Requisitos No Funcionales
- **RNF01 (Rendimiento):** Las consultas de búsqueda de libros y filtrado en el catálogo deben responder en un tiempo inferior a 2 segundos.
- **RNF02 (Seguridad y Persistencia):** Almacenamiento estructurado e íntegro de la información mediante bases de datos relacionales robustas, garantizando la consistencia transaccional.
- **RNF03 (Mantenibilidad y Arquitectura):** Código fuente modular y desacoplado, separando responsabilidades en capas (controladores, rutas, servicios y modelos).

---

## 🛠️ 4. Arquitectura y Stack Tecnológico

El sistema se estructura bajo una arquitectura cliente-servidor desacoplada, utilizando contenedores para asegurar la portabilidad del entorno de desarrollo:

* **Frontend:** Desarrollado con **React**, **Vite** y componentes estilizados de forma modular para garantizar una experiencia de usuario fluida y responsiva.
* **Backend:** API REST construida en **Node.js** con **Express**, estructurada de forma modular (controladores, rutas y lógica de negocio separadas).
* **Base de Datos / Persistencia:** **PostgreSQL**, asegurando la integridad referencial entre entidades (Libros, Ejemplares, Lectores, Préstamos y Usuarios).
* **Contenedorización:** Aislamiento de entornos mediante **Docker** para estandarizar la ejecución del backend y las bases de datos.
* **Control de Versiones:** Git y GitHub bajo una estrategia de ramificación estructurada (`main`, `develop`, y ramas `feature/`).

---

## 📂 5. Estructura del Repositorio

```text
BibGest/
├── .github/
│   └── workflows/          # Automatización e integración continua (CI)
├── backend/                # Servidor API REST (Node.js / Express / PostgreSQL)
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio de las peticiones
│   │   ├── models/         # Conexión y esquemas de base de datos
│   │   └── routes/         # Endpoints del sistema
│   ├── Dockerfile          # Configuración de contenedor Docker para el backend
│   └── package.json
├── frontend/               # Aplicación cliente (React + Vite)
├── docs/                   # Documentación técnica y diagramas UML
│   ├── Casos_de_Uso.png
│   ├── Diagrama_Clases.png
│   └── Diagrama_Secuencia.png
├── .gitignore
└── README.md               # Documentación principal del proyecto

## ⚙️ Guía de Ejecución Local

Para poner en marcha el proyecto en tu entorno de desarrollo local, sigue estos pasos:

### 1. Clonar el repositorio
bash/powershell
git clone [https://github.com/tu-usuario/BibGest.git](https://github.com/tu-usuario/BibGest.git)
cd BibGest

### 2. Configurar y ejecutar el backend

cd backend
npm install
# Configurar las variables de entorno (.env) según el archivo .env.example
npm run dev

### 3. Configurar y ejecutar el frontend

cd ../frontend
npm install
npm run dev

### NOTA:
*(Asegúrate de reemplazar `tu-usuario` por el enlace real de tu repositorio en GitHub).*