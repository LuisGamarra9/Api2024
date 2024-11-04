import { Router } from "express";
import { getPedidos, getPedidosid,postPedidos,putPedidos,patchPedidos,deletePedidos } from "../controladores/pedidosCtrl.js";


const router = Router();

// Armar nuestras rutas
router.get("/pedidos", getPedidos);
router.get("/pedidos/:id", getPedidosid);
router.post("/pedidos", postPedidos);//insertasr
router.put("/pedidos/:id", putPedidos);//update
router.patch("/pedidos/:id", patchPedidos);//update partial
router.delete("/pedidos/:id", deletePedidos);//delete

export default router;
