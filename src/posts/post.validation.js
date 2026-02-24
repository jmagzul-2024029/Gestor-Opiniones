import { body } from "express-validator";

const createPostValidation = [/*
    body('title', 'El título es obligatorio').notEmpty().trim(),
    body('title', 'El título debe tener mínimo 3 carácteres').isLength({ min: 3 }).trim(),
    body('title', 'El título no puede exceder los 150 carácteres').isLength({ max: 150 }),*/

    body('title').trim()
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('El título debe tener mínimo 3 carácteres')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 carácteres'), //se puede usar de ambas maneras aunque este es más limpio

    body('category', 'La categoría es obligatoria').notEmpty().trim(),
    body('category', 'La categoría no es válida').isIn(['Tecnología', 'Salud', 'Educación', 'Entretenimiento', 'Deportes', 'Ciencias', 'Política', 'Otros']),
    body('content', 'El contenido es obligatorio').notEmpty().trim(),
    body('content', 'El contenido debe tener mínimo 10 carácteres').isLength({ min: 10 }).trim(),
];

const updatePostValidation = [
    body('title', 'El título debe tener mínimo 3 carácteres')
        .optional() //valida solo si el campo está en la request (usar solo en update)
        .isLength({ min: 3 })
        .trim(),
    body('title', 'El título no puede exceder los 150 carácteres').optional().isLength({ max: 150 }).trim(),
    body('category', 'La categoría no es válida').optional().isIn([
        'Tecnología',
        'Salud',
        'Educación',
        'Entretenimiento',
        'Deportes',
        'Ciencias',
        'Política',
        'Otros',
    ]),
    body('content', 'El contenido debe tener mínimo 10 carácteres').optional().isLength({ min: 10 }).trim(),
];

export { createPostValidation, updatePostValidation };