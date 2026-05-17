import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss' // Ndryshuar në .scss siç e ke ti
})
export class RoomsComponent implements OnInit {
  
  // Filtri default (Shfaq të gjitha dhomat në fillim)
  selectedCategory: string = 'all';

  // Ky është array që më vonë do ta popullosh me dhomat që vijnë nga PHP (psh: data.data)
  rooms: any[] = [
    {
      id: 1,
      name: 'Deluxe Double Room',
      category: 'deluxe',
      price: 85,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      description: 'Një dhomë luksoze me krevat king-size dhe pamje nga kopshti i hotelit.',
      guests: 2,
      features: [
        { icon: 'bi-wifi', label: 'Wifi' },
        { icon: 'bi-tv', label: 'Smart TV' },
        { icon: 'bi-snow', label: 'AC' }
      ]
    },
    {
      id: 2,
      name: 'Executive Suite',
      category: 'suite',
      price: 150,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      description: 'Suiten më elegante me dhomë ndenjeje të veçantë dhe Jacuzzi privat.',
      guests: 3,
      features: [
        { icon: 'bi-wifi', label: 'Wifi' },
        { icon: 'bi-cup-straw', label: 'Mini Bar' },
        { icon: 'bi-hot-tub', label: 'Jacuzzi' }
      ]
    },
    {
      id: 3,
      name: 'Standard Twin Room',
      category: 'standard',
      price: 60,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
      description: 'Dhomë komode me dy krevate teke, ideale për udhëtime pune.',
      guests: 2,
      features: [
        { icon: 'bi-wifi', label: 'Wifi' },
        { icon: 'bi-snow', label: 'AC' }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Këtu më vonë do të bësh thirrjen e shërbimit të PHP-së, psh:
    // this.roomService.getRooms().subscribe(data => this.rooms = data);
  }

  // Funksioni që kap klikimin e butonave në HTML dhe ndryshon filtrin
  setFilter(category: string): void {
    this.selectedCategory = category;
  }

  // "Getter" i cili kthen automatikisht vetëm dhomat e filtruara te HTML-ja
  get filteredRooms(): any[] {
    if (this.selectedCategory === 'all') {
      return this.rooms;
    }
    return this.rooms.filter(room => room.category === this.selectedCategory);
  }
}