import mongoose from 'mongoose'

export interface TypePosts {
    title: string,
    content: string,
    likes: number,
    deletedAt?: Date; // campo opcional
    user: mongoose.Types.ObjectId
}

