import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const messages = [
  {
    id: '1',
    name: 'fancyhome.vn',
    message: 'Chào bạn, tôi là nhân viên CSKH, thấy bạn thu hồi...',
  },
  {id: '2', name: 'ruych.studio', message: 'Dạ M ạ'},
  {
    id: '3',
    name: 'delicacy06.vn',
    message: 'Gia đình ấm áp, cuộc sống hạnh phúc, bắt đầu từ nó',
  },
  {
    id: '4',
    name: 'snowa17.vn',
    message: 'Xin chào, cảm ơn bạn đã ghé thăm Shop! Shop thắc mắc gì không?',
  },
  {
    id: '5',
    name: 'buiphuongdanchau2614',
    message: 'Boss của tui đang đợi quá! Bạn cho bé ít đồ ăn nhé...',
  },
  {id: '6', name: 'TOP Market.vn', message: 'Dạ'},
  {
    id: '7',
    name: 'DHC Vietnam Official',
    message: 'Đánh giá để nhận Shopee Xu!',
  },
  {
    id: '8',
    name: 'Ông Trùm Phụ Kiện 4.0',
    message: '[Duy nhất 25/08] SALE LỚN Ngập tràn FREESHIP',
  },
  {
    id: '9',
    name: 'Bông Sen Vàng Official',
    message: 'nay ngày sale 25/8 được free ship và được tặng rất nhiều',
  },
];

const Message = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/Vector.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Text style={styles.headertext}>Chat</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.messageContainer}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('MessageDetail', {shopName: item.name})
            }>
            <Image
              source={require('../assets/images/image3.png')}
              style={styles.avatar}
            />
            <View style={styles.messageContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyMessage}>
            <Text style={styles.emptyText}>Không có tin nhắn nào</Text>
          </View>
        }
      />
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 15,
  },
  headertext: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  emptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
