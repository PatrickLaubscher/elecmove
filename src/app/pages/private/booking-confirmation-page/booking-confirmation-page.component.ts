import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../api/review/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-confirmation-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking-confirmation-page.component.html',
  styleUrl: './booking-confirmation-page.component.css'
})
export class BookingConfirmationPageComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly reviewService = inject(ReviewService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly serverError = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly hoveredRating = signal(0);
  protected readonly selectedRating = signal(0);

  reviewForm = this.fb.group({
    rate: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  setRating(rate: number) {
    this.selectedRating.set(rate);
    this.reviewForm.patchValue({ rate });
  }

  onHoverRating(rating: number) {
    this.hoveredRating.set(rating);
  }

  onLeaveRating() {
    this.hoveredRating.set(0);
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.serverError.set('');

    const reviewData = {
      rate: this.reviewForm.value.rate!,
      comment: this.reviewForm.value.comment!
    };

    this.reviewService.add(reviewData).subscribe({
      next: () => {
        this.snackBar.open('Merci pour votre avis !', 'OK', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.router.navigate(['/private']);
      },
      error: () => {
        this.serverError.set('Une erreur est survenue lors de l\'envoi de votre avis');
        this.isSubmitting.set(false);
      }
    });
  }

  skipReview() {
    this.router.navigate(['/private']);
  }

}
