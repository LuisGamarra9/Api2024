import { Router } from "express";
import { getUsuarios, getUsuariosid, postUsuarios, putUsuarios, patchUsuarios, deleteUsuarios, login } from "../controladores/usuariosctrl.js";
import { verifyToken } from "../JWT/validacion.js";

const router = Router();

// Armar nuestras rutas
router.get("/usuarios", verifyToken, getUsuarios);
router.get("/usuarios/:id", verifyToken, getUsuariosid);
router.post("/usuarios", verifyToken, postUsuarios);//insertasr
router.put("/usuarios/:id", verifyToken, putUsuarios);//update
router.patch("/usuarios/:id", verifyToken, patchUsuarios);//update partial
router.delete("/usuarios/:id", verifyToken, deleteUsuarios);//delete

router.post("/login", login);


export default router;
