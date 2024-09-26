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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    color: '#F08080',
    marginBottom: 50,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  loginButton: {
    backgroundColor: '#F08080',
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
});

export default LoginScreen;