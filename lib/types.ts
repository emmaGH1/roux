export type OpenHour = {
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  open_time: string; // "17:00"
  close_time: string; // "23:00"
};

export type Special = {
  id: string;
  label: string;
  description: string;
  fly_reward: boolean;
};

export type RouxSpot = {
  id: string;
  name: string;
  neighborhood: string;
  cuisine: string[];
  price: number | null;
  lat: number;
  lng: number;
  hours: OpenHour[];
  specials: Special[];
  payments_enabled: boolean;
  is_club: boolean;
};

export type RouxResult = RouxSpot & {
  kmFromMid: number;
  openNow: boolean;
  hasFlySpecial: boolean;
};
