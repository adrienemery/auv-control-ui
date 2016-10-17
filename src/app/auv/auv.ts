import { Trip } from '../trip/trip';

export interface Auv {
    id: string;
    name: string;
    mode: string
    description?: string;
    active_trip: Trip;
    update_frequency: number;
    target_lat?: number
    target_lng?: number
    
}