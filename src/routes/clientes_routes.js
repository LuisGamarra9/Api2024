import { Router } from "express";
import { getClientes, getClientesid,postClientes,putClientes,patchClientes,deleteClientes } from "../controladores/clientesCtrl.js";

const router = Router();

// Armar nuestras rutas
router.get("/clientes", getClientes);
router.get("/clientes/:id", getClientesid);
router.post("/clientes", postClientes);//insertasr
router.put("/clientes/:id", putClientes);//update
router.patch("/clientes/:id", patchClientes);//update partial
router.delete("/clientes/:id", deleteClientes);//delete

export default router;
