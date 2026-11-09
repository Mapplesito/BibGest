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

// Crear la tabla de libros si todavía no existe
async function prepararBaseDeDatos() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(120) NOT NULL,
      autor VARCHAR(100) NOT NULL,
      estado VARCHAR(20) NOT NULL DEFAULT 'Disponible'
    );
  `);

  console.log("Tabla de libros preparada correctamente.");
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
    console.error("Error al eliminar libro:", error);

    res.status(500).json({
      error: "No fue posible eliminar el libro",
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