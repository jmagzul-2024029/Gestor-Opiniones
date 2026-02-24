import Comment from './comment.model.js';
import Post from '../posts/post.model.js';

// POST /api/comments - crear un comentario
const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        //verifica que la publicación ya exista
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const comment = new Comment({
            content,
            authorId: req.userId,
            post: postId,
        }); //crea el objeto solo en la memoria

        await comment.save(); //await para esperar a que se guarde el comentario en la base de datos antes de continuar con la ejecución del código

        res.status(201).json({
            message: 'Comentario creado exitosamente',
            comment,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear commentario', error: error.message });
    }
};

//PUT /api/comments/:id - editar un comentario (solamente el autor lo puede hacer)
const updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        //verificar que el usuario sea el autor del comentario
        if (comment.authorId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar este comentario' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content },
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Comentario actualizado exitosamente',
            comment: updatedComment,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el comentario', error: error.message });
    }
};

//DELETE /api/comment/:id - eliminar comentario (solo el autor)
const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        //verificar que el usuario sea el autor del comentario
        if (comment.authorId !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
        }

        await Comment.findByIdAndDelete(id); //espera a que elimine el comentario de la base de datos antes de continuar con la ejecución

        res.json({ message: 'Comentario eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el comentario', error: error.message });
    }
};

export { createComment, updateComment, deleteComment };