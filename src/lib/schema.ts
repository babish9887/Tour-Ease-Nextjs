export interface User {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "USER" | "GUIDE";
    }
    
    export interface Session {
      user?: User;
    }

    export interface CancelRequest {
      bookingId: number; // or string, depending on your actual type
      reason: string;
    }
    