import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FIRESTORE_DB } from '../firebaseConfig'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore SDK

// Define the Service data type
type Service = {
  id: string;
  Creator: string;
  Price: number;
  ServiceName: string;
  updateTime: string; // Thời gian cập nhật
  editTime: string;   // Thời gian chỉnh sửa
};

const CustomerListService = ({ navigation }: any) => {
  const [services, setServices] = useState<Service[]>([]); // Services data
  const [filteredServices, setFilteredServices] = useState<Service[]>([]); // Filtered services for search
  const [loading, setLoading] = useState(true); // Data loading state
  const [searchText, setSearchText] = useState(''); // Search input state

  useEffect(() => {
    // Function to fetch data from Firestore
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Service'));
        const serviceList: Service[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data as Omit<Service, 'id'>,
            updateTime: data.updateTime ? data.updateTime.toDate().toISOString() : '', // Lấy thời gian cập nhật từ Firestore
            editTime: data.editTime ? data.editTime.toDate().toISOString() : '',     // Lấy thời gian chỉnh sửa từ Firestore
          };
        });
        setServices(serviceList);
        setFilteredServices(serviceList); // Initially, show all services
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service list:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to filter services based on search text
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filteredData = services.filter(service =>
        service.ServiceName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filteredData);
    } else {
      setFilteredServices(services);
    }
  };

  // Function to render each item in the service list
  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DetailScreen', { service: item })}
      activeOpacity={0.7}
    >
      <Text style={styles.itemName}>{item.ServiceName}</Text>
      <Text style={styles.itemPrice}>{item.Price} ₫</Text>
      {item.updateTime && (
        <Text style={styles.timeText}>Updated: {new Date(item.updateTime).toLocaleString()}</Text>
      )}
      {item.editTime && (
        <Text style={styles.timeText}>Edited: {new Date(item.editTime).toLocaleString()}</Text>
      )}
    </TouchableOpacity>
  );

  // Show loading indicator while data is loading
  if (loading) {
    return <ActivityIndicator size="large" color="#ADA2F2" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CUSTOMER</Text>
        <Text style={styles.logo}>HANABI SPA</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <Text style={styles.serviceListHeaderText}>Service List</Text>
        <FlatList
          data={filteredServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Text style={styles.navItem}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8', // Màu nền nhẹ
  },
  header: {
    backgroundColor: '#ADA2F2', // Màu nền header cập nhật
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
    color: '#E60026', // Màu đỏ tươi
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: '#F5F5F5', // Màu xám nhạt cho input
  },
  serviceListHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E60026', // Màu đỏ tươi cho tiêu đề danh sách dịch vụ
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Màu chữ đen cho tên dịch vụ
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666', // Màu chữ xám cho giá dịch vụ
  },
  timeText: {
    fontSize: 12,
    color: '#999', // Màu chữ xám nhạt cho thời gian
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ADA2F2', // Màu nền cho bottom navigation
  },
  navItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', // Màu chữ trắng cho item navigation
  },
});

export default CustomerListService;
