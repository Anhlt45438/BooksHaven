import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';



const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};



const App = ({route}) => {
    const navigation = useNavigation()
    const { phan_hoi, id_feedback , trang_thai } = route.params;
     const user = useAppSelector(state => state.user.user) || {
            _id: '',
            username: 'Người dùng',
            avatar: null,
            accessToken: '',
        };
        const [modalVisible, setModalVisible] = useState(false);
        const [inputText, setInputText] = useState('');

        const repfeedback = async (feedbackId)=>{
          const accessToken = await getAccessToken();
          if (!accessToken) {
            console.error("Không có accessToken");
            return;
          }
          try {
          const response= await fetch(`http://14.225.206.60:3000/api/feedbacks/${feedbackId}/reply`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken.trim()}`
            },
            body: JSON.stringify({
              content: inputText,
            })
          })
          
                const result = await response.json();
            console.log(feedbackId);
            
                if (response.ok) {
                  Alert.alert("Thành công", `Gửi feedback thành công`);
                  navigation.goBack()
                  setInputText('')
                 
                } else {
                  Alert.alert("Lỗi", result.message || "Có lỗi xảy ra khi gửi feedback");
                }
                 } catch (error) {
                      console.error("Error sending feedback:", error);
                      console.log("Error sending feedback:", error);
                      
                      Alert.alert("Lỗi", "Không thể gửi feedback, vui lòng thử lại sau.");
                    }
        }

        const handleOk = (id) => {
          // Xử lý dữ liệu từ inputText tại đây
          console.log('Nội dung nhập:', inputText);
          console.log("id",id);
          
          repfeedback(id)
          setModalVisible(false);
          setInputText('');
        };
      
        const handleCancel = () => {
          setModalVisible(false);
          setInputText('');
        };
  return (
    <View style={styles.container}>
        <View style={styles.header}>
                              <View style={styles.headerContent}>
                                  <TouchableOpacity onPress={() => navigation.goBack()}>
                                      <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                                  </TouchableOpacity>
                                  <Text style={styles.title}>Phản hồi từ chúng tôi</Text>
                              </View>
                          </View>
     
          <FlatList
          data={phan_hoi}
          keyExtractor={(item) => item.id_message}
          renderItem={({ item }) => {
            if (item.is_admin === true) {
              return (
                <View style={styles.messageContainer}>
                  <Text>Kính gửi: {user.username}</Text>
                  <Text style={styles.content}>{item.content}</Text>
                  <Text style={styles.meta}>From: Book Haven</Text>
                  <Text style={styles.meta}>Time: {formatDate(item.created_at)}</Text>
                </View>
              );
            } else {
              return (
                <View style={styles.messageContainer}>
                  <Text style={styles.meta}>To: Book Haven</Text>
                  <Text style={styles.content}>{item.content}</Text>
                  <Text style={styles.meta}>From: {user.username}</Text>
                  <Text style={styles.meta}>Time: {formatDate(item.created_at)}</Text>
                </View>
              );
            }
          }}
        />
       
      <View style={styles.container}>
      {/* Nút nổi */}
      {trang_thai !== "da_giai_quyet" && (
  <TouchableOpacity
    style={styles.fab}
    onPress={() => setModalVisible(true)}
  >
    <Text style={styles.fabIcon}>+</Text>
  </TouchableOpacity>
)}


      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập phản hồi của bạn</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập nội dung..."
              value={inputText}
              onChangeText={setInputText}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={()=>handleOk(id_feedback)}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconn: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
    color: '#333',
  },
  messageContainer: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d6efd',
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    minHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#0d6efd',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
