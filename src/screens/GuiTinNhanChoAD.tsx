import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../redux/hooks';

const GuiTinNhanChoAdmin = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        {id: '1', text: 'Lịch sử mua hàng.', isBot: true, type: 'text'},
        {id: '2', text: 'Chào bạn, hôm nay bạn cần BooksHave hỗ trợ gì nè? 😊', isBot: true, type: 'text'},
        {id: '3', text: 'Tôi muốn hỏi về:', isBot: true, type: 'text', isHeader: true},
        {id: '4', text: 'đơn của tói đã giao đến đâu?', isBot: true, type: 'option'},
        {id: '5', text: 'mượn hủy/đóng SPayLater', isBot: true, type: 'option'},
        {id: '6', text: 'Tôi không thể thanh toán đơn hàng?', isBot: true, type: 'option'},
        {id: '7', text: 'Đơn hàng của tôi đến muộn', isBot: true, type: 'option'},
        {id: '8', text: 'Câu hỏi thường gặp', isBot: true, type: 'option'},
        {id: '9', text: 'Đợi câu hỏi', isBot: true, type: 'loading'},
    ]);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const accessToken = useAppSelector((state) => state.user.user?.accessToken);

    // Lấy danh sách thông báo khi màn hình được load
    useEffect(() => {
        fetchNotifications();
    }, [accessToken]);

    const fetchNotifications = async () => {
        try {
            if (!accessToken) {
                return;
            }


            const response = await fetch(
                'http://14.225.206.60:3000/api/notifications/user-notifications?page=1&limit=10',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken.trim()}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Dữ liệu từ API:', data);
            setNotifications(data.data || []); // Đảm bảo mảng rỗng nếu không có dữ liệu
        } catch (error) {
            setNotifications([]);
        } finally {
            setLoadingNotifications(false);
        }
    };

    // Gửi tin nhắn và phản hồi cho Admin
    const sendMessage = async () => {
        if (message.trim() === '') return;

        const newMessage = {
            id: (chatMessages.length + 1).toString(),
            text: message,
            isBot: false,
            type: 'text',
        };

        setChatMessages([...chatMessages, newMessage]);
        setMessage('');

        try {
            const response = await fetch('http://14.225.206.60:3000/api/notifications/send-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken.trim()}`,
                },
                body: JSON.stringify({noi_dung_thong_bao: message}),
            });

            if (!response.ok) {
                throw new Error('Gửi phản hồi thất bại');
            }
        } catch (error) {
        }
    };

    // Đánh dấu thông báo là đã đọc
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                `http://14.225.206.60:3000/api/notifications/mark-as-read/${notificationId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken.trim()}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Đánh dấu đã đọc thất bại');
            }

            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === notificationId ? {...notif, da_doc: true} : notif
                )
            );
        } catch (error) {
            console.error('❌ Lỗi khi đánh dấu đã đọc:', error.message);
        }
    };

    // Xử lý khi nhấn vào tùy chọn
    const handleOptionPress = (optionText) => {
        const newMessage = {
            id: (chatMessages.length + 1).toString(),
            text: optionText,
            isBot: false,
            type: 'text',
        };
        setChatMessages([...chatMessages, newMessage]);
    };

    // Render tin nhắn và thông báo
    const renderMessage = ({item}) => {
        if (item.type === 'notification') {
            if (!item.da_doc) {
                markAsRead(item._id);
            }
            return (
                <View style={[styles.messageContainer, styles.notificationMessage]}>
                    <Text style={styles.notificationText}>{item.noi_dung_thong_bao}</Text>
                    <Text style={styles.notificationDate}>
                        {new Date(item.ngay_tao).toLocaleString()}
                    </Text>
                </View>
            );
        }

        if (item.type === 'loading') {
            return (
                <View style={[styles.messageContainer, styles.botMessage]}>
                    <Text style={styles.botText}>...</Text>
                </View>
            );
        }

        if (item.type === 'option') {
            return (
                <TouchableOpacity
                    style={[styles.messageContainer, styles.botMessage, styles.optionMessage]}
                    onPress={() => handleOptionPress(item.text)}
                >
                    <Text style={styles.botText}>{item.text}</Text>
                    <Image
                        source={require('../assets/icons/next.png')}
                        style={styles.optionIcon}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <View
                style={[
                    styles.messageContainer,
                    item.isBot ? styles.botMessage : styles.userMessage,
                    item.isHeader && styles.headerMessage,
                ]}
            >
                <Text style={item.isBot ? styles.botText : styles.userText}>{item.text}</Text>
            </View>
        );
    };

    // Kết hợp thông báo và tin nhắn
    const allMessages = [
        ...(notifications || []).map((notif) => ({...notif, type: 'notification'})),
        ...chatMessages,
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')} style={styles.backIcon}/>
                </TouchableOpacity>
                <Image source={require('../assets/images/logo.png')} style={styles.avatar}/>
                <Text style={styles.headerText}>BooksHaven</Text>
            </View>

            {/* Chat Header */}
            <View style={styles.chatHeader}>
                <Image
                    source={require('../assets/icons/speaker_8679774.png')}
                    style={styles.chatHeaderIcon}
                />
                <Text style={styles.chatHeaderText}>Vấn đề vận chuyển đơn hàng</Text>
                <View style={styles.chatHeaderBadge}>
                    <Text style={styles.chatHeaderBadgeText}>1/1</Text>
                </View>
            </View>

            {/* Nội dung chat */}
            {loadingNotifications ? (
                <ActivityIndicator size="large" color="#FF0000" style={styles.loading}/>
            ) : (
                <FlatList
                    data={allMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id || item._id}
                    contentContainerStyle={styles.chatContent}
                />
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Xin chào, BooksHaven có thể giúp gì được chứ..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Image
                            source={require('../assets/icons/user_send.png')}
                            style={styles.sendIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F5F5F5'},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backIcon: {width: 24, height: 24, tintColor: '#FF0000'},
    avatar: {width: 40, height: 40, borderRadius: 20, marginLeft: 10},
    headerText: {fontSize: 18, fontWeight: 'bold', color: '#000000', marginLeft: 10},
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        padding: 10,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    chatHeaderIcon: {width: 20, height: 20, marginRight: 10},
    chatHeaderText: {fontSize: 14, color: '#FF8C00', flex: 1},
    chatHeaderBadge: {
        backgroundColor: '#FF8C00',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    chatHeaderBadgeText: {color: '#FFFFFF', fontSize: 12},
    chatContent: {padding: 10, paddingBottom: 100},
    messageContainer: {marginVertical: 5, maxWidth: '80%'},
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFE4E1',
        borderRadius: 10,
        padding: 10,
    },
    headerMessage: {backgroundColor: 'transparent', padding: 0, marginTop: 10},
    notificationMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E0F7FA',
        borderRadius: 10,
        padding: 10,
    },
    notificationText: {fontSize: 14, color: '#006064'},
    notificationDate: {fontSize: 12, color: '#607D8B', marginTop: 5},
    botText: {fontSize: 14, color: '#000000'},
    userText: {fontSize: 14, color: '#000000'},
    optionMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionIcon: {width: 16, height: 16, tintColor: '#000000'},
    inputContainer: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input: {flex: 1, fontSize: 14, paddingVertical: 8},
    sendIcon: {width: 24, height: 24, tintColor: '#FF0000'},
    loading: {flex: 1, justifyContent: 'center'},
});

export default GuiTinNhanChoAdmin;