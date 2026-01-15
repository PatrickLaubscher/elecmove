import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Booking } from '../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  /**
   * Exporte les réservations passées au format Excel
   * @param bookings Liste des réservations à exporter
   * @param filename Nom du fichier (optionnel)
   */
  exportBookingsToExcel(bookings: Booking[], filename: string = 'Reservations_Passees'): void {
    // Transformer les données en format tabulaire
    const data = bookings.map(booking => ({
      'Numéro de réservation': booking.id,
      'Date de réservation': new Date(booking.date).toLocaleDateString('fr-FR'),
      'Heure début': booking.startTime,
      'Heure fin': booking.endTime,
      'Client': `${booking.user.firstname} ${booking.user.lastname}`,
      'Email': booking.user.email,
      'Mobile': booking.user.mobile,
      'Véhicule': `${booking.car.brand} ${booking.car.type}`,
      'Immatriculation': booking.car.registration,
      'Borne': booking.station.name || 'Borne de recharge',
      'Puissance': booking.station.power,
      'Adresse': booking.station.location.address,
      'Code postal': booking.station.location.zipcode,
      'Ville': booking.station.location.city,
      'Prix total (€)': booking.totalPrice.toFixed(2),
      'Statut': booking.status.name,
      'Créée le': new Date(booking.createdAt).toLocaleDateString('fr-FR')
    }));

    // Créer une feuille de calcul
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Définir la largeur des colonnes
    const columnWidths = [
      { wch: 20 }, // Numéro de réservation
      { wch: 18 }, // Date de réservation
      { wch: 12 }, // Heure début
      { wch: 12 }, // Heure fin
      { wch: 25 }, // Client
      { wch: 30 }, // Email
      { wch: 15 }, // Mobile
      { wch: 25 }, // Véhicule
      { wch: 18 }, // Immatriculation
      { wch: 25 }, // Borne
      { wch: 12 }, // Puissance
      { wch: 35 }, // Adresse
      { wch: 12 }, // Code postal
      { wch: 20 }, // Ville
      { wch: 15 }, // Prix total
      { wch: 15 }, // Statut
      { wch: 18 }  // Créée le
    ];
    worksheet['!cols'] = columnWidths;

    // Créer un classeur
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Réservations': worksheet },
      SheetNames: ['Réservations']
    };

    // Générer le fichier Excel et le télécharger
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, filename);
  }

  /**
   * Sauvegarde le buffer comme fichier Excel
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `${fileName}_${timestamp}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}
