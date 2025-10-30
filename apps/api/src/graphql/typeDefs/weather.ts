import gql from "graphql-tag";

export const weatherTypeDefs = gql`
  type CurrentWeather {
    temperature_2m: Float!
    wind_speed_10m: Float!
    relative_humidity_2m: Float!
    weather_code: Int!
  }

  type HourlyWeather {
    time: [String!]!
    temperature_2m: [Float!]!
    relative_humidity_2m: [Float!]!
    wind_speed_10m: [Float!]!
  }

  type DailyWeather {
    time: [String!]!
    temperature_2m_max: [Float!]!
    temperature_2m_min: [Float!]!
    precipitation_sum: [Float!]!
    weather_code: [Int!]!
  }

  type WeatherData {
    latitude: Float!
    longitude: Float!
    generationtime_ms: Float!
    utc_offset_seconds: Int!
    timezone: String!
    timezone_abbreviation: String!
    elevation: Float!
    current: CurrentWeather!
    hourly: HourlyWeather!
    daily: DailyWeather!
  }

  type Query {
    getWeather: WeatherData!
  }
`;
