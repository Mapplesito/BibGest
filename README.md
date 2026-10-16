# 📚 BibGest - Sistema de Gestión de Bibliotecas

**Proyecto Integrador — Entrega 1 (Primer Corte)**  
**Asignatura:** Entornos de Desarrollo de Software  
**Estudiante:** Johan Samuel Oviedo Granados  
**Docente:** Juan Camilo Olarte Betancourt  

---

## 📌 Descripción del Proyecto

**BibGest** es un sistema web diseñado para centralizar, automatizar y optimizar la administración de bibliotecas. Permite gestionar títulos, ejemplares físicos, lectores, préstamos y devoluciones en una única plataforma accesible en tiempo real. 

El proyecto resuelve la problemática del control manual en papel y registros dispersos, aportando mayor trazabilidad, agilidad y consistencia en la disponibilidad de los recursos bibliográficos.

---

## 👥 Usuarios y Roles

* **Bibliotecario / Administrador:** Encargado de la gestión del inventario (títulos y ejemplares), registro de lectores, control de préstamos/devoluciones y supervisión del historial de movimientos.
* **Lector:** Usuario final que puede consultar el catálogo general de libros, verificar la disponibilidad de ejemplares en tiempo real y consultar su historial de préstamos.

---

## 🚀 Funcionalidades Principales

* **F01 - Gestionar Títulos:** Alta, edición, consulta y desactivación de registros bibliográficos (título, autor, ISBN, editorial, categoría).
* **F02 - Gestionar Ejemplares:** Registro de copias físicas vinculadas a un título con código único y estado (*Disponible*, *Prestado*, *En mantenimiento*).
* **F03 - Gestionar Lectores:** Administración de datos de identificación y contacto de los usuarios de la biblioteca.
* **F04 - Registrar Préstamos:** Vinculación de un lector con un ejemplar disponible y asignación de fechas de préstamo y devolución.
* **F05 - Registrar Devoluciones:** Cierre de préstamos activos y actualización automática del estado del ejemplar.
* **F06 - Búsqueda e Historial:** Búsqueda rápida por título, autor o ISBN, consulta de disponibilidad e historial de movimientos.

---

## 🛠️ Arquitectura del Sistema

El sistema adopta una arquitectura en capas con separación estricta de responsabilidades:

1. **Frontend (Interfaz de Usuario):** Desarrollado con **React**. Encargado de pantallas, formularios, listados y captura de acciones del usuario.
2. **Backend (Lógica de Negocio / API):** Centraliza la validación de reglas de negocio (autenticación, permisos, validación de disponibilidad).
3. **Persistencia (Base de Datos):** Almacenamiento estructurado de entidades principales (Libro, Ejemplar, Lector, Prestamo, Devolucion, Usuario).

---

## 📂 Estructura del Repositorio

```text
BibGest/
├── README.md              # Documentación principal del proyecto
├── docs/                  # Documentación técnica y diagramas UML
│   ├── Casos_de_Uso.png
│   ├── Diagrama_Clases.png
│   └── Diagrama_Secuencia.png
├── frontend/              # Aplicación web en React
└── backend/               # API y lógica de negocio