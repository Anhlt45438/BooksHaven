import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Alert,
    Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {locations} from '../location/Locations';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {updateUserThunk} from '../redux/userSlice';
import {red} from "react-native-reanimated/lib/typescript/Colors";

const UpdateDiaChiScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user); // Lấy thông tin user từ Redux

    const [addressDetail, setAddressDetail] = useState('');
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false);
    const [isDistrictModalVisible, setIsDistrictModalVisible] = useState(false);
    const [isWardModalVisible, setIsWardModalVisible] = useState(false);

    const [searchProvince, setSearchProvince] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');
    const [searchWard, setSearchWard] = useState('');

    const getDistricts = () =>
        selectedProvince
            ? locations.find((loc) => loc.name === selectedProvince)?.districts || []
            : [];

    const getWards = () =>
        selectedDistrict
            ? locations
            .find((loc) => loc.name === selectedProvince)
            ?.districts.find((dist) => dist.name === selectedDistrict)?.wards || []
            : [];

    const renderModal = (type, data) => {
        const query =
            type === 'province'
                ? searchProvince
                : type === 'district'
                    ? searchDistrict
                    : searchWard;
        const filteredData = data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        return (
            <Modal
                visible={
                    type === 'province'
                        ? isProvinceModalVisible
                        : type === 'district'
                            ? isDistrictModalVisible
                            : isWardModalVisible
                }
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => closeModal(type)}>
                        <Image style={{height: 15, width: 15}} source={require('../assets/icons/close.png')}/>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={
                            type === 'province'
                                ? 'Tìm kiếm Tỉnh/Thành phố'
                                : type === 'district'
                                    ? 'Tìm kiếm Quận/Huyện'
                                    : 'Tìm kiếm Phường/Xã'
                        }
                        value={query}
                        onChangeText={(text) => {
                            if (type === 'province') setSearchProvince(text);
                            else if (type === 'district') setSearchDistrict(text);
                            else setSearchWard(text);
                        }}
                    />
                    <FlatList
                        key="flatlist_2"
                        data={filteredData}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{justifyContent: 'space-around'}}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    if (type === 'province') {
                                        setSelectedProvince(item.name);
                                        setSelectedDistrict(null);
                                        setSelectedWard(null);
                                        setSearchProvince('');
                                    } else if (type === 'district') {
                                        setSelectedDistrict(item.name);
                                        setSelectedWard(null);
                                        setSearchDistrict('');
                                    } else {
                                        setSelectedWard(item.name);
                                        setSearchWard('');
                                    }
                                    closeModal(type);
                                }}
                            >
                                <Text style={styles.modalItemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const closeModal = (type) => {
        if (type === 'province') setIsProvinceModalVisible(false);
        else if (type === 'district') setIsDistrictModalVisible(false);
        else setIsWardModalVisible(false);
    };

    const handleSaveAddress = async () => {
        if (!addressDetail || !selectedProvince || !selectedDistrict || !selectedWard) {
            Alert.alert('Lỗi', 'Vui lòng chọn đầy đủ thông tin địa chỉ');
            return;
        }

        const fullAddress = `${addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

        try {
            const updateData = {dia_chi: fullAddress};
            await dispatch(updateUserThunk({userId: user._id, updateData})).unwrap();
            Alert.alert('Thành công', 'Cập nhật địa chỉ thành công!', [
                {text: 'OK', onPress: () => navigation.goBack()},
            ]);
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật địa chỉ không thành công!');
            console.error('Lỗi khi cập nhật địa chỉ:', error);
        }
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <View style={{marginRight: 'auto'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={{height: 25, width: 25}} source={require('../assets/icons/back.png')}/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>Cập nhật địa chỉ</Text>
            </View>

            <View style={{backgroundColor: '#afafaf', justifyContent: 'center', width: '100%', height: 100}}>
                <Text style={{fontSize: 18, fontWeight: '800', marginLeft: 20}}>Địa chỉ hiện tại:</Text>
                <Text style={{marginLeft: 20, marginTop: 5}}>
                    {user.dia_chi || 'Chưa thiết lập'}
                </Text>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.selector} onPress={() => setIsProvinceModalVisible(true)}>
                    <Text style={styles.selectorText}>
                        {selectedProvince ? selectedProvince : 'Chọn Tỉnh/Thành phố'}
                    </Text>
                </TouchableOpacity>

                {selectedProvince && (
                    <TouchableOpacity style={styles.selector} onPress={() => setIsDistrictModalVisible(true)}>
                        <Text style={styles.selectorText}>
                            {selectedDistrict ? selectedDistrict : 'Chọn Quận/Huyện'}
                        </Text>
                    </TouchableOpacity>
                )}

                {selectedDistrict && (
                    <TouchableOpacity style={styles.selector} onPress={() => setIsWardModalVisible(true)}>
                        <Text style={styles.selectorText}>
                            {selectedWard ? selectedWard : 'Chọn Phường/Xã'}
                        </Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường...)"
                    value={addressDetail}
                    onChangeText={setAddressDetail}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                    <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
                </TouchableOpacity>
            </View>

            {renderModal('province', locations)}
            {renderModal('district', getDistricts())}
            {renderModal('ward', getWards())}
        </View>
    );
};

export default UpdateDiaChiScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        marginRight: 'auto',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F1EFF1',
        padding: 20,
    },
    selector: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginVertical: 5,
        width: '95%',
        borderRadius: 5,
    },
    selectorText: {
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        width: '95%',
    },
    saveButton: {
        backgroundColor: '#00B822',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    searchInput: {
        marginTop: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: '90%',
        marginBottom: 10,
    },
    modalItem: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 5,
        width: 200,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    modalItemText: {
        fontSize: 16,
    },
    modalCloseButton: {
        backgroundColor: '#9e9e9e',
        padding: 10,
        borderRadius: 50,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 10,
    },
});