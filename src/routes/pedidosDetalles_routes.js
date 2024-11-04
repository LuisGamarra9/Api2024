import { Router } from "express";
import { getDetalles, getDetallesid,postDetalles,putDetalles,patchDetalles,deleteDetalles } from "../controladores/pedidosDetallesCtrl.js";


const router = Router();

// Armar nuestras rutas
router.get("/pedidos_detalles", getDetalles);
router.get("/pedidos_detalles/:id", getDetallesid);
router.post("/pedidos_detalles", postDetalles);//insertasr
router.put("/pedidos_detalles/:id", putDetalles);//update
router.patch("/pedidos_detalles/:id", patchDetalles);//update partial
router.delete("/pedidos_detalles/:id", deleteDetalles);//delete

export default router;
