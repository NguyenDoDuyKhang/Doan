import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailScreen = ({ route }: any) => {
  const { service } = route.params; // Lấy thông tin dịch vụ từ params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.ServiceName}</Text>
      <Text style={styles.text}>Giá: {service.Price} ₫</Text>
      <Text style={styles.text}>Người tạo: {service.Creator}</Text>
      <Text style={styles.text}>Cập nhật lần cuối: {new Date(service.FinalUpdate.seconds * 1000).toLocaleString()}</Text>
      <Text style={styles.text}>Thời gian: {new Date(service.time.seconds * 1000).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default DetailScreen;
