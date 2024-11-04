import e from "express";
import { conmysql } from "../db.js";

export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM productos");
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener productos" });
    }
};

export const getProductosid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            "SELECT * FROM productos WHERE prod_id = ?", [req.params.id]
        );

        if (result.length <= 0) {
            return res.status(404).json({ prod_id: 0, message: "No se encontró el producto" });
        }
        return res.json(result[0]);

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const postProductos =
    async (req, res) => {
        try {
            //console.log(req.body)
            const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body
            const prod_imagen=req.file ? `/uploads/${req.filename}`:null; //capturar la imagen que se envia dsede un formulario
            console.log("Datos del producto:", req.body);
            console.log("Archivo de la imagen:", req.file);
            //console.log(prod_nombre)
            const [rows] = await conmysql.query('insert into productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) values(?,?,?,?,?,?)',
                [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen])

            res.send({
                id: rows.insertId
            })
        } catch (error) {
            return res.status(500).json({ message: 'error del lado del servidor' })
        }
    };


export const putProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,
            prod_imagen
        } = req.body;

        // Validar que los campos requeridos no sean nulos o indefinidos
        if (!prod_codigo || !prod_nombre || !prod_stock || !prod_precio || !prod_activo || !prod_imagen) {
            return res.status(400).json({ message: "Faltan datos requeridos para la actualización." });
        }

        // Ejecutar la consulta de actualización
        const [rows] = await conmysql.query(
            "UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?",
            [prod_codigo,
                prod_nombre,
                prod_stock,
                prod_precio,
                prod_activo,
                prod_imagen,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ prod_id: 0, message: "Producto no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patchProductos = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del productos desde los parámetros de la URL

        // Desestructurar los datos del cuerpo de la solicitud
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,
            prod_imagen
        } = req.body;


        const [rows] = await conmysql.query(
            "UPDATE productos SET prod_codigo =IFNULL(?,prod_codigo) , prod_nombre =IFNULL (?,prod_nombre), prod_stock =IFNULL(?,prod_stock) , prod_precio =IFNULL(?,prod_precio), prod_activo =IFNULL (?,prod_activo), prod_imagen = IFNULL (?,prod_imagen) WHERE prod_id = ?",
            [prod_codigo,
                prod_nombre,
                prod_stock,
                prod_precio,
                prod_activo,
                prod_imagen,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ prod_id: 0, message: "Producto no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM productos WHERE prod_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }

}
export const deleteProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query("DELETE FROM productos WHERE prod_id = ?", [req.params.id]);
        if (result.affectedRows <= 0)
            return res.status(404).json({ id: 0, message: "No se pudo eliminar el producto" });
        res.sendStatus(202);

    } catch (error) {

        return res.status(500).json({ message: "Error en el servidor", error });
    }
}
