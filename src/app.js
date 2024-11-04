
import express from "express";
import cors from 'cors'; // importa los paquetes cors -- permisos de acceso
import path from 'path';
import {fileURLToPath} from 'url';
import clientes_routes from "./routes/clientes_routes.js";
import usuarios_routes from "./routes/usuarios_routes.js";
import producto_routes from "./routes/producto_routes.js";
import pedidos_routes from "./routes/pedidos_routes.js";
import pedidosDetalles_routes from "./routes/pedidosDetalles_routes.js";

//definir moduo de ES
const __filename= fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const corsOptions = {
    origin: '*', // la dirrecion del dominio del servidor
    methods:['GET','POST','PUT', 'PATCH','DELETE'],
    credentials : true
}
app.use(cors(corsOptions));
app.use(express.json()); //interprete los objetos enviados como json
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//rutas
app.use("/api",clientes_routes)
app.use("/api",usuarios_routes)
app.use("/api",producto_routes)
app.use("/api",pedidos_routes)
app.use("/api",pedidosDetalles_routes)





app.use((req,res,next)=>{
    res.status(400).json({message:"Pagina no encontrada"});
})

export default app;