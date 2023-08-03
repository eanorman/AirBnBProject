import React, { useEffect, useState } from 'react';
import './Reviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReview } from '../../store/review/reviewActions';
import ReviewModal from '../ReviewModal/ReviewModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

function Reviews({ spot }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        dispatch(fetchReview(spot.id)).then(() => setLoading(true));
    }, [dispatch, spot.id])

    const reviewSelector = (state) => {
        return state.review
    }

    const review = useSelector(reviewSelector);
    const sessionUser = useSelector(state => state.session.user);



    if (loading) {
        const reviewArray = review.review.Reviews;
        let reviewUsers = [];
        if (reviewArray.length) {
            reviewUsers = reviewArray.map((review) => {
                return review.userId
            });
        }

        return (
            <div className='reviews-container'>
                {spot.numReviews > 0 ? (
                    spot.numReviews === 1 ? (
                        <h2>★{spot.avgStarRating} • {spot.numReviews} review</h2>
                    ) : (
                        <h2>★{spot.avgStarRating} • {spot.numReviews} reviews</h2>
                    )

                ) : (
                    <h2>★ New</h2>
                )}

{sessionUser && sessionUser.id !== spot.ownerId && !reviewUsers.includes(sessionUser.id) && (
          <OpenModalMenuItem
            modalComponent={<ReviewModal />}
            itemText="Post Your Review"
          />
        )}
                {reviewArray.length ? (
                    reviewArray.map(review => {
                        const dateObject = new Date(review.createdAt);
                        const options = { year: 'numeric', month: 'long' };
                        const formattedDate = dateObject.toLocaleString('en-US', options)
                        return (
                            <div className='review-container' key={review.id}>
                                <h3>{review.User.firstName}</h3>
                                <p className='date'>{formattedDate}</p>
                                <p className='review-text'>{review.review}</p>
                            </div>
                        )
                    })

                ) : (
                    spot.Owner.id !== sessionUser.id ? (
                        <div>
                            <p>Be the first to post a review!</p>
                        </div>
                    ) : (
                        <div className='hidden'>
                        </div>
                    )
                )}

            </div>
        )
    } else {
        return null;
    }
}

export default Reviews;
