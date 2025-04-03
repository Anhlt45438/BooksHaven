import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
import {getAccessToken} from '../redux/storageHelper';
import ItemMessage from './ItemMessage';

const Message = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  useFocusEffect(
    React.useCallback(() => {
      const intervalId = setInterval(async () => {
        const accessToken = await getAccessToken();
        try {
          const response = await fetch(
            'http://14.225.206.60:3000/api/conversations?page=1&limit=20',
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
            return (
              new Date(b.ngay_cap_nhat).getTime() -
              new Date(a.ngay_cap_nhat).getTime()
            );
          });
          setMessages(sortedMessages); // Cập nhật tin nhắn
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, 2000); // Gọi lại mỗi 2 giây

      // Dọn dẹp khi component unmount
      return () => clearInterval(intervalId);
    }, []),
  );

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>Lỗi: {error}</Text>;
  }

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
        renderItem={({item, index}) => <ItemMessage item={item} />}
        keyExtractor={item => item._id}
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
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
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
