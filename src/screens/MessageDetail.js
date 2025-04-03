import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useAppSelector} from '../redux/hooks';
import {getAccessToken} from '../redux/storageHelper';
import RNFS from 'react-native-fs';
import {io} from 'socket.io-client';

const MessageDetail = ({route, navigation}) => {
  const [messageText, setMessageText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [anh, setAnh] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isScrollManually, setIsScrollManually] = useState(false);
  const textInputRef = useRef(null);
  const flatListRef = useRef(null);
  const typingTimeout = useRef(null);
  const user = useAppSelector(state => state.user.user);
  const {shop, id_conversation} = route.params;
  const [typingUser, setTypingUser] = useState(true);

  // Sử dụng useRef để lưu socket
  const socketRef = useRef();

  const convertToBase64 = useCallback(uri => {
    return new Promise((resolve, reject) => {
      const fetchImage = async () => {
        try {
          if (Platform.OS === 'ios') {
            const res = await fetch(uri);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve(`data:image/jpeg;base64,${reader.result}`);
            reader.readAsDataURL(blob);
          } else {
            const base64Data = await RNFS.readFile(uri, 'base64');
            resolve(`data:image/jpeg;base64,${base64Data}`);
          }
        } catch (error) {
          reject(error);
        }
      };
      fetchImage();
    });
  }, []);

  const openCamera = useCallback(() => {
    const options = {mediaType: 'photo', quality: 1};
    launchCamera(options, async response => {
      if (response.didCancel || response.errorCode) {
        console.log(response.errorMessage || 'User cancelled camera');
      } else {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64:', error);
            Alert.alert(
              'Error',
              'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.',
            );
          }
        }
      }
      closeAttach();
    });
  }, [convertToBase64]);

  const openLibrary = useCallback(() => {
    const options = {mediaType: 'photo', quality: 1};
    launchImageLibrary(options, async response => {
      if (response.didCancel || response.errorCode) {
        console.log(response.errorMessage || 'User cancelled image picker');
      } else {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64:', error);
            Alert.alert(
              'Error',
              'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.',
            );
          }
        }
      }
      closeAttach();
    });
  }, [convertToBase64]);

  const attachFile = useCallback(() => {
    Keyboard.dismiss();
    setShowAttach(true);
  }, []);

  const openMenu = useCallback(() => {
    console.log('Open menu');
  }, []);

  const openEmojiPicker = useCallback(() => {
    console.log('Open emoji picker');
  }, []);

  const closeAttach = useCallback(() => {
    setShowAttach(false);
    setTimeout(() => textInputRef.current && textInputRef.current.focus(), 100);
  }, []);

  // Khởi tạo kết nối Socket khi component mount
  useEffect(() => {
    socketRef.current = io('http://14.225.206.60:3000');

    // Khi kết nối mở, tham gia hội thoại
    socketRef.current.on('connect', () => {
      console.log('Kết nối Socket đã mở.');
      socketRef.current.emit('join_conversation', id_conversation);
    });

    // Lắng nghe sự kiện tin nhắn mới
    socketRef.current.on('new_message', messages => {
      setMessages(prevMessages => [...prevMessages, messages.message]);
      fetchMessages();
    });

    socketRef.current.on('typing_status', data => {
      console.log('dang nhap......');

      if (data.is_typing && data.user_id !== user._id) {
        setTypingUser(false);
      } else {
        setTypingUser(true);
      }
    });

    // Lắng nghe sự kiện cập nhật hội thoại
    socketRef.current.on('conversation_updated', conversationData => {
      console.log('Conversation updated:', conversationData);
      setMessages(prevMessages => [
        ...prevMessages,
        ...conversationData.updatedMessages,
      ]);
    });

    // Clean up: Rời hội thoại và đóng kết nối khi component unmount
    return () => {
      socketRef.current.emit('leave_conversation', id_conversation);
      socketRef.current.disconnect();
      console.log('Kết nối Socket đã đóng');
    };
  }, [id_conversation]);

  const fetchMessages = useCallback(async () => {
    const accessToken = await getAccessToken();
    try {
      setLoading(true);
      const response = await fetch(
        `http://14.225.206.60:3000/api/conversations/${id_conversation}/messages?page=${page}&limit=12`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) throw new Error('Lỗi khi tải tin nhắn');
      const data = await response.json();
      const sortedMessages = data.data.sort(
        (a, b) => new Date(a.ngay_tao) - new Date(b.ngay_tao),
      );
      setMessages(prevMessages =>
        page === 1 ? sortedMessages : [...sortedMessages, ...prevMessages],
      );
    } catch (err) {
      console.log(err.message);
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, id_conversation]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Hàm gửi tin nhắn
  const sendMessage = useCallback(async () => {
    const newMess = {
      id_hoi_thoai: id_conversation,
      noi_dung: messageText,
      duong_dan_file: anh,
    };
    const accessToken = await getAccessToken();

    try {
      const response = await fetch(
        'http://14.225.206.60:3000/api/conversations/messages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newMess),
        },
      );
      if (response.ok) {
        socketRef.current.emit('send_message', newMess);
        setMessageText('');
        setAnh(null);
        flatListRef.current.scrollToEnd({animated: true});
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi: ', `${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kết nối đến server!');
      console.log('Error:', error);
    }
  }, [messageText, anh, id_conversation]);

  const loadMoreMessages = useCallback(() => {
    if (!loading && !isScrollManually) {
      setPage(prevPage => prevPage + 1); // Tăng số trang và tải thêm dữ liệu
      console.log('Tải thêm tin nhắn, trang:', page);
    }
  }, [loading, isScrollManually, page]);

  // Cuộn FlatList đến cuối tin nhắn
  // const scrollLastMessage = () => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToEnd({animated: true});
  //   }
  // };
  // scrollLastMessage();

  const onScroll = useCallback(
    event => {
      const {contentOffset} = event.nativeEvent;
      if (contentOffset.y <= 0 && !loading && !isScrollManually) {
        setIsScrollManually(true);
        loadMoreMessages();
        console.log('Đang cuộn lên đầu danh sách');
      } else {
        setIsScrollManually(false);
      }
    },
    [isScrollManually, loading],
  );

  const handleTyping = () => {
    if (!id_conversation) return;

    clearTimeout(typingTimeout.current);
    socketRef.current.emit('typing', {
      conversation_id: id_conversation,
      user_id: user._id,
      is_typing: true,
    });

    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit('typing', {
        conversation_id: id_conversation,
        user_id: user._id,
        is_typing: false,
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerMenu}>
          <Image
            source={require('../assets/icons/Vector.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Image
            source={
              shop.anh_shop &&
              (shop.anh_shop.startsWith('http') ||
                shop.anh_shop.startsWith('data:image/'))
                ? {uri: shop.anh_shop}
                : require('../assets/image/avatar.png')
            }
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.shopName}>{shop.ten_shop}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openMenu} style={styles.headerMenu}>
          <Image source={require('../assets/icons/3dots.png')} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item._id.toString()}
        onScroll={onScroll}
        renderItem={({item, index}) => {
          let containerStyle = {};
          if (item.id_user_gui === user._id) {
            containerStyle = styles.userMessage;
          } else if (item.type !== user._id) {
            containerStyle = styles.shopMessage;
          } else {
            containerStyle = styles.systemMessage;
          }
          const isLastMessage = index === messages.length - 1;
          return (
            <View style={[styles.messageContainer, containerStyle]}>
              <View style={styles.bubble}>
                {item.noi_dung && (
                  <Text style={styles.message}>{item.noi_dung}</Text>
                )}
                {item.duong_dan_file &&
                  (item.duong_dan_file.startsWith('http') ||
                    item.duong_dan_file.startsWith('data:image/')) && (
                    <Image
                      source={{uri: item.duong_dan_file}}
                      style={styles.previewImage}
                    />
                  )}
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.time}>
                    {new Date(item.ngay_tao).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </Text>
                  {isLastMessage &&
                    item.id_user_gui === user._id &&
                    item.da_doc === true && (
                      <Text style={{color: 'gray', fontSize: 10, margin: 7}}>
                        Đã xem
                      </Text>
                    )}
                </View>
              </View>
            </View>
          );
        }}
      />
      {/* Hiển thị "Typing..." khi có người nhập */}
      {!typingUser && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>đang nhập...</Text>
        </View>
      )}

      {anh && (
        <View style={styles.mediaPreview}>
          <Image
            source={
              anh && (anh.startsWith('http') || anh.startsWith('data:image/'))
                ? {uri: anh}
                : null
            }
            style={styles.previewImage}
          />
          <TouchableOpacity
            onPress={() => setAnh(null)}
            style={styles.removeMediaButton}>
            <Text style={styles.removeMediaText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputBar}>
        {showAttach === false ? (
          <TouchableOpacity onPress={attachFile}>
            <Image
              source={require('../assets/icons/add.png')}
              style={styles.iconButton}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={closeAttach}>
            <Image
              source={require('../assets/icons/x.png')}
              style={styles.iconButton}
            />
          </TouchableOpacity>
        )}

        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Gửi tin nhắn ..."
          placeholderTextColor="#888"
          onChangeText={text => {
            setMessageText(text);
            handleTyping();
          }}
          value={messageText}
          onFocus={() => {
            if (showAttach) setShowAttach(false);
          }}
        />

        <TouchableOpacity onPress={openEmojiPicker}>
          <Image
            source={require('../assets/icons/Smile.png')}
            style={styles.iconButton}
          />
        </TouchableOpacity>

        {(messageText.length > 0 || anh) && (
          <TouchableOpacity onPress={sendMessage}>
            <Image
              source={require('../assets/icons/Send.png')}
              style={styles.iconButton}
            />
          </TouchableOpacity>
        )}
      </View>

      {showAttach && (
        <View style={styles.attach}>
          <TouchableOpacity style={styles.attachButton} onPress={openLibrary}>
            <View style={styles.attachItem}>
              <Image source={require('../assets/icons/img.png')} />
            </View>
            <Text style={styles.attachText}>Thư viện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachButton} onPress={openCamera}>
            <View style={styles.attachItem}>
              <Image source={require('../assets/icons/camera.png')} />
            </View>
            <Text style={styles.attachText}>Máy ảnh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessageDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFF1',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '35%',
    width: 200,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerMenu: {
    padding: 5,
  },
  messageContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    backgroundColor: '#d1f7d1',
  },
  shopMessage: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  iconButton: {
    tintColor: '#5900FF',
    width: 30,
    height: 30,
    margin: 5,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginHorizontal: 5,
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeMediaButton: {
    marginLeft: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 5,
  },
  removeMediaText: {
    color: 'red',
    fontWeight: 'bold',
  },
  attach: {
    height: 300,
    backgroundColor: '#F1EFF1',
    flexDirection: 'row',
    padding: 20,
  },
  attachButton: {
    margin: 10,
    alignItems: 'center',
  },
  attachItem: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  attachText: {
    fontWeight: '600',
    color: 'gray',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
  },

  typingContainer: {
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  typingText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
