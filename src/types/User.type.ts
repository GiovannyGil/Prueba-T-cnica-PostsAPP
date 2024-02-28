import mongoose from 'mongoose';

export interface TypeUser {
    fullName: string,
    age: number,
    email: string,
    password: string,
    posts: mongoose.Types.ObjectId[],
    deletedAt?: Date; // campo opcional
}