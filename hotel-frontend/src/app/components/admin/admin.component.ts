import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RoomService } from '../../services/room.services';
import { ServicesService } from '../../services/services.service';
import { BookingService } from '../../services/booking.service';
import { ContactService } from '../../services/contact.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  rooms: any[] = [];
  roomTypes: any[] = [];
  services: any[] = [];
  invoices: any[] = [];
  bookings: any[] = [];
  contact: any[] = [];
  activeTab: string = 'rooms';

  // Gjendjet e Modaleve - Rooms
  showModal: boolean = false;
  showEditModal: boolean = false;
  showAddModal: boolean = false;

  // Gjendjet e Modaleve - Services
  showAddServiceModal: boolean = false;
  showEditServiceModal: boolean = false;
  showDeleteServiceModal: boolean = false;

  selectedBookingId: number | null = null;
  selectedRoomID: number | null = null;
  selectedRoom: any = {};
  selectedServiceId: number | null = null;
  selectedService: any = {};

  newRoom: any = {
    room_Type_ID: null,
    floor:        0,
    description:  '',
    image_url:    '',
    capacity:     1,
    price:        0,
    availability: 'Available',
    previewName:  ''
  };

  newService: any = {
    service_Name:        '',
    service_Description: '',
    service_Price:       0,
    is_Included:         0
  };

  constructor(
    private http: HttpClient,
    private roomService: RoomService,
    private bookingService: BookingService,
    private contactService: ContactService,
    private servicesService: ServicesService,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadRoomTypes();
    this.loadBookings();
    this.loadServices();
    this.loadContacts();
    this.loadAllInvoices();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'invoices') {
      this.loadAllInvoices();
    }
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.rooms = res.data;
        }
      },
      error: (err) => console.error('Gabim gjatë ngarkimit të dhomave:', err),
    });
  }

  loadRoomTypes() {
    this.http.get('http://localhost:8000/api/room_type/getRoomType.php').subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.roomTypes = res.data;
        }
      },
      error: (err) => console.error('Gabim gjatë ngarkimit të llojeve:', err),
    });
  }

  loadServices() {
    this.servicesService.getServices().subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.services = res.data;
        }
      },
      error: (err) => console.error('Gabim gjatë ngarkimit të shërbimeve:', err),
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.bookings = data.data;
        }
      },
      error: (err) => console.error('Gabim gjatë ngarkimit të rezervimeve:', err),
    });
  }

  loadContacts() {
    this.contactService.getContact().subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.contact = data.data;
        }
      },
      error: (err) => console.error('Gabim gjatë ngarkimit të mesazheve:', err),
    });
  }

  loadAllInvoices() {
    this.http.get('http://localhost:8000/api/admin/getInvoices.php').subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.invoices = res.data;
        }
      },
      error: (err) => console.error('Gabim në ngarkimin e faturave:', err),
    });
  }

  getTotalInvoiced(): number {
    return this.invoices.reduce((acc, inv) => acc + parseFloat(inv.price || 0), 0);
  }

  updateInvoiceStatus(invoiceId: number, newStatus: string) {
    this.http.post('http://localhost:8000/api/admin/updateInvoiceStatus.php', {
      invoice_id: invoiceId,
      status: newStatus,
    }).subscribe({
      next: () => {
        alert('Statusi u përditësua me sukses!');
        this.loadAllInvoices();
      },
      error: () => alert('Gabim gjatë përditësimit.'),
    });
  }

  downloadInvoicePDF(invoice: any) {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(197, 160, 89);
    doc.text('GRAND HORIZON - HOTEL LUXURY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Dashboard Administrativ - Faturë Zyrtare', 105, 28, { align: 'center' });
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`ID E FATURËS: #INV-${invoice.invoice_ID}`, 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(`Klienti: ${invoice.user_name} ${invoice.user_surname}`, 20, 55);
    doc.text(`Dhoma: ${invoice.room_name}`, 20, 65);
    doc.text(`Data e Rezervimit: ${invoice.check_In_Date}`, 20, 75);
    doc.text(`Statusi: ${invoice.status}`, 20, 85);
    autoTable(doc, {
      startY: 95,
      head: [['Përshkrimi', 'Çmimi']],
      body: [
        [`Akomodimi në ${invoice.room_name}`, `${invoice.price}€`],
        [
          { content: 'TOTALI PËR TË PAGUAR', styles: { fontStyle: 'bold' } },
          { content: `${invoice.price}€`, styles: { fontStyle: 'bold' } },
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [197, 160, 89] },
      styles: { fontSize: 11 },
    });
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Kjo faturë është gjeneruar automatikisht nga sistemi Grand Horizon.', 105, finalY, { align: 'center' });
    doc.save(`Fatura_Admin_${invoice.invoice_ID}.pdf`);
  }

  // ==================== ROOMS ====================

  openDeleteModal(id: number) {
    this.selectedBookingId = id;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.selectedBookingId = null;
  }

  deleteBooking() {
    if (this.selectedBookingId !== null) {
      this.bookingService.deleteBooking(this.selectedBookingId).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.booking_ID !== this.selectedBookingId);
          this.closeDeleteModal();
        },
        error: (err: any) => {
          console.error('Gabim gjatë fshirjes:', err);
          alert('Fshirja e rezervimit dështoi!');
          this.closeDeleteModal();
        },
      });
    }
  }

  openDeleteModalRoom(id: number) {
    this.selectedRoomID = id;
    this.showModal = true;
  }

  closeDeleteModalRoom() {
    this.showModal = false;
    this.selectedRoomID = null;
  }

  deleteRoom() {
    if (this.selectedRoomID !== null) {
      this.roomService.deleteRoom(this.selectedRoomID).subscribe({
        next: () => {
          this.rooms = this.rooms.filter(room => room.room_ID !== this.selectedRoomID);
          this.closeDeleteModalRoom();
        },
        error: (err: any) => {
          console.error('Gabim:', err);
          alert('Gabim gjatë fshirjes së dhomës!');
          this.closeDeleteModalRoom();
        }
      });
    }
  }

  openEditModal(room: any) {
    this.selectedRoom = { ...room };
    this.showEditModal = true;
    setTimeout(() => { this.onRoomTypeOrFloorChange(); }, 100);
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRoom = {};
  }

  updateRoom() {
    if (this.selectedRoom && this.selectedRoom.room_ID) {
      this.roomService.updateRoom(this.selectedRoom.room_ID, this.selectedRoom).subscribe({
        next: (res: any) => {
          if (res && res.status === 'success') {
            alert('Dhoma u modifikua me sukses!');
            const matchedType = this.roomTypes.find(t => t.room_Type_ID == this.selectedRoom.room_Type_ID);
            if (matchedType) {
              this.selectedRoom.room_type = matchedType.type;
            }
            const index = this.rooms.findIndex(r => r.room_ID === this.selectedRoom.room_ID);
            if (index !== -1) {
              this.rooms[index] = { ...this.selectedRoom };
            }
            this.closeEditModal();
          } else {
            alert('Gabim: ' + (res.message || 'Dështoi ruajtja.'));
          }
        },
        error: (err: any) => console.error('Gabim gjatë modifikimit:', err)
      });
    }
  }

  onRoomTypeOrFloorChange() {
    if (this.selectedRoom && this.selectedRoom.room_Type_ID) {
      const matchedType = this.roomTypes.find(t => t.room_Type_ID == this.selectedRoom.room_Type_ID);
      if (matchedType) {
        const floorVal = this.selectedRoom.floor ?? 0;
        const roomIDStr = this.selectedRoom.room_ID < 10
          ? '0' + this.selectedRoom.room_ID
          : this.selectedRoom.room_ID;
        this.selectedRoom.name = matchedType.type + ' ' + floorVal + roomIDStr;
      }
    }
  }

  addRoom() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newRoom = {
      room_Type_ID: null, floor: 0, description: '',
      image_url: '', capacity: 1, price: 0,
      availability: 'Available', previewName: ''
    };
  }

  onNewRoomTypeOrFloorChange() {
    if (this.newRoom.room_Type_ID) {
      const matchedType = this.roomTypes.find(t => t.room_Type_ID == this.newRoom.room_Type_ID);
      if (matchedType) {
        this.newRoom.previewName = matchedType.type + ' ' + this.newRoom.floor + '??';
      }
      const matchedRoom = this.rooms.find(r => r.room_Type_ID == this.newRoom.room_Type_ID);
      if (matchedRoom) {
        this.newRoom.image_url = matchedRoom.image_url;
      }
    }
  }

  submitAddRoom() {
    if (!this.newRoom.room_Type_ID || !this.newRoom.price) {
      alert('Tipi dhe çmimi janë të detyrueshme!');
      return;
    }
    this.http.post('http://localhost:8000/api/room/createRoom.php', this.newRoom).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Dhoma u shtua me sukses!');
          this.loadRooms();
          this.closeAddModal();
        } else {
          alert('Gabim: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Gabim gjatë shtimit:', err);
        alert('Ndodhi një gabim!');
      }
    });
  }

  // ==================== SERVICES ====================

  // SHTO SHËRBIM
  openAddServiceModal() {
    this.newService = {
      service_Name:        '',
      service_Description: '',
      service_Price:       0,
      is_Included:         0
    };
    this.showAddServiceModal = true;
  }

  closeAddServiceModal() {
    this.showAddServiceModal = false;
  }

  submitAddService() {
    if (!this.newService.service_Name || !this.newService.service_Description) {
      alert('Emri dhe përshkrimi janë të detyrueshme!');
      return;
    }
    this.http.post(
      'http://localhost:8000/api/services/createService.php',
      this.newService
    ).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Shërbimi u shtua me sukses!');
          this.loadServices();
          this.closeAddServiceModal();
        } else {
          alert('Gabim: ' + res.message);
        }
      },
      error: (err) => console.error('Gabim gjatë shtimit të shërbimit:', err)
    });
  }

  // MODIFIKO SHËRBIM
  openEditServiceModal(service: any) {
    this.selectedService = { ...service };
    this.showEditServiceModal = true;
  }

  closeEditServiceModal() {
    this.showEditServiceModal = false;
    this.selectedService = {};
  }

  updateService() {
    if (!this.selectedService.service_Name || !this.selectedService.service_Description) {
      alert('Emri dhe përshkrimi janë të detyrueshme!');
      return;
    }
    this.http.post(
      'http://localhost:8000/api/services/updateService.php',
      this.selectedService
    ).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          alert('Shërbimi u modifikua me sukses!');
          const index = this.services.findIndex(
            s => s.service_ID === this.selectedService.service_ID
          );
          if (index !== -1) {
            this.services[index] = { ...this.selectedService };
          }
          this.closeEditServiceModal();
        } else {
          alert('Gabim: ' + res.message);
        }
      },
      error: (err) => console.error('Gabim gjatë modifikimit të shërbimit:', err)
    });
  }

  // FSHI SHËRBIM
  openDeleteServiceModal(id: number) {
    this.selectedServiceId = id;
    this.showDeleteServiceModal = true;
  }

  closeDeleteServiceModal() {
    this.showDeleteServiceModal = false;
    this.selectedServiceId = null;
  }

  deleteService() {
    if (this.selectedServiceId !== null) {
      this.http.delete(
        `http://localhost:8000/api/services/deleteService.php?id=${this.selectedServiceId}`
      ).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.services = this.services.filter(
              s => s.service_ID !== this.selectedServiceId
            );
            this.closeDeleteServiceModal();
          } else {
            alert('Gabim: ' + res.message);
          }
        },
        error: (err) => console.error('Gabim gjatë fshirjes së shërbimit:', err)
      });
    }
  }
}
