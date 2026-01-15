import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Booking } from '../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class PdfReceiptService {

  constructor() { }

  /**
   * Génère un reçu PDF pour une réservation acceptée
   * @param booking Les données de la réservation
   */
  generateReceipt(booking: Booking): void {
    const doc = new jsPDF();

    // Configuration des couleurs
    const primaryColor = '#10B981'; // vert
    const darkColor = '#1F2937';
    const lightGray = '#6B7280';

    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(darkColor);
    doc.text('REÇU DE RÉSERVATION', 105, 20, { align: 'center' });

    // Ligne de séparation
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 28, 190, 28);

    // Informations de réservation
    doc.setFontSize(12);
    doc.setTextColor(lightGray);
    doc.text('Numéro de réservation:', 20, 40);
    doc.setTextColor(darkColor);
    doc.text(booking.id, 20, 47);

    doc.setTextColor(lightGray);
    doc.text('Date de création:', 140, 40);
    doc.setTextColor(darkColor);
    doc.text(new Date(booking.createdAt).toLocaleDateString('fr-FR'), 140, 47);

    // Section Client
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('INFORMATIONS CLIENT', 20, 65);

    doc.setFontSize(11);
    doc.setTextColor(darkColor);
    doc.text(`Nom: ${booking.user.firstname} ${booking.user.lastname}`, 20, 75);
    doc.text(`Email: ${booking.user.email}`, 20, 82);
    doc.text(`Mobile: ${booking.user.mobile}`, 20, 89);

    // Section Véhicule
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('VÉHICULE', 20, 105);

    doc.setFontSize(11);
    doc.setTextColor(darkColor);
    doc.text(`Marque: ${booking.car.brand}`, 20, 115);
    doc.text(`Type: ${booking.car.type}`, 20, 122);
    doc.text(`Immatriculation: ${booking.car.registration}`, 20, 129);

    // Section Borne de recharge
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('BORNE DE RECHARGE', 20, 145);

    doc.setFontSize(11);
    doc.setTextColor(darkColor);
    doc.text(`Nom: ${booking.station.name || 'Borne de recharge'}`, 20, 155);
    doc.text(`Puissance: ${booking.station.power}`, 20, 162);
    doc.text(`Adresse: ${booking.station.location.address}`, 20, 169);
    doc.text(`${booking.station.location.zipcode} ${booking.station.location.city}`, 20, 176);

    // Section Détails de la réservation
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('DÉTAILS DE LA RÉSERVATION', 20, 195);

    doc.setFontSize(11);
    doc.setTextColor(darkColor);
    const bookingDate = new Date(booking.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date: ${bookingDate}`, 20, 205);
    doc.text(`Horaire: de ${booking.startTime} à ${booking.endTime}`, 20, 212);
    doc.text(`Statut: ${booking.status.name}`, 20, 219);

    // Section Prix
    doc.setFillColor(primaryColor);
    doc.rect(20, 230, 170, 25, 'F');

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('PRIX TOTAL', 25, 240);
    doc.setFontSize(18);
    doc.text(`${booking.totalPrice.toFixed(2)} €`, 160, 242, { align: 'right' });

    // Pied de page
    doc.setFontSize(9);
    doc.setTextColor(lightGray);
    doc.text('ElecMove - Service de location de bornes de recharge', 105, 270, { align: 'center' });
    doc.text('Merci pour votre réservation !', 105, 276, { align: 'center' });

    // Génération et téléchargement du PDF
    const fileName = `Recu_Reservation_${booking.id}_${booking.user.lastname}.pdf`;
    doc.save(fileName);
  }
}
