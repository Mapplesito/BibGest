
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ==========================================
// CONEXIÓN CON POSTGRESQL
// ==========================================

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password123",
  database: process.env.DB_NAME || "bibgest_db",
  port: process.env.DB_PORT || 5432,
});

// ==========================================
// PREPARACIÓN DE LA BASE DE DATOS
// ==========================================

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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS prestamos (
      id SERIAL PRIMARY KEY,
      libro_id INTEGER NOT NULL REFERENCES libros(id) ON DELETE RESTRICT,
      lector_id INTEGER NOT NULL REFERENCES lectores(id) ON DELETE RESTRICT,
      fecha_prestamo DATE NOT NULL,
      fecha_limite DATE NOT NULL,
      fecha_devolucion_real DATE,
      estado VARCHAR(20) NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Devuelto')),
      CONSTRAINT fechas_prestamo_validas
        CHECK (fecha_limite >= fecha_prestamo),
      CONSTRAINT fecha_devolucion_valida
        CHECK (
          fecha_devolucion_real IS NULL
          OR fecha_devolucion_real >= fecha_prestamo
        )
    );
  `);

  // Un libro no puede tener dos préstamos activos.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS prestamos_un_libro_activo
    ON prestamos (libro_id)
    WHERE estado = 'Activo';
  `);

  // Un lector no puede tener dos préstamos activos.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS prestamos_un_lector_activo
    ON prestamos (lector_id)
    WHERE estado = 'Activo';
  `);

  console.log("Tablas de libros, lectores y préstamos preparadas correctamente.");
}

// ==========================================
// RUTA DE PRUEBA
// ==========================================

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

// GET: consultar todos los libros.
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

// POST: registrar un libro.
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

// PUT: actualizar un libro.
app.put("/api/libros/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, autor } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
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
      [titulo.trim(), autor.trim(), id]
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

// DELETE: eliminar un libro.
app.delete("/api/libros/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID del libro no es válido",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM libros WHERE id = $1 RETURNING *",
      [id]
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

    if (error.code === "23503") {
      return res.status(409).json({
        error: "No se puede eliminar este libro porque tiene préstamos registrados.",
      });
    }

    res.status(500).json({
      error: "No fue posible eliminar el libro",
    });
  }
});

// ==========================================
// RUTAS CRUD DE LECTORES
// ==========================================

// GET: consultar todos los lectores.
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

// POST: registrar un lector.
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

// PUT: actualizar un lector.
app.put("/api/lectores/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, documento, correo } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
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
      [nombre.trim(), documento.trim(), correo.trim(), id]
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

// DELETE: eliminar un lector.
app.delete("/api/lectores/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID del lector no es válido",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM lectores WHERE id = $1 RETURNING *",
      [id]
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

    if (error.code === "23503") {
      return res.status(409).json({
        error: "No se puede eliminar este lector porque tiene préstamos registrados.",
      });
    }

    res.status(500).json({
      error: "No fue posible eliminar el lector",
    });
  }
});

// ==========================================
// RUTAS DE PRÉSTAMOS Y DEVOLUCIONES
// ==========================================

// GET: consultar todos los préstamos.
app.get("/api/prestamos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id,
        libro_id AS "libroId",
        lector_id AS "lectorId",
        TO_CHAR(fecha_prestamo, 'YYYY-MM-DD') AS "fechaPrestamo",
        TO_CHAR(fecha_limite, 'YYYY-MM-DD') AS "fechaLimite",
        TO_CHAR(fecha_devolucion_real, 'YYYY-MM-DD') AS "fechaDevolucionReal",
        estado
      FROM prestamos
      ORDER BY id ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar préstamos:", error);

    res.status(500).json({
      error: "No fue posible consultar los préstamos",
    });
  }
});

// POST: registrar un préstamo.
app.post("/api/prestamos", async (req, res) => {
  const { libroId, lectorId, fechaPrestamo, fechaLimite } = req.body;

  const libroIdNumero = Number(libroId);
  const lectorIdNumero = Number(lectorId);

  const fechaValida = (fecha) => {
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return false;
    }

    const fechaObjeto = new Date(`${fecha}T00:00:00Z`);

    return (
      !Number.isNaN(fechaObjeto.getTime()) &&
      fechaObjeto.toISOString().slice(0, 10) === fecha
    );
  };

  if (
    !Number.isInteger(libroIdNumero) ||
    libroIdNumero <= 0 ||
    !Number.isInteger(lectorIdNumero) ||
    lectorIdNumero <= 0 ||
    !fechaValida(fechaPrestamo) ||
    !fechaValida(fechaLimite) ||
    fechaLimite < fechaPrestamo
  ) {
    return res.status(400).json({
      error: "Selecciona un libro, un lector y fechas válidas. La fecha límite no puede ser anterior al préstamo.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar y bloquear el libro durante la operación.
    const libroResultado = await client.query(
      "SELECT id, estado FROM libros WHERE id = $1 FOR UPDATE",
      [libroIdNumero]
    );

    if (libroResultado.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "No se encontró el libro seleccionado",
      });
    }

    if (libroResultado.rows[0].estado !== "Disponible") {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "El libro seleccionado no está disponible",
      });
    }

    // Verificar que el lector exista.
    const lectorResultado = await client.query(
      "SELECT id FROM lectores WHERE id = $1",
      [lectorIdNumero]
    );

    if (lectorResultado.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "No se encontró el lector seleccionado",
      });
    }

    // Verificar que el lector no tenga otro préstamo activo.
    const prestamoActivo = await client.query(
      `SELECT id
       FROM prestamos
       WHERE lector_id = $1 AND estado = 'Activo'
       LIMIT 1`,
      [lectorIdNumero]
    );

    if (prestamoActivo.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Este lector ya tiene un préstamo activo. Debe devolverlo antes de solicitar otro.",
      });
    }

    // Registrar el préstamo.
    const nuevoPrestamo = await client.query(
      `INSERT INTO prestamos (
        libro_id,
        lector_id,
        fecha_prestamo,
        fecha_limite
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        libro_id AS "libroId",
        lector_id AS "lectorId",
        TO_CHAR(fecha_prestamo, 'YYYY-MM-DD') AS "fechaPrestamo",
        TO_CHAR(fecha_limite, 'YYYY-MM-DD') AS "fechaLimite",
        TO_CHAR(fecha_devolucion_real, 'YYYY-MM-DD') AS "fechaDevolucionReal",
        estado`,
      [libroIdNumero, lectorIdNumero, fechaPrestamo, fechaLimite]
    );

    // Cambiar el estado del libro.
    await client.query(
      "UPDATE libros SET estado = 'Prestado' WHERE id = $1",
      [libroIdNumero]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Préstamo registrado correctamente",
      prestamo: nuevoPrestamo.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al registrar préstamo:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "El libro o el lector ya tiene un préstamo activo",
      });
    }

    res.status(500).json({
      error: "No fue posible registrar el préstamo",
    });
  } finally {
    client.release();
  }
});

// PUT: registrar la devolución de un préstamo activo.
app.put("/api/prestamos/:id/devolucion", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El ID del préstamo no es válido",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Buscar y bloquear el préstamo.
    const prestamoActual = await client.query(
      `SELECT id, libro_id, estado
       FROM prestamos
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (prestamoActual.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "No se encontró el préstamo",
      });
    }

    const prestamo = prestamoActual.rows[0];

    if (prestamo.estado !== "Activo") {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error: "Este préstamo ya fue devuelto",
      });
    }

    // Actualizar el préstamo como devuelto.
    const actualizado = await client.query(
      `UPDATE prestamos
       SET estado = 'Devuelto',
           fecha_devolucion_real = CURRENT_DATE
       WHERE id = $1
       RETURNING
         id,
         libro_id AS "libroId",
         lector_id AS "lectorId",
         TO_CHAR(fecha_prestamo, 'YYYY-MM-DD') AS "fechaPrestamo",
         TO_CHAR(fecha_limite, 'YYYY-MM-DD') AS "fechaLimite",
         TO_CHAR(fecha_devolucion_real, 'YYYY-MM-DD') AS "fechaDevolucionReal",
         estado`,
      [id]
    );

    // Devolver el libro al inventario.
    await client.query(
      "UPDATE libros SET estado = 'Disponible' WHERE id = $1",
      [prestamo.libro_id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Devolución registrada correctamente",
      prestamo: actualizado.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al registrar devolución:", error);

    res.status(500).json({
      error: "No fue posible registrar la devolución",
    });
  } finally {
    client.release();
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

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
