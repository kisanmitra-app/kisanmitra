import { Profile } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";
import axios from "axios";
import { WeatherData } from "./types";

export const Query = {
  // get current weather
  getWeather: async (_: any, __: any, context: IGraphQLContext) => {
    const user = context.get("user");

    const profile = await Profile.findOne({ user: user?.id });

    if (!profile || !profile.location) {
      throw new Error("Profile not found");
    }

    console.log("Fetching weather for profile:", profile);

    const { coordinates, type } = profile.location;

    if (
      type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      throw new Error("Invalid location data");
    }

    const [lon, lat] = coordinates;

    try {
      const { data } = await axios.get<WeatherData>(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`
      );

      console.log("Weather data fetched:", data);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
