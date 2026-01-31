import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../api/review/review.service';
import { Review } from '../../../../shared/entities';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-reviews.component.html',
  styleUrl: './customer-reviews.component.css'
})
export class CustomerReviewsComponent {

  private readonly reviewService = inject(ReviewService);

  topReviews = this.reviewService.getTopReviews();

  reviews = computed<Review[]>(() => {
    if (this.topReviews.hasValue()) {
      return this.topReviews.value() ?? [];
    }
    return [];
  });

  fallbackReviews = [
    { initials: 'ML', name: 'Marie L.', comment: 'Service excellent et rapide !' },
    { initials: 'PD', name: 'Pierre D.', comment: 'Tres satisfait de la recharge.' },
    { initials: 'SC', name: 'Sophie C.', comment: 'Application intuitive et pratique.' }
  ];

  getStarsArray(rate: number): number[] {
    return Array(rate).fill(0);
  }

  getEmptyStarsArray(rate: number): number[] {
    return Array(5 - rate).fill(0);
  }

  getInitials(firstname: string, lastname: string): string {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }

}
