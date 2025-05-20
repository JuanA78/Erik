const express = require("express");
const router = express.Router();
const personaController = require("../controllers/personaController");

router.post("/", personaController.insertarTodo);
router.get("/", personaController.obtenerTodo);
router.get("/curp/:curp", personaController.buscarPorCurp);  // <-- aquí primero
router.get("/:id", personaController.buscarPorId);           // <-- aquí después
router.delete("/curp/:curp", personaController.eliminarPorCurp);

module.exports = router;
