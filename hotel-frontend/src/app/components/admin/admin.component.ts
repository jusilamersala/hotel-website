import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.services';
import { StaffService } from '../../services/staff.service';
import { BookingService } from '../../services/booking.service'; // Shtohet për të marrë rezervimet/faturat

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  rooms: any[] = [];
  staff: any[] = [];
  invoices: any[] = []; // Zëvendësoi 'timetables' për të menaxhuar faturat
  activeTab: string = 'rooms';

  constructor(
    private roomService: RoomService,
    private staffService: StaffService,
    private bookingService: BookingService // Injektohet shërbimi i rezervimeve
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadStaff();
    this.loadAllInvoices(); // Ngarkon faturat sapo hapet faqja
  }

  // --- NGARKIMI I TË DHËNAVE ---

  loadRooms() {
    this.roomService.getRooms().subscribe((data: any) => {
      if (data.status === 'success') {
        this.rooms = data.data;
      }
    });
  }

  loadStaff() {
    this.staffService.getStaff().subscribe((data: any) => {
      if (data.status === 'success') {
        this.staff = data.data;
      }
    });
  }

  loadAllInvoices() {
    this.bookingService.getBookings().subscribe((data: any) => {
      if (data.status === 'success') {
        // Merr të gjitha rezervimet që do të shërbejnë si fatura për adminin
        this.invoices = data.data;
      }
    });
  }

  // --- FUNKSIONET NDURMËSE PËR MANAGEMENT ---

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Llogarit shumën totale të fituar nga faturat e konfirmuara
  getTotalInvoiced(): number {
    return this.invoices
      .filter(i => i.status === 'Confirmed')
      .reduce((sum, i) => sum + Number(i.price || 0), 0);
  }

  // Thërret skedarin PHP në backend për të gjeneruar faturën e klientit specifik
  downloadInvoicePDF(userId: number) {
    const backendUrl = `http://localhost/hotel-website/hotel-backend/gjenero-fature.php?user_id=${userId}`;
    window.open(backendUrl, '_blank');
  }

  // --- CRUD PËR DHOMAT (Rooms) ---

  addRoom() {
    // Implemento modalin ose formën për shtim
  }

  editRoom(room: any) {
    // Implemento modifikimin
  }

  deleteRoom(id: number) {
    if (confirm("A jeni të sigurt që dëshironi të fshini këtë dhomë?")) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
      });
    }
  }

  // --- CRUD PËR STAFIN (Staff) ---

  addStaff() {
    // Implemento shtimin e stafit
  }

  editStaff(staff: any) {
    // Implemento modifikimin e stafit
  }

  deleteStaff(id: number) {
    if (confirm("A jeni të sigurt që dëshironi të hiqni këtë pjesëtar të stafit?")) {
      this.staffService.deleteStaff(id).subscribe(() => {
        this.loadStaff();
      });
    }
  }
}