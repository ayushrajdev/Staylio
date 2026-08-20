"""Domain-level exceptions raised by the service layer and translated to HTTP responses by the routers."""


class ReviewNotFoundError(Exception):
    def __init__(self, review_id: int):
        self.review_id = review_id
        super().__init__(f"Review with ID {review_id} not found")


class InvalidRatingError(Exception):
    def __init__(self, rating: int):
        self.rating = rating
        super().__init__("Rating must be between 1 and 5")
