import restaurants from "../../fixtures/restaurants.json";
import type { RouxSpot } from "../types";

export function fixtureSpots(): RouxSpot[] {
  return restaurants as RouxSpot[];
}

export function fixtureSpot(id: string): RouxSpot | undefined {
  return fixtureSpots().find((s) => s.id === id);
}
