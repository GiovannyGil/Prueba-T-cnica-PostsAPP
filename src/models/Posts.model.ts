import { Schema, model } from 'mongoose'
import {TypePosts} from '../types/Posts.type'

const PostSchema: Schema<TypePosts> = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

const Post = model<TypePosts>('Post', PostSchema)

export default Post