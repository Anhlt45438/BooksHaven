import React, {useState, useRef} from 'react';
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

const initialMessages = [
  {
    id: '1',
    type: 'system',
    content:
      'LƯU Ý: Shopee KHÔNG cho phép hành vi: Đặt cọc/Chuyển khoản riêng...',
    time: '08 thg 1',
  },
  {
    id: '2',
    type: 'user',
    content: 'Shop ơi e 60kg 1m67 thì mặc size nào ạ',
    time: '11:23',
  },
  {
    id: '3',
    type: 'shop',
    content: 'Với form của Ruych, cậu mang size L - Cậu sẽ thoải mái nhé cậu!',
    time: '15:37',
  },
  {
    id: '4',
    type: 'user',
    content: 'Ùa em vừa hỏi bên ins báo size m mà shop',
    time: '15:38',
  },
  {
    id: '5',
    type: 'shop',
    content: 'Dạ M ạ',
    time: '19:20',
  },
];

const MessageDetail = ({route, navigation}) => {
  const [messageText, setMessageText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const textInputRef = useRef(null);
  const {shopName} = route.params;

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

  // Hàm mở camera cho phép cả ảnh và video
  const openCamera = () => {
    const options = {
      mediaType: 'mixed',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        console.log('Media from camera: ', media);
        setSelectedMedia(media);
        closeAttach();
      }
    });
  };

  // Hàm mở thư viện cho phép chọn cả ảnh và video
  const openLibrary = () => {
    const options = {
      mediaType: 'mixed',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        console.log('Media from library: ', media);
        setSelectedMedia(media);
        closeAttach();
      }
    });
  };

  // Hàm gửi tin nhắn, cho phép gửi văn bản và/hoặc media
  const sendMessage = () => {
    if (messageText.trim() === '' && !selectedMedia) {
      console.log('Không có nội dung để gửi');
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (messageText.trim() !== '') {
      newMessage.content = messageText;
    }

    if (selectedMedia) {
      newMessage.media = selectedMedia;
      newMessage.mediaType = selectedMedia.type;
    }

    console.log('Send message:', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setSelectedMedia(null);
  };

  // Dữ liệu header
  const shopAvatar = require('../assets/images/image3.png');
  const shopStatus = 'Online 9 phút trước';

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Image source={shopAvatar} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={styles.shopStatus}>{shopStatus}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openMenu} style={styles.headerMenu}>
          <Image source={require('../assets/icons/3dots.png')} />
        </TouchableOpacity>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          let containerStyle = {};
          if (item.type === 'user') {
            containerStyle = styles.userMessage;
          } else if (item.type === 'shop') {
            containerStyle = styles.shopMessage;
          } else {
            containerStyle = styles.systemMessage;
          }

          if (item.type === 'system') {
            return (
              <View style={[styles.messageContainer, containerStyle]}>
                <View style={styles.systemMessageBox}>
                  <Text style={styles.systemText}>{item.content}</Text>
                </View>
              </View>
            );
          }

          return (
            <View style={[styles.messageContainer, containerStyle]}>
              <View style={styles.bubble}>
                {item.content && (
                  <Text style={styles.message}>{item.content}</Text>
                )}
                {item.media && (
                  <Image
                    source={{uri: item.media.uri}}
                    style={styles.previewImage}
                  />
                )}
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Nếu có media được chọn, hiển thị preview */}
      {selectedMedia && (
        <View style={styles.mediaPreview}>
          <Image
            source={{uri: selectedMedia.uri}}
            style={styles.previewImage}
          />
          <TouchableOpacity
            onPress={() => setSelectedMedia(null)}
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

        {(messageText.length > 0 || selectedMedia) && (
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
