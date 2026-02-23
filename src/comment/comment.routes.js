import { Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors } from '../../middlewares/validation.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { createComment, updateComment, deleteComment } from './comment.controller.js';

const router = Router();

//Todas las rutas de comentarios requieren autenticación
router.use(validateJWT);

// POST /api/comments/:postId - agregar comentario a una publicación
router.post(
    '/:postId',
    [
        body('content')
            .trim()
            .notEmpty().withMessage('El contenido delcomentario es obligatorio')
            .isLength({ max: 500 }).withMessage(' El comentario no puede exceder los 500 carácteres'),

        handleValidationErrors,
    ],
    createComment
);

// PUT /api/comments/:id - editar un comentario
router.put(
    '/:id',
    [
        body('content')
            .trim()
            .notEmpty().withMessage('El comentario no puede estar vacío')
            .isLength({ max: 500 }).withMessage('El comentario no puede exceder los 500 carácteres'),

        handleValidationErrors,
    ],
    updateComment,
);

//DELETE /api/comments/:id - eliminar un comentario
router.delete('/:id', deleteComment);

export default router;