type ReviewsInterface = {
    _id?: string,
    product: string,
    rating: number,
    user: {_id:string, username: string },
    reviewMessage: string,
    createdAt: Date,
    updatedAt: Date,
}
export type { ReviewsInterface }