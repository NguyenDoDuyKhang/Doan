import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { FIRESTORE_DB } from '../firebaseConfig'; 
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Nhập Timestamp

type Service = {
  id: string;
  Creator: string;
  Price: number;
  ServiceName: string;
  updateTime?: Timestamp; // Thêm trường updateTime
};

const AdminListScreen = ({ navigation }: any) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [creator, setCreator] = useState('');
  const [price, setPrice] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null); // Trường để lưu ID của dịch vụ hiện tại đang được cập nhật

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Service'));
        const serviceList: Service[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Service, 'id'>,
          updateTime: doc.data().updateTime || Timestamp.now(), // Đảm bảo có giá trị mặc định
        }));
        setServices(serviceList);
      } catch (error) {
        console.error('Error fetching service list:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchServices); 

    fetchServices();

    return unsubscribe;
  }, [navigation]);

  const filteredServices = services.filter((service) =>
    service.ServiceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setCurrentServiceId(item.id);
        setCreator(item.Creator);
        setPrice(item.Price.toString());
        setServiceName(item.ServiceName);
        setModalVisible(true); // Mở modal để cập nhật
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.itemName}>{item.ServiceName}</Text>
      <Text style={styles.itemPrice}>{item.Price} ₫</Text>
      <Text style={styles.itemCreator}>{item.Creator}</Text>
      <Text style={styles.itemUpdateTime}>
        Cập nhật: {item.updateTime ? item.updateTime.toDate().toLocaleString() : 'Chưa có thông tin'}
      </Text>
    </TouchableOpacity>
  );

  const handleAddService = async () => {
    if (!creator || !price || !serviceName) {
      alert('Please fill in all the information');
      return;
    }

    const priceValue = parseInt(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Service price must be a positive number');
      return;
    }

    const newService = {
      Creator: creator,
      Price: priceValue,
      ServiceName: serviceName,
      updateTime: Timestamp.now(), // Thêm trường updateTime
    };

    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, 'Service'), newService);
      setServices(prevServices => [
        ...prevServices, 
        { ...newService, id: docRef.id }
      ]);
      resetForm();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async () => {
    if (!currentServiceId || !creator || !price || !serviceName) {
      alert('Please fill in all the information');
      return;
    }

    const priceValue = parseInt(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Service price must be a positive number');
      return;
    }

    const updatedService = {
      Creator: creator,
      Price: priceValue,
      ServiceName: serviceName,
      updateTime: Timestamp.now(), // Cập nhật thời gian
    };

    try {
      const serviceRef = doc(FIRESTORE_DB, 'Service', currentServiceId);
      await updateDoc(serviceRef, updatedService);
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === currentServiceId ? { ...service, ...updatedService } : service
        )
      );
      resetForm();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const resetForm = () => {
    setCreator('');
    setPrice('');
    setServiceName('');
    setCurrentServiceId(null);
    setModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ADA2F2" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ADMIN</Text>
        <Text style={styles.logo}>HANABI SPA</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.serviceListHeader}>
          <Text style={styles.serviceListHeaderText}>Danh sách dịch vụ</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => {
            resetForm(); // Reset form khi thêm dịch vụ mới
            setModalVisible(true);
          }}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>       
        <TouchableOpacity onPress={() => navigation.navigate('Customer')}>
          <Text style={styles.navItem}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Text style={styles.navItem}>Setting</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentServiceId ? 'Update Service' : 'Add New Service'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Creator's Name"
              value={creator}
              onChangeText={setCreator}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={serviceName}
              onChangeText={setServiceName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={currentServiceId ? handleUpdateService : handleAddService}>
              <Text style={styles.submitButtonText}>{currentServiceId ? 'Update Service' : 'Add Service'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={resetForm}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#ADA2F2', // Màu nền header
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
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#ADA2F2',
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
  itemCreator: {
    fontSize: 14,
    color: '#999999',
  },
  itemUpdateTime: {
    fontSize: 12,
    color: '#999999',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ADA2F2', // Màu nền bottom navigation
  },
  navItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#ADA2F2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default AdminListScreen;
