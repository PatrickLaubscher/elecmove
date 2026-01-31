import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../../shared/entities';
import { ReviewCreationDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly http = inject(HttpClient);

  getTopReviews() {
    return httpResource<Review[]>(() => '/api/reviews/top');
  }

  getAll() {
    return httpResource<Review[]>(() => '/api/reviews');
  }

  add(newReview: ReviewCreationDTO) {
    return this.http.post<Review>('/api/reviews', newReview);
  }

}
