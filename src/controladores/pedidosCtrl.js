import e from "express";
import { conmysql } from "../db.js";

export const getPedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM pedidos");
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el pedido" });
    }
};

export const getPedidosid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            "SELECT * FROM pedidos WHERE ped_id = ?", [req.params.id]
        );

        if (result.length <= 0) {
            return res.status(404).json({ ped_id: 0, message: "No se encontró el pedido" });
        }
        return res.json(result[0]);

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const postPedidos =
    async (req, res) => {
        try {
            //console.log(req.body)
            const { cli_id, ped_fecha, usr_id, ped_estado } = req.body
            //console.log(prod_nombre)
            const [rows] = await conmysql.query('insert into pedidos (cli_id, ped_fecha, usr_id, ped_estado) values(?,?,?,?)',
                [cli_id, ped_fecha, usr_id, ped_estado])

            res.send({
                id: rows.insertId
            })
        } catch (error) {
            return res.status(500).json({ message: 'error del lado del servidor' })
        }
    };


export const putPedidos = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cli_id,
            ped_fecha,
            usr_id,
            ped_estado
        } = req.body;

        // Validar que los campos requeridos no sean nulos o indefinidos
        if ( !cli_id || !ped_fecha || !usr_id || !ped_estado ) {
            return res.status(400).json({ message: "Faltan datos requeridos para la actualización." });
        }

        // Ejecutar la consulta de actualización
        const [rows] = await conmysql.query(
            "UPDATE pedidos SET cli_id = ?, ped_fecha = ?, usr_id = ?, ped_estado = ? WHERE ped_id = ?",
            [cli_id,
                ped_fecha,
                usr_id,
                ped_estado,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ ped_id: 0, message: "Pedido no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM pedidos WHERE ped_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patchPedidos = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del productos desde los parámetros de la URL

        // Desestructurar los datos del cuerpo de la solicitud
        const {
            cli_id,
                ped_fecha,
                usr_id,
                ped_estado
                
        } = req.body;


        const [rows] = await conmysql.query(
            "UPDATE pedidos SET cli_id =IFNULL(?,cli_id) , ped_fecha =IFNULL (?,ped_fecha), usr_id =IFNULL(?,usr_id) , ped_estado =IFNULL(?,ped_estado) WHERE ped_id = ?",
            [cli_id,
                ped_fecha,
                usr_id,
                ped_estado,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ ped_id: 0, message: "Pedido no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM pedidos WHERE ped_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }

}
export const deletePedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query("DELETE FROM pedidos WHERE ped_id = ?", [req.params.id]);
        if (result.affectedRows <= 0)
            return res.status(404).json({ id: 0, message: "No se pudo eliminar el pedido" });
        res.sendStatus(202);

    } catch (error) {

        return res.status(500).json({ message: "Error en el servidor", error });
    }
}
