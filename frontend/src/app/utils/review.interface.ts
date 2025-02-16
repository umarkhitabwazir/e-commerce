type ReviewsInterface = {
    product: string,
    rating: number,
    user: { fullName: string },
    reviewMessage: string,
    createdAt: Date,
    updatedAt: Date,
}
export type { ReviewsInterface }