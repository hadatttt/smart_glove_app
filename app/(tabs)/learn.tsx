import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { signGestures } from '@/mocks/gestures';
import { GestureCard } from '@/components/GestureCard';
import { GestureDetailModal } from '@/components/GestureDetailModal';
import { SignGesture } from '@/types';

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGesture, setSelectedGesture] = useState<SignGesture | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  const filteredGestures = signGestures.filter(gesture => {
    const matchesSearch = 
      gesture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gesture.letter.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = 
      !filterDifficulty || gesture.difficulty === filterDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });
  
  const handleGesturePress = (gesture: SignGesture) => {
    setSelectedGesture(gesture);
  };
  
  const handleCloseModal = () => {
    setSelectedGesture(null);
  };
  
  const handleFilterPress = (difficulty: string | null) => {
    setFilterDifficulty(difficulty === filterDifficulty ? null : difficulty);
  };
  
  const renderFilterButton = (label: string, value: string | null) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterDifficulty === value && styles.filterButtonActive,
      ]}
      onPress={() => handleFilterPress(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterDifficulty === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.light.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search signs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={Colors.light.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', null)}
        {renderFilterButton('Easy', 'easy')}
        {renderFilterButton('Medium', 'medium')}
        {renderFilterButton('Hard', 'hard')}
      </View>
      
      <FlatList
        data={filteredGestures}
        renderItem={({ item }) => (
          <GestureCard
            gesture={item}
            onPress={handleGesturePress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No signs found. Try a different search term.
            </Text>
          </View>
        }
      />
      
      <Modal
        visible={!!selectedGesture}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        {selectedGesture && (
          <GestureDetailModal
            gesture={selectedGesture}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.light.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.light.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  filterButtonTextActive: {
    color: Colors.light.white,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
});