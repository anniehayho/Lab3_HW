import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ onSearch, onFilterByAiTag }) => {
  const [query, setQuery] = useState('');
  const [aiFilter, setAiFilter] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleAiFilter = () => {
    onFilterByAiTag(aiFilter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search images..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
          <Icon name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by AI detected object..."
          value={aiFilter}
          onChangeText={setAiFilter}
          onSubmitEditing={handleAiFilter}
        />
        <TouchableOpacity onPress={handleAiFilter} style={styles.iconButton}>
          <Icon name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  iconButton: {
    padding: 8,
  },
});

export default SearchBar;