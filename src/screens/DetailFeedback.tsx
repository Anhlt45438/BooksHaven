import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAppSelector } from '../redux/hooks';

const data = {
  phan_hoi: [
    {
      id_message: '67f8d3c73877295cffe63077',
      sender_id: '67e843cabca065b24db15604',
      content: 'I have an issue with my recent order.',
      created_at: '2025-04-11T08:33:11.598Z',
      is_admin: false,
    },
  ],
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

const App = ({route}) => {
    const navigation = useNavigation()
    const feedback=route.params.phan_hoi
     const user = useAppSelector(state => state.user.user) || {
            _id: '',
            username: 'Người dùng',
            avatar: null,
            accessToken: '',
        };
  return (
    <View style={styles.container}>
        <View style={styles.header}>
                              <View style={styles.headerContent}>
                                  <TouchableOpacity onPress={() => navigation.replace('FeedbacktoUser')}>
                                      <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                                  </TouchableOpacity>
                                  <Text style={styles.title}>Phản hồi từ chúng tôi</Text>
                              </View>
                          </View>
      <FlatList
        data={feedback}
        keyExtractor={(item) => item.id_message}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text>Kính gửi : {user.username}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.meta}>
              From: Book Haven
            </Text>
            <Text style={styles.meta}>Time: {formatDate(item.created_at)}</Text>
          </View>
        )}
      />
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
});

export default App;
