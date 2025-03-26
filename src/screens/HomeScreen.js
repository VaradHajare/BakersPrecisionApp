import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header';
import Converter from '../components/Converter';
import styles from '../styles/styles';
import { convert } from '../utils/conversions';
import { fetchSubstitutionAndNutrition } from '../utils/api';
import { GEMINI_API_KEY } from '../constants/data';

export default function HomeScreen({ navigation, route }) {
  const { dataset } = route.params || {};
  const [result, setResult] = useState(null);
  const [substitution, setSubstitution] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [cache, setCache] = useState({});

  React.useEffect(() => {
    console.log('Dataset in HomeScreen:', dataset);
  }, [dataset]);

  const handleConvert = async (inputData) => {
    const { amount, ingredient, volumeUnit, countryStandard } = inputData;
    console.log('Handling convert with:', { amount, ingredient, volumeUnit, countryStandard });

    const { resultText, grams } = await convert({
      amount: parseFloat(amount),
      ingredient,
      volumeUnit,
      countryStandard,
      dataset,
    });
    setResult(resultText);

    if (grams) {
      console.log('Grams calculated:', grams);
      const cacheKey = `${ingredient}-${grams}-${volumeUnit}-${countryStandard}`;
      if (cache[cacheKey]) {
        console.log('Cache hit for:', cacheKey);
        setSubstitution(cache[cacheKey].substitution);
        setNutrition(cache[cacheKey].nutrition);
      } else {
        console.log('Fetching substitution and nutrition for:', ingredient);
        await fetchSubstitutionAndNutrition(
          ingredient,
          grams,
          dataset,
          GEMINI_API_KEY,
          (sub) => {
            // Ensure sub is a string
            const safeSub = typeof sub === 'string' ? sub : String(sub);
            setSubstitution(safeSub);
            setCache((prev) => ({
              ...prev,
              [cacheKey]: { ...prev[cacheKey], substitution: safeSub },
            }));
          },
          (nut) => {
            // Ensure nut is a string
            const safeNut = typeof nut === 'string' ? nut : String(nut);
            setNutrition(safeNut);
            setCache((prev) => ({
              ...prev,
              [cacheKey]: { ...prev[cacheKey], nutrition: safeNut },
            }));
          }
        );
      }
    } else {
      console.log('No grams calculated, skipping fetch.');
    }
  };

  return (
    <View style={[styles.scrollContainer, { paddingVertical: 10 }]}>
      <Header />
      <Converter dataset={dataset} onConvert={handleConvert} />
      {result && (
        <View style={[styles.outputContainer, { marginTop: 0 }]}>
          <Text style={styles.result}>{result}</Text>
          {substitution && <Text style={styles.result}>{substitution}</Text>}
          {nutrition && <Text style={styles.result}>{nutrition}</Text>}
        </View>
      )}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { geminiKey: GEMINI_API_KEY })}
      >
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}