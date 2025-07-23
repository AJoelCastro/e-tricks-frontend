export interface IPickUp {
    _id: string;
    city: string;
    address: string;
    cc: string;
    stand: string;
    contactNumber: string;
}

export interface IPickUpUpdate {
    city?: string;
    address?: string;
    cc?: string;
    stand?: string;
    contactNumber?: string;
}