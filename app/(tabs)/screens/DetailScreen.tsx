import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DetailScreen = ({ route }: any) => {
  const { service } = route.params; // Get service information from params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{service.ServiceName}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Giá: <Text style={styles.price}>{service.Price} ₫</Text></Text>
        <Text style={styles.text}>Người tạo: <Text style={styles.creator}>{service.Creator}</Text></Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F4F8', // Màu nền nhẹ hơn cho tổng thể
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E60026', // Màu cho tiêu đề
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#F9AAF9', // Màu nền trắng cho thông tin
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Để tạo bóng cho Android
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333333', // Màu chữ đen cho thông tin
  },
  price: {
    fontWeight: 'bold',
    color: '#F08080', // Màu cho giá
  },
  creator: {
    fontStyle: 'italic',
    color: '#666666', // Màu cho người tạo
  },
});

export default DetailScreen;
