import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { FIRESTORE_DB } from '../firebaseConfig'; // Cấu hình Firebase
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore SDK

// Định nghĩa kiểu dữ liệu Service
type Service = {
  id: string;
  Creator: string;
  FinalUpdate: string;
  Price: number;
  ServiceName: string;
  time: string;
};

const CustomerListScreen = ({ navigation }: any) => {
  const [services, setServices] = useState<Service[]>([]); // Dữ liệu dịch vụ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    // Hàm lấy dữ liệu từ Firestore
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Service')); // Thay 'Service' bằng tên collection trong Firestore
        const serviceList: Service[] = querySnapshot.docs.map(doc => ({
          id: doc.id, // ID tài liệu
          ...doc.data() as Omit<Service, 'id'>, // Lấy dữ liệu của dịch vụ từ Firestore
        }));
        setServices(serviceList); // Cập nhật state với dữ liệu dịch vụ
        setLoading(false); // Tắt trạng thái loading sau khi tải dữ liệu
      } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error);
        setLoading(false); // Tắt loading nếu có lỗi
      }
    };

    fetchServices(); // Gọi hàm khi component render
  }, []);

  // Hàm render mỗi item trong danh sách dịch vụ
  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DetailScreen', { service: item })} // Chuyển hướng đến trang chi tiết
      activeOpacity={0.7} // Thêm hiệu ứng chuyển động khi nhấn
    >
      <Text style={styles.itemName}>{item.ServiceName}</Text>
      <Text style={styles.itemPrice}>{item.Price} ₫</Text>
    </TouchableOpacity>
  );

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CUSTOMER</Text>
        <Text style={styles.logo}>KAMI SPA</Text>
        
      </View>
      <View style={styles.content}>
        <View style={styles.serviceListHeader}>
          <Text style={styles.serviceListHeaderText}>Danh sách dịch vụ</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <View style={{ height: 10 }} />
        </View>
        <FlatList
          data={services} // Dữ liệu dịch vụ
          renderItem={renderItem} // Hàm render cho mỗi item
          keyExtractor={(item) => item.id} // Sử dụng ID làm khóa duy nhất
        />
      </View>
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>
        <Text style={styles.navItem}>Transaction</Text>
        <Text style={styles.navItem}>Customer</Text>
        <Text style={styles.navItem}>Setting</Text>
      </View>
    </View>
  );
};

// Định nghĩa kiểu dáng giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Thêm màu nền cho container
  },
  header: {
    backgroundColor: '#F8C0C8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E60026',
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF', // Thêm màu nền cho content
  },
  serviceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  serviceListHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#E60026',
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8C0C8',
  },
  navItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomerListScreen;