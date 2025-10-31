import { Worker } from "bullmq";
import { CONSTS } from "~/config";
import { redis } from "~/lib";
import axios from "axios";
import { Profile } from "@kisan-mitra/schemas";

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

export interface DangerousWeatherConditions {
  isDangerous: boolean;
  reasons: string[];
  severity: "low" | "medium" | "high";
}

// Weather codes from Open-Meteo API
// Source: https://open-meteo.com/en/docs
const DANGEROUS_WEATHER_CODES = {
  THUNDERSTORM: [95, 96, 99], // Thunderstorm with or without hail
  HEAVY_RAIN: [65, 67, 81, 82], // Heavy rain showers
  FREEZING_RAIN: [56, 57, 66, 67], // Freezing rain
  HEAVY_SNOW: [75, 77, 85, 86], // Heavy snow
  EXTREME_CODES: [95, 96, 99], // Thunderstorms with hail - extreme danger
};

const checkDangerousWeather = (
  weatherData: WeatherData
): DangerousWeatherConditions => {
  const reasons: string[] = [];
  let severity: "low" | "medium" | "high" = "low" as "low" | "medium" | "high";

  // Get weather data for next 24 hours (current + next 23 hours)
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const hourlyTimes = weatherData.hourly.time.map((t) => new Date(t));
  const next24HourIndices = hourlyTimes
    .map((time, index) => (time >= now && time <= next24Hours ? index : -1))
    .filter((index) => index !== -1);

  // Check hourly data for the next 24 hours
  const next24HourTemps = next24HourIndices.map(
    (i) => weatherData.hourly.temperature_2m[i]
  );
  const next24HourWindSpeeds = next24HourIndices.map(
    (i) => weatherData.hourly.wind_speed_10m[i]
  );
  const next24HourHumidity = next24HourIndices.map(
    (i) => weatherData.hourly.relative_humidity_2m[i]
  );

  // Check tomorrow's daily weather code
  const tomorrowWeatherCode = weatherData.daily.weather_code[1];
  const tomorrowPrecipitation = weatherData.daily.precipitation_sum[1];

  // Check for extreme temperature (harmful for crops)
  const maxTemp = Math.max(...next24HourTemps);
  const minTemp = Math.min(...next24HourTemps);

  if (maxTemp > 40) {
    reasons.push(`Extreme heat expected: ${maxTemp.toFixed(1)}°C`);
    severity = "high";
  } else if (maxTemp > 35) {
    reasons.push(`High temperature expected: ${maxTemp.toFixed(1)}°C`);
    if (severity !== "high") severity = "medium";
  }

  if (minTemp < 0) {
    reasons.push(`Freezing conditions expected: ${minTemp.toFixed(1)}°C`);
    severity = "high";
  } else if (minTemp < 5) {
    reasons.push(`Cold conditions expected: ${minTemp.toFixed(1)}°C`);
    if (severity !== "high") severity = "medium";
  }

  // Check for dangerous wind speeds (>50 km/h is concerning for crops)
  const maxWindSpeed = Math.max(...next24HourWindSpeeds);
  if (maxWindSpeed > 70) {
    reasons.push(`Severe wind expected: ${maxWindSpeed.toFixed(1)} km/h`);
    severity = "high";
  } else if (maxWindSpeed > 50) {
    reasons.push(`Strong wind expected: ${maxWindSpeed.toFixed(1)} km/h`);
    if (severity !== "high") severity = "medium";
  }

  // Check for extreme weather conditions based on weather codes
  if (DANGEROUS_WEATHER_CODES.EXTREME_CODES.includes(tomorrowWeatherCode)) {
    reasons.push("Thunderstorm with possible hail expected");
    severity = "high";
  } else if (
    DANGEROUS_WEATHER_CODES.THUNDERSTORM.includes(tomorrowWeatherCode)
  ) {
    reasons.push("Thunderstorm expected");
    if (severity !== "high") severity = "medium";
  } else if (DANGEROUS_WEATHER_CODES.HEAVY_RAIN.includes(tomorrowWeatherCode)) {
    reasons.push("Heavy rain expected");
    if (severity !== "high") severity = "medium";
  } else if (
    DANGEROUS_WEATHER_CODES.FREEZING_RAIN.includes(tomorrowWeatherCode)
  ) {
    reasons.push("Freezing rain expected");
    severity = "high";
  } else if (DANGEROUS_WEATHER_CODES.HEAVY_SNOW.includes(tomorrowWeatherCode)) {
    reasons.push("Heavy snow expected");
    severity = "high";
  }

  // Check for heavy precipitation
  if (tomorrowPrecipitation > 50) {
    reasons.push(
      `Heavy precipitation expected: ${tomorrowPrecipitation.toFixed(1)}mm`
    );
    severity = "high";
  } else if (tomorrowPrecipitation > 25) {
    reasons.push(
      `Moderate to heavy precipitation expected: ${tomorrowPrecipitation.toFixed(
        1
      )}mm`
    );
    if (severity !== "high") severity = "medium";
  }

  // Check for extreme humidity (very high or very low)
  const avgHumidity =
    next24HourHumidity.reduce((a, b) => a + b, 0) / next24HourHumidity.length;
  if (avgHumidity > 90) {
    reasons.push(`Very high humidity expected: ${avgHumidity.toFixed(0)}%`);
    if (severity === "low") severity = "medium";
  } else if (avgHumidity < 20) {
    reasons.push(`Very low humidity expected: ${avgHumidity.toFixed(0)}%`);
    if (severity === "low") severity = "medium";
  }

  return {
    isDangerous: reasons.length > 0,
    reasons,
    severity,
  };
};

const sendWeatherNotification = async (
  userId: string,
  conditions: DangerousWeatherConditions,
  weatherData: WeatherData
) => {
  // TODO: Implement actual notification service (push notification, SMS, email, etc.)
  // Placeholder: In production, integrate with:
  // - Push notification service (Firebase, OneSignal, etc.)
  // - SMS service (Twilio, AWS SNS, etc.)
  // - Email service (SendGrid, AWS SES, etc.)
  // - In-app notifications
};
const getWeather = async (lat: number, lon: number) => {
  try {
    const { data } = await axios.get<WeatherData>(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
};

export const weatherUpdateWorker = new Worker(
  CONSTS.QUEUES.WEATHER_UPDATE,
  async (job: { data: { userId: string } }) => {
    const { userId } = job.data;

    // Fetch user profile to get location
    const profile = await Profile.findOne({ user: userId }).populate(
      "location"
    );

    if (!profile || !profile.location) {
      throw new Error("User profile or location not found");
    }

    const { coordinates, type } = profile.location;

    if (
      type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      throw new Error("Invalid location data");
    }

    const [lon, lat] = coordinates;

    // Fetch weather data for the next 24 hours
    const weatherData = await getWeather(lat, lon);

    // Check if weather conditions are dangerous
    const dangerousConditions = checkDangerousWeather(weatherData);

    // Only notify user if dangerous conditions are detected
    if (dangerousConditions.isDangerous) {
      await sendWeatherNotification(userId, dangerousConditions, weatherData);
    }

    return {
      userId,
      location: { lat, lon },
      isDangerous: dangerousConditions.isDangerous,
      severity: dangerousConditions.severity,
      reasons: dangerousConditions.reasons,
      timestamp: new Date().toISOString(),
    };
  },
  { connection: redis }
);
