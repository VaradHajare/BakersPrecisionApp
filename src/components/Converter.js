import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MEASUREMENT_STANDARDS } from '../constants/data';
import styles from '../styles/styles';

export default function Converter({ dataset, onConvert }) {
  const [ingredient, setIngredient] = useState('Flour, all-purpose');
  const [searchText, setSearchText] = useState('');
  const [amount, setAmount] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('cup');
  const [countryStandard, setCountryStandard] = useState('US');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const ingredients = Object.keys(dataset);

  const filteredIngredients = searchText.trim()
    ? ingredients.filter((ing) => ing.toLowerCase().includes(searchText.toLowerCase()))
    : ingredients;

  const handleIngredientSelect = (selectedIngredient) => {
    setIngredient(selectedIngredient);
    setSearchText(selectedIngredient);
    setIsDropdownVisible(false);
  };

  const handleSubmit = () => {
    if (!amount.trim()) return;
    onConvert({ amount, ingredient, volumeUnit, countryStandard });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Select Measurement Standard</Text>
      <View style={styles.pickerContainer}>
        <Picker
          key="countryPicker"
          selectedValue={countryStandard}
          onValueChange={setCountryStandard}
          style={styles.picker}
        >
          <Picker.Item label="US" value="US" />
          <Picker.Item label="UK" value="UK" />
          <Picker.Item label="Australia" value="Australia" />
          <Picker.Item label="Metric" value="Metric" />
        </Picker>
      </View>

      <Text style={styles.label}>Select Ingredient</Text>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setIsDropdownVisible(true);
        }}
        placeholder="Search or scroll to select..."
        placeholderTextColor="#999"
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
      />
      {isDropdownVisible && (
        <FlatList
          data={filteredIngredients}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleIngredientSelect(item)}
            >
              <Text style={styles.dropdownText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          style={styles.dropdownList}
          nestedScrollEnabled={true}
          ListEmptyComponent={<Text style={styles.dropdownText}>No matches found</Text>}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Move input up by reducing marginTop from 15 to 5 */}
      <Text style={[styles.label, { marginTop: 15 }]}>Enter Amount ({volumeUnit}s)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder={`e.g., 2.5 ${volumeUnit}s`}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Select Unit</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={volumeUnit}
          onValueChange={setVolumeUnit}
          style={styles.picker}
        >
          <Picker.Item label="Cup" value="cup" />
          <Picker.Item label="Tablespoon" value="tablespoon" />
          <Picker.Item label="Teaspoon" value="teaspoon" />
          <Picker.Item label="Pound" value="pound" />
          <Picker.Item label="Kilogram" value="kg" />
          <Picker.Item label="Ounce" value="ounce" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Convert to Grams</Text>
      </TouchableOpacity>
    </View>
  );
}