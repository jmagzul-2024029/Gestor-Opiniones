import { Router } from "express";
import { handleValidationErrors } from '../../middlewares/validation.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { createPostValidation, updatePostValidation } from "./post.validation.js";
import {
    getAllPosts,
    getPostsById,
    createPost,
    updatePost,
    deletePost,
} from "./post.controller.js";

const router = Router();

//GET /api/posts -listar todas las publicaciones
router.get('/', getAllPosts);

//GET /api/posts/:id - ver publicaciones con comentarios
router.get('/:id', getPostsById);

//Las siguientes rutas requieren autenticación
router.use(validateJWT);

//POST /api/posts - crear publicación
router.post('/', [...createPostValidation, handleValidationErrors], createPost);

//PUT /api/posts/:id - editar publicación
router.put('/:id', [...updatePostValidation, handleValidationErrors], updatePost);

//DELETE /api/posts/:id - eliminar publicación
router.delete('/:id', deletePost);

export default router;
