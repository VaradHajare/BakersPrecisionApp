import { MEASUREMENT_STANDARDS } from '../constants/data';

export async function convert({ amount, ingredient, volumeUnit, countryStandard, dataset }) {
  if (!amount || isNaN(amount)) {
    return { resultText: 'Please enter a valid amount', grams: null };
  }

  const numericAmount = parseFloat(amount);
  const standard = MEASUREMENT_STANDARDS[countryStandard];
  if (!standard) {
    return { resultText: 'Invalid country standard', grams: null };
  }

  const ingredientKeyMap = {
    'Flour, all-purpose': 'flour',
    'Sugar, white, granulated': 'sugar',
    'Butter': 'butter',
    'Milk': 'milk',
    'Water': 'water',
    'Salt, table': 'salt',
  };
  const simpleIngredient = ingredientKeyMap[ingredient] || null;

  let grams;
  if (volumeUnit === 'pound') {
    grams = numericAmount * 453.592; // 1 lb = 453.592 g
  } else if (volumeUnit === 'kg') {
    grams = numericAmount * 1000; // 1 kg = 1000 g
  } else if (volumeUnit === 'ounce') {
    grams = numericAmount * 28.3495; // 1 oz = 28.3495 g
  } else if (simpleIngredient && standard.densities[simpleIngredient]) {
    // Use country-specific density from data.js for volume units
    const density = standard.densities[simpleIngredient];
    if (volumeUnit === 'cup') grams = numericAmount * density.cup;
    else if (volumeUnit === 'tablespoon') grams = numericAmount * density.tablespoon;
    else if (volumeUnit === 'teaspoon') grams = numericAmount * density.teaspoon;
    else {
      return { resultText: 'Invalid unit', grams: null };
    }
  } else {
    // Fallback to ingredients.json for volume units
    const usCupGrams = dataset[ingredient];
    if (!usCupGrams) {
      return { resultText: 'Ingredient not found in dataset', grams: null };
    }
    const usCupML = 236.59;
    const densityGperML = usCupGrams / usCupML;
    let sourceVolumeML;
    if (volumeUnit === 'cup') sourceVolumeML = numericAmount * standard.cup;
    else if (volumeUnit === 'tablespoon') sourceVolumeML = numericAmount * standard.tablespoon;
    else if (volumeUnit === 'teaspoon') sourceVolumeML = numericAmount * standard.teaspoon;
    else {
      return { resultText: 'Invalid unit', grams: null };
    }
    grams = sourceVolumeML * densityGperML;
  }

  grams = grams.toFixed(1);
  const unitLabel = volumeUnit === 'kg' ? 'kg' : volumeUnit;
  const resultText = `${numericAmount} ${unitLabel}${numericAmount > 1 && volumeUnit !== 'kg' ? 's' : ''} of ${ingredient} (${countryStandard}) = ${grams} grams`;
  return { resultText, grams };
}