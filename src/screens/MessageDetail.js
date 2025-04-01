import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {getAccessToken} from '../redux/storageHelper';

const MessageDetail = ({route, navigation}) => {
  const [messageText, setMessageText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [anh, setAnh] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1); // Trạng thái trang hiện tại
  const [loading, setLoading] = useState(false);
  const textInputRef = useRef(null);
  const flatListRef = useRef(null);
  const [isScrollManually, setIsScrollManually] = useState(false); // Để kiểm tra cuộn thủ công
  const user = useAppSelector(state => state.user.user);
  const {shop} = route.params;
  const {id_conversation} = route.params;

  const convertToBase64 = uri => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        fetch(uri)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = `data:image/jpeg;base64,${reader.result}`;
              resolve(base64Data);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } else {
        const RNFS = require('react-native-fs');
        RNFS.readFile(uri, 'base64')
          .then(base64Data => {
            resolve(`data:image/jpeg;base64,${base64Data}`);
          })
          .catch(reject);
      }
    });
  };

  // Chọn ảnh từ Camera
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
        Alert.alert('Camera error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert(
              'Error',
              'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.',
            );
          }
        }
      }
      closeLogoModal();
    });
  };
  // Chọn ảnh từ thư viện
  const openLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);

        Alert.alert('ImagePicker error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert(
              'Error',
              'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.',
            );
          }
        }
      }
      closeLogoModal();
    });
  };
  const fetchMessages = async () => {
    const accessToken = await getAccessToken();
    try {
      setLoading(true);
      const response = await fetch(
        `http://14.225.206.60:3000/api/conversations/${id_conversation}/messages?page=${page}&limit=15`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Lỗi khi tải tin nhắn');
      }

      const data = await response.json();
      const sortedMessages = data.data.sort((a, b) => {
        return new Date(a.ngay_tao).getTime() - new Date(b.ngay_tao).getTime();
      });

      // const sortedMessages = data.data;
      // Nếu đây là lần đầu tiên tải tin nhắn, đặt lại mảng tin nhắn
      if (page === 1) {
        setMessages(sortedMessages);
      } else {
        // Nếu đã tải trước đó, thêm tin nhắn mới vào
        setMessages(prevMessages => [...sortedMessages, ...prevMessages]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Hàm tải thêm tin nhắn
  const loadMoreMessages = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1); // Tăng số trang và tải thêm dữ liệu
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [page]);

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [user.accessToken]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const onScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentSizeHeight = event.nativeEvent.contentSize.height;
    const layoutMeasurementHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentOffsetY + layoutMeasurementHeight >= contentSizeHeight - 10) {
      setIsScrollManually(true); // Khi người dùng cuộn đến gần cuối
    } else {
      setIsScrollManually(false); // Khi người dùng cuộn lên
    }
  };

  // Khi mở view attach: ẩn bàn phím và hiển thị view attach
  const attachFile = () => {
    Keyboard.dismiss();
    setShowAttach(true);
  };

  // Khi đóng view attach: ẩn view attach và mở lại bàn phím sau 100ms
  const closeAttach = () => {
    setShowAttach(false);
    setTimeout(() => {
      textInputRef.current && textInputRef.current.focus();
    }, 100);
  };

  const openEmojiPicker = () => {
    console.log('Open emoji picker');
  };

  const openMenu = () => {
    console.log('Open menu');
  };

  const sendMessage = async () => {
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
        const result = await response.json();
        console.log('Tin nhắn đã gửi thành công:', result);
        setMessageText('');
        setAnh(null);
      } else {
        const errorData = await response.json();
        console.log(errorData);
        Alert.alert('Lỗi: ', `${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kết nối đến server!');
      console.log('Error:', error);
    }
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

      {/* Danh sách tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item._id}
        onEndReached={loadMoreMessages} // Gọi loadMoreMessages khi người dùng kéo xuống cuối danh sách
        onEndReachedThreshold={0.5} // Kích hoạt khi người dùng kéo xuống gần cuối
        onScroll={onScroll}
        // ListFooterComponent={
        //   isScrollManually && loading ? <Text>Đang tải...</Text> : null
        // }
        renderItem={({item, index}) => {
          let containerStyle = {};
          if (item.id_user_gui == user._id) {
            containerStyle = styles.userMessage;
          } else if (item.type != user._id) {
            containerStyle = styles.shopMessage;
          } else {
            containerStyle = styles.systemMessage;
          }
          // Kiểm tra nếu đây là tin nhắn cuối cùng
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
                      hour12: false, // Để giờ theo dạng 24h
                    })}
                  </Text>

                  {/* Hiển thị "Đã xem" chỉ nếu đó là tin nhắn cuối cùng */}
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

      {/* Nếu có media được chọn, hiển thị preview */}
      {anh && (
        <View style={styles.mediaPreview}>
          <Image
            source={
              anh && (anh.startsWith('http') || anh.startsWith('data:image/'))
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

      {/* Thanh nhập tin nhắn */}
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
          onChangeText={setMessageText}
          value={messageText}
          onFocus={() => {
            if (showAttach) {
              setShowAttach(false);
            }
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

      {/* View đính kèm */}
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
          {/* Bạn có thể bổ sung thêm các lựa chọn khác */}
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
  /* Header */
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
  shopStatus: {
    fontSize: 14,
    color: '#888',
  },
  headerMenu: {
    padding: 5,
  },
  /* Danh sách tin nhắn */
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
  systemMessageBox: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 10,
  },
  systemText: {
    fontSize: 13,
    color: '#856404',
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
  /* Thanh nhập tin nhắn */
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
  /* Preview media */
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
  /* Khu vực hiển thị view đính kèm */
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
});
