import e from "express";
import { conmysql } from "../db.js";

export const getDetalles = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM pedidos_detalle");
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener detalles del pedido" });
    }
};

export const getDetallesid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            "SELECT * FROM pedidos_detalle WHERE det_id = ?", [req.params.id]
        );

        if (result.length <= 0) {
            return res.status(404).json({ det_id: 0, message: "No se encontró el detalle del pedido" });
        }
        return res.json(result[0]);

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const postDetalles =
    async (req, res) => {
        try {
            //console.log(req.body)
            const { prod_id, ped_id, det_cantidad, det_precio } = req.body
            //console.log(prod_nombre)
            const [rows] = await conmysql.query('insert into pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) values(?,?,?,?)',
                [prod_id, ped_id, det_cantidad, det_precio])

            res.send({
                id: rows.insertId
            })
        } catch (error) {
            return res.status(500).json({ message: 'error del lado del servidor' })
        }
    };


export const putDetalles = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_id,
            ped_id,
            det_cantidad,
            det_precio

        } = req.body;

        // Validar que los campos requeridos no sean nulos o indefinidos
        if (!prod_id || !ped_id || !det_cantidad || !det_precio) {
            return res.status(400).json({ message: "Faltan datos requeridos para la actualización." });
        }

        // Ejecutar la consulta de actualización
        const [rows] = await conmysql.query(
            "UPDATE pedidos_detalle SET prod_id = ?, ped_id = ?, det_cantidad = ?, det_precio = ? WHERE det_id = ?",
            [prod_id,
                ped_id,
                det_cantidad,
                det_precio,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ det_id: 0, message: "Detalle del pedido no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM pedidos_detalle WHERE det_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patchDetalles = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del productos desde los parámetros de la URL

        // Desestructurar los datos del cuerpo de la solicitud
        const {
            prod_id,
            ped_id,
            det_cantidad,
            det_precio
        } = req.body;


        const [rows] = await conmysql.query(
            "UPDATE pedidos_detalle SET prod_id =IFNULL(?,prod_id) , ped_id =IFNULL (?,ped_id), det_cantidad =IFNULL(?,det_cantidad) , det_precio =IFNULL(?,det_precio) WHERE det_id = ?",
            [prod_id,
                ped_id,
                det_cantidad,
                det_precio,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ det_id: 0, message: "Detalle del pedido no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM pedidos_detalle WHERE det_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }

}
export const deleteDetalles = async (req, res) => {
    try {
        const [result] = await conmysql.query("DELETE FROM pedidos_detalle WHERE det_id = ?", [req.params.id]);
        if (result.affectedRows <= 0)
            return res.status(404).json({ id: 0, message: "No se pudo eliminar el producto" });
        res.sendStatus(202);

    } catch (error) {

        return res.status(500).json({ message: "Error en el servidor", error });
    }
}
