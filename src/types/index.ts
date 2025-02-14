export interface User {
  username: string;
  timezone: string;
  availability: {
    [date: string]: TimeSlot[];
  };
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface BookingSlot extends TimeSlot {
  username: string;
  date: string;
}