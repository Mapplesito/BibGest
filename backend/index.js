const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password123",
  database: process.env.DB_NAME || "bibgest_db",
  port: process.env.DB_PORT || 5432,
});

// Crear las tablas si todavía no existen
async function prepararBaseDeDatos() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(120) NOT NULL,
      autor VARCHAR(100) NOT NULL,
      estado VARCHAR(20) NOT NULL DEFAULT 'Disponible'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lectores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      documento VARCHAR(30) NOT NULL UNIQUE,
      correo VARCHAR(120) NOT NULL
    );
  `);

  console.log("Tablas de libros y lectores preparadas correctamente.");
}

// Ruta para comprobar la conexión con PostgreSQL
app.get("/api/test", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      message: "Conexión exitosa a PostgreSQL",
      time: resultado.rows[0].now,
    });
  } catch (error) {
    console.error("Error al probar la conexión:", error);

    res.status(500).json({
      error: "Error al conectar con PostgreSQL",
    });
  }
});

// ==========================================
// RUTAS CRUD DE LIBROS
// ==========================================

// GET: consultar todos los libros
app.get("/api/libros", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM libros ORDER BY id ASC"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar libros:", error);

    res.status(500).json({
      error: "No fue posible consultar los libros",
    });
  }
});

// POST: registrar un libro
app.post("/api/libros", async (req, res) => {
  try {
    const { titulo, autor } = req.body;

    if (
      typeof titulo !== "string" ||
      typeof autor !== "string" ||
      !titulo.trim() ||
      !autor.trim()
    ) {
      return res.status(400).json({
        error: "El título y el autor son obligatorios",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO libros (titulo, autor)
       VALUES ($1, $2)
       RETURNING *`,
      [titulo.trim(), autor.trim()]
    );

    res.status(201).json({
      message: "Libro registrado correctamente",
      libro: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar libro:", error);

    res.status(500).json({
      error: "No fue posible registrar el libro",
    });
  }
});

// PUT: actualizar un libro
app.put("/api/libros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor } = req.body;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        error: "El ID del libro no es válido",
      });
    }

    if (
      typeof titulo !== "string" ||
      typeof autor !== "string" ||
      !titulo.trim() ||
      !autor.trim()
    ) {
      return res.status(400).json({
        error: "El título y el autor son obligatorios",
      });
    }

    const resultado = await pool.query(
      `UPDATE libros
       SET titulo = $1, autor = $2
       WHERE id = $3
       RETURNING *`,
      [titulo.trim(), autor.trim(), Number(id)]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el libro",
      });
    }

    res.json({
      message: "Libro actualizado correctamente",
      libro: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar libro:", error);

    res.status(500).json({
      error: "No fue posible actualizar el libro",
    });
  }
});

// DELETE: eliminar un libro
app.delete("/api/libros/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        error: "El ID del libro no es válido",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM libros WHERE id = $1 RETURNING *",
      [Number(id)]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el libro",
      });
    }

    res.json({
      message: "Libro eliminado correctamente",
      libro: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar el libro:", error);

    res.status(500).json({
      error: "No fue posible eliminar el libro",
    });
  }
});

// ==========================================
// RUTAS CRUD DE LECTORES
// ==========================================

// GET: consultar todos los lectores
app.get("/api/lectores", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM lectores ORDER BY id ASC"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar lectores:", error);

    res.status(500).json({
      error: "No fue posible consultar los lectores",
    });
  }
});

// POST: registrar un lector
app.post("/api/lectores", async (req, res) => {
  try {
    const { nombre, documento, correo } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof documento !== "string" ||
      typeof correo !== "string" ||
      !nombre.trim() ||
      !documento.trim() ||
      !correo.trim()
    ) {
      return res.status(400).json({
        error: "El nombre, documento y correo son obligatorios",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO lectores (nombre, documento, correo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre.trim(), documento.trim(), correo.trim()]
    );

    res.status(201).json({
      message: "Lector registrado correctamente",
      lector: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar lector:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Ya existe un lector con ese documento",
      });
    }

    res.status(500).json({
      error: "No fue posible registrar el lector",
    });
  }
});

// PUT: actualizar un lector
app.put("/api/lectores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, documento, correo } = req.body;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        error: "El ID del lector no es válido",
      });
    }

    if (
      typeof nombre !== "string" ||
      typeof documento !== "string" ||
      typeof correo !== "string" ||
      !nombre.trim() ||
      !documento.trim() ||
      !correo.trim()
    ) {
      return res.status(400).json({
        error: "El nombre, documento y correo son obligatorios",
      });
    }

    const resultado = await pool.query(
      `UPDATE lectores
       SET nombre = $1, documento = $2, correo = $3
       WHERE id = $4
       RETURNING *`,
      [nombre.trim(), documento.trim(), correo.trim(), Number(id)]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el lector",
      });
    }

    res.json({
      message: "Lector actualizado correctamente",
      lector: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar lector:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Ya existe otro lector con ese documento",
      });
    }

    res.status(500).json({
      error: "No fue posible actualizar el lector",
    });
  }
});

// DELETE: eliminar un lector
app.delete("/api/lectores/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return res.status(400).json({
        error: "El ID del lector no es válido",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM lectores WHERE id = $1 RETURNING *",
      [Number(id)]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "No se encontró el lector",
      });
    }

    res.json({
      message: "Lector eliminado correctamente",
      lector: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar lector:", error);

    res.status(500).json({
      error: "No fue posible eliminar el lector",
    });
  }
});

// Iniciar el servidor después de preparar la base de datos
const PORT = process.env.PORT || 5000;

prepararBaseDeDatos()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor del backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible preparar la base de datos:", error);
    process.exit(1);
  });