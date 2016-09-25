import { Trip } from '../trip/trip';

export interface Auv {
    id: string;
    name?: string;
    description?: string;
    serial_number?: string;
    address?: string;
    active_trip: Trip;
    update_frequency: number;
}