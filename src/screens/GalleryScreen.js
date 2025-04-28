import React, { useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useImagePagination } from '../hooks/useImagePagination';
import ImageCard from '../components/ImageCard';
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/Ionicons';

const GalleryScreen = () => {
  const {
    images,
    loading,
    error,
    hasMore,
    refreshing,
    loadMore,
    refresh,
    search,
    filterByAiTag,
  } = useImagePagination();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onSearch={search} onFilterByAiTag={filterByAiTag} />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={handleImagePress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={refresh}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.largeImageURL }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>Photo by: {selectedImage.user}</Text>
                  
                  <Text style={styles.modalSubtitle}>Original Tags:</Text>
                  <Text style={styles.modalTags}>{selectedImage.tags}</Text>
                  
                  <Text style={styles.modalSubtitle}>AI Detected Objects:</Text>
                  <View style={styles.modalTagsContainer}>
                    {selectedImage.aiTags && selectedImage.aiTags.map((tag, index) => (
                      <View key={index} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    margin: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  modalImage: {
    flex: 2,
    width: '100%',
    height: undefined,
    marginBottom: 10,
  },
  modalInfo: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalTags: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalTag: {
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 3,
  },
  modalTagText: {
    fontSize: 14,
    color: '#006064',
  },
});

export default GalleryScreen;