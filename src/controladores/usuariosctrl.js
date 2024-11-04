import e from "express";
import { conmysql } from "../db.js";
import bcrypt from 'bcrypt';
import { SECRET } from '../config.js';
import jwt from 'jsonwebtoken';


export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query("SELECT * FROM usuarios");
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const getUsuariosid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            "SELECT * FROM usuarios WHERE usr_id = ?", [req.params.id]
        );

        if (result.length <= 0) {
            return res.status(404).json({ usr_id: 0, message: "No se encontró el usuario" });
        }
        return res.json(result[0]);

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const postUsuarios =
    async (req, res) => {
        try {
            //console.log(req.body)
            const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body
            //console.log(usuario_nombre)
            const [rows] = await conmysql.query('insert into usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) values(?,?,?,?,?,?)',
                [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo])

            res.send({
                id: rows.insertId
            })
        } catch (error) {
            return res.status(500).json({ message: 'error del lado del servidor' })
        }
    };


export const putUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            usr_usuario,
            usr_clave,
            usr_nombre,
            usr_telefono,
            usr_correo,
            usr_activo
        } = req.body;

        // Validar que los campos requeridos no sean nulos o indefinidos
        if (!usr_usuario || !usr_clave || !usr_nombre || !usr_telefono || !usr_correo || !usr_activo) {
            return res.status(400).json({ message: "Faltan datos requeridos para la actualización." });
        }

        // Ejecutar la consulta de actualización
        const [rows] = await conmysql.query(
            "UPDATE usuarios SET usr_usuario = ?, usr_clave = ?, usr_nombre = ?, usr_telefono = ?, usr_correo = ?, usr_activo = ? WHERE usr_id = ?",
            [usr_usuario,
                usr_clave,
                usr_nombre,
                usr_telefono,
                usr_correo,
                usr_activo,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ usr_id: 0, message: "Usuario no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM usuarios WHERE usr_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patchUsuarios = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la URL

        // Desestructurar los datos del cuerpo de la solicitud
        const {
            usr_usuario,
            usr_clave,
            usr_nombre,
            usr_telefono,
            usr_correo,
            usr_activo
        } = req.body;


        const [rows] = await conmysql.query(
            "UPDATE usuarios SET usr_usuario =IFNULL(?,usr_usuario) , usr_clave =IFNULL (?,usr_clave), usr_nombre =IFNULL(?,usr_nombre) , usr_telefono =IFNULL(?,usr_telefono), usr_correo =IFNULL (?,usr_correo), usr_activo = IFNULL (?,usr_activo) WHERE usr_id = ?",
            [usr_usuario,
                usr_clave,
                usr_nombre,
                usr_telefono,
                usr_correo,
                usr_activo,
                id]
        );

        if (rows.affectedRows <= 0) {
            return res.status(404).json({ usr_id: 0, message: "Usuario no encontrado" });
        }
        const [filas] = await conmysql.query("SELECT * FROM usuarios WHERE usr_id = ?", [id]);
        res.json(filas[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }

}
export const deleteUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query("DELETE FROM usuarios WHERE usr_id = ?", [req.params.id]);
        if (result.affectedRows <= 0)
            return res.status(404).json({ id: 0, message: "No se pudo eliminar el usuario" });
        res.sendStatus(202);

    } catch (error) {

        return res.status(500).json({ message: "Error en el servidor", error });
    }
}

export const login = async (req, res) => {
    const {usr_usuario, usr_clave} = req.body;
    try {
        const [user] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usr_usuario]);

        if (user.length === 0) return res.status(404).json({message: "Usuario no encontrado"});

        const validPassword = await bcrypt.compare(usr_clave, user[0].usr_clave);
        if (!validPassword) return res.status(401).json({message: "Contraseña incorrecta"});

        const token = jwt.sign({ id: user[0].id, usr_usuario: user[0].usr.usuario }, SECRET, { expiresIn: '1h' });

        res.json({ message: 'Autenticación exitosa', token});

    } catch (error) {
        res.status(500).json({ message: "Error de autenticacion"});
    }
};
