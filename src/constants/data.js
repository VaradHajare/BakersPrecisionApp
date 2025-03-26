// src/constants/data.js
export const MEASUREMENT_STANDARDS = {
    US: {
      teaspoon: 4.93,
      tablespoon: 14.79,
      cup: 236.59,
      densities: {
        flour: { cup: 120, tablespoon: 8, teaspoon: 2.5 },
        sugar: { cup: 200, tablespoon: 12.5, teaspoon: 4 },
        butter: { cup: 225, tablespoon: 14, teaspoon: 4.7 },
        milk: { cup: 240, tablespoon: 15, teaspoon: 5 },
        water: { cup: 240, tablespoon: 15, teaspoon: 5 },
        salt: { cup: 275, tablespoon: 17, teaspoon: 5.7 },
      },
    },
    UK: {
      teaspoon: 5.92,
      tablespoon: 17.76,
      cup: 284.13,
      densities: {
        flour: { cup: 144, tablespoon: 9.6, teaspoon: 3 },
        sugar: { cup: 240, tablespoon: 15, teaspoon: 5 },
        butter: { cup: 270, tablespoon: 16.8, teaspoon: 5.6 },
        milk: { cup: 288, tablespoon: 18, teaspoon: 6 },
        water: { cup: 288, tablespoon: 18, teaspoon: 6 },
        salt: { cup: 330, tablespoon: 20.4, teaspoon: 6.8 },
      },
    },
    Australia: {
      teaspoon: 5,
      tablespoon: 20,
      cup: 250,
      densities: {
        flour: { cup: 127, tablespoon: 10.2, teaspoon: 2.5 },
        sugar: { cup: 211, tablespoon: 16.8, teaspoon: 4.2 },
        butter: { cup: 238, tablespoon: 19, teaspoon: 4.8 },
        milk: { cup: 254, tablespoon: 20.3, teaspoon: 5.1 },
        water: { cup: 254, tablespoon: 20.3, teaspoon: 5.1 },
        salt: { cup: 290, tablespoon: 23.2, teaspoon: 5.8 },
      },
    },
    Metric: {
      teaspoon: 5,
      tablespoon: 15,
      cup: 250,
      densities: {
        flour: { cup: 127, tablespoon: 7.6, teaspoon: 2.5 },
        sugar: { cup: 211, tablespoon: 12.7, teaspoon: 4.2 },
        butter: { cup: 238, tablespoon: 14.3, teaspoon: 4.8 },
        milk: { cup: 254, tablespoon: 15.2, teaspoon: 5.1 },
        water: { cup: 254, tablespoon: 15.2, teaspoon: 5.1 },
        salt: { cup: 290, tablespoon: 17.4, teaspoon: 5.8 },
      },
    },
  };
  
  export const SPOONACULAR_API_KEY = '90bab5a0e1d14338871244039b3ac998';
  export const GEMINI_API_KEY = 'AIzaSyCobW0aUWzTnhSjQ8qH13TqtDbGMqh_DhI';