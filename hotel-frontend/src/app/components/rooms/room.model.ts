// room.model.ts
export interface Room {
  room_ID: number;
  name: string;
  description: string;
  image_url: string;
  capacity: number;
  price: number;
  availability: string;
}