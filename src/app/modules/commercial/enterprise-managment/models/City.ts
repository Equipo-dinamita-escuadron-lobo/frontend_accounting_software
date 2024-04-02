

export interface City{
  id: number;
  name: string;
  cities: { id: number, name: string }[];
}
