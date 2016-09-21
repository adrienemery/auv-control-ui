// just an interface for type safety.
export interface Waypoint {
    lat: number;
    lng: number;
    order?: number;
    label?: string;
    draggable?: boolean;
}

export class Trip {
  id: number;
  name: string;
  waypoints: Waypoint[] = [];

  constructor() {
      this.name = 'New Trip';
  }
}