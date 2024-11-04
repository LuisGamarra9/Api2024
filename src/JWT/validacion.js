import jwt from 'jsonwebtoken';
import {SECRET} from '../config.js';

export const verifyToken = (req, res, next) =>{
    const token = req.headers['autorizacion'];
    if (!token) return res.status(403).json({ message: 'Token no proporcionado'});

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalido o expirado' });
        req.userId = decoded.id;
        next();
    });
}