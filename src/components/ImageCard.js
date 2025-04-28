import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ImageCard = ({ image, onPress }) => {
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(image)}>
      <Image
        source={{ uri: image.webformatURL }}
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {!loading && (
        <View style={styles.infoContainer}>
          <Text style={styles.user}>Photo by: {image.user}</Text>
          <View style={styles.tagsContainer}>
            {image.aiTags && image.aiTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  user: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#006064',
  },
});

export default ImageCard;