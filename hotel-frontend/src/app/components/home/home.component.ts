import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  checkIn: string = '';
  checkOut: string = '';
  adults: number = 1;
  today: string = '';
  rooms: any[] = [];

  showWarningModal: boolean = false;
  modalMessage: string = '';

  constructor(
    private router: Router,
    private roomService: RoomService,
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        // Marrim vetëm 3 dhomat e para
        // Sigurohemi që map-imi të jetë i saktë me kolonat e DB
        this.rooms = data.slice(0, 3).map((room: any) => ({
          ...room,
          // Nëse në DB është 'image_url', e kthejmë në 'image' për HTML
          image: room.image_url || room.image 
        }));
      },
      error: (err) => console.error('Gabim gjatë marrjes së dhomave', err),
    });
  }

  searchRooms() {
    if (!this.checkIn || !this.checkOut) {
      this.openModal('Ju lutem plotësoni të gjitha datat!');
      return;
    }
    if (this.checkIn < this.today) {
      this.openModal('Data e hyrjes nuk mund të jetë në të shkuarën!');
      return;
    }
    if (this.checkOut <= this.checkIn) {
      this.openModal('Ju lutem kontrolloni daten e checkout!');
      return;
    }

    this.router.navigate(['/rooms'], {
      queryParams: {
        capacity: this.adults,
        checkin: this.checkIn,
        checkout: this.checkOut,
      },
    });
  }

  openModal(message: string) {
    this.modalMessage = message;
    this.showWarningModal = true;
  }

  closeModal() {
    this.showWarningModal = false;
  }
}