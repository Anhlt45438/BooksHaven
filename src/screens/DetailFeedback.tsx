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
    const { phan_hoi, id_feedback } = route.params;
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

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
    padding: 16,
    backgroundColor: '#fff',
  },
  messageContainer: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    right: 10,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
