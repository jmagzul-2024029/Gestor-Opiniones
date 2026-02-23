'use strict';
import mongoose, { Schema, model } from 'mongoose';

const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, 'El contenido es obligatorio'],
            trim: true,
            minlength: [1, 'El comentario no puede estar vacío'],
            maxlength: [500, 'El comentario no puede exceder los 500 carácteres'],
        },
        authorId: {
            type: String,
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model('Comment', CommentSchema);