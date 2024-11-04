import { Router } from "express";
import multer from 'multer'; // importa el paquete multer para subir archivos
import { getProductos, getProductosid,postProductos,putProductos,patchProductos,deleteProductos } from "../controladores/productoctrl.js";

//configurar multer para almacenar las imagenes
const storage = multer.diskStorage({
    destination: (req, file ,cb) =>{
        cb(null,'uploads'); // caprteta donde se guardan las imagenes

    },
    filename: (req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)

    }

});

const upload = multer({storage});
const router = Router();

// Armar nuestras rutas
router.get("/productos", getProductos);
router.get("/productos/:id", getProductosid);
router.post("/productos", upload.single('image'),postProductos);//insertar
router.put("/productos/:id", putProductos);//update
router.patch("/productos/:id", patchProductos);//update partial
router.delete("/productos/:id", deleteProductos);//delete

export default router;
