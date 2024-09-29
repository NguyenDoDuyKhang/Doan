import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FIRESTORE_DB } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone === '' || password === '') {
      setErrorMessage('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const q = query(
        collection(FIRESTORE_DB, 'Login'),
        where('phone', '==', phone)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.password === password) {
            // Kiểm tra role
            if (userData.role === true) {
              // Admin
              navigation.replace('AdminListService');
            } else {
              // Customer
              navigation.replace('CustomerListService');
            }
          } else {
            setErrorMessage('Mật khẩu không chính xác');
          }
        });
      } else {
        setErrorMessage('Số điện thoại không tồn tại');
      }
    } catch (error: any) {
      setErrorMessage('Lỗi khi đăng nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          onChangeText={setPhone}
          value={phone}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      </View>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin} 
        disabled={loading}
      >
        <Text style={styles.loginText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Nút để chuyển hướng đến trang đăng ký */}
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Đăng ký tài khoản mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1FF', // Màu nền sáng hơn để làm nổi bật màu chính
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    color: '#ADA2F2', // Màu lupine cho tiêu đề
    marginBottom: 50,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFA2D6', // Màu tím nhạt cho viền input
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  loginButton: {
    backgroundColor: '#ADA2F2', // Màu chính cho nút đăng nhập
    padding: 15,
    borderRadius: 5,
    width: '80%',
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#ADA2F2', // Màu chính cho chữ đăng ký
    fontSize: 16,
  },
});

export default LoginScreen;
