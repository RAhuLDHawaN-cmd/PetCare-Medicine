export interface IProduct {
   id: string;
   title: string;
   description: string;
   brand: string;
   quantity: number;
   imageUrl?: string | null;
   createdAt: string;
   updatedAt: string;
}
