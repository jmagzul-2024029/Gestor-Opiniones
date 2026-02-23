'use strict';
import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true, //elimina espacios en blanco al inicio y al final
            minlength: [3, 'El título debe tener mínimo 3 caracteres'],
            maxlength: [150, 'El título no puede exceder los 150 caracteres'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true,
            enum: {
                values: ['Tecnología', 'Salud', 'Educación', 'Entretenimiento', 'Deportes', 'Ciencias', 'Política', 'Otros'],
                message: 'La categoría debe ser una de las siguientes: Tecnología, Salud, Educación, Entretenimiento, Deportes, Ciencias, Política, Otros',
            }
        },
        content: {
            type: String,
            required: [true, 'El contenido es obligatorio'],
            trim: true, //elimina espacios en blanco al inicio y al final
            minlength: [10, 'El contenido debe tener mínimo 10 caracteres'],
        },
        authorId: {
            type: String,
            required: [true, 'El id del autor es obligatorio'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model('Post', PostSchema);