import Post from './post.model.js';
import Comment from '../comment/comment.model.js';

//GET /api/posts - obtener todas las publicaciones
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        res.json({
            message: 'Publicaciones obtenidas exitosamente',
            total: posts.length,
            posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener publicaciones', error: error.message });
    }
};

//GET /api/posts/:id - para obtener una publicación con sus comentarios
const getPostsById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const comments = await Comment.find({ post: id })
            .sort({
                createdAt: 1,
            });

        res.json({
            message: 'Publicación obtenida exitosamente',
            post,
            comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener publicación', error: error.message });
    }
};

// POST /api/posts - crear una publicación
const createPost = async (req, res) => {
    const { title, category, content } = req.body;

    try {
        const post = new Post({
            title,
            category,
            content,
            authorId: req.user.Id,
        });

        await post.save();

        res.status(201).json({
            message: 'Publicación creada exitosamente',
            post,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear publicación', error: error.message });
    }
};

//PUT /api/posts/:id - editar una publicación (solamente el autor lo puede hacer)
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, category, content } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        //verificar que el usuario sea el autor de la publicación
        if (post.authorId !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, category, content },
            { new: true, runValidators: true }
        );


        res.json({
            message: 'Publicación actualizada exitosamente',
            post: updatedPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar publicación', error: error.message });
    }
};

//DELETE /api/posts/:id - eliminar publicación (solamente si es el autor)
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        //verificar que el usuario sea el autor de la publicación
        if (post.authorId !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
        }

        //eliminar también los comentarios de la publicación
        await Comment.deleteMany({ post: id });
        await Post.findByIdAndDelete(id);

        res.json({ message: 'Publicación eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la publicación', error: error.message });
    }
}

export { getAllPosts, getPostsById, createPost, updatePost, deletePost };