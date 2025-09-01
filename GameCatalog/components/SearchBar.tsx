// components/SearchBar.tsx

import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface SearchBarProps {
  query: string;
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search games..."
        value={query}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    flex: 0.6,
    backgroundColor: '#3C3D37',
    color: 'white',
    fontSize: 18,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
});

export default SearchBar;
