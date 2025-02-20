import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { RadioButton } from "react-native-paper";


const AddressListScreen = () => {
    const [selectedId, setSelectedId] = useState("1");
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Nguyễn Thị Thủy",
      phone: "+84 968 229 687",
      address: "Nhà số 4, ngách số 2, nhà văn hóa thôn cuối chùa, Xã Bình Phú, Huyện Thạch Thất, Hà Nội",
      default: true,
    },
    {
      id: "2",
      name: "Hoàng Bích Ngọc",
      phone: "+84 867 770 980",
      address: "Hội Trường Buông, Thôn Buông 1, Xã Bình Thuận, Huyện Văn Chấn, Yên Bái",
      default: false,
    },
    {
      id: "3",
      name: "Nguyễn Anh Hào",
      phone: "+84 374 693 822",
      address: "Số nhà 92 phố Nguyễn Xá, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội",
      default: false,
    },
  ]);

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((item) => ({
        ...item,
        default: item.id === id,
      }))
    );
  };

  <Text>Địa chỉ</Text>
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setDefaultAddress(item.id)} style={styles.itemContainer}>
      <RadioButton
        value={item.id}
        status={selectedId === item.id ? "checked" : "unchecked"}
        onPress={() => setSelectedId(item.id)}
        color="#E53935"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.address}>{item.address}</Text>
        {item.default && <Text style={styles.defaultLabel}>Mặc định</Text>}
      </View>
      <TouchableOpacity>
        <Text style={styles.editText}>Sửa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chọn địa chỉ nhận hàng</Text>
      <FlatList data={addresses} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <TouchableOpacity style={styles.addButton}>
        <Image source={require('../assets/image/plus.png')}/>
        <Text style={styles.addText}>Thêm Địa Chỉ Mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    color: "gray",
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
  defaultLabel: {
    backgroundColor: "#E53935",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  editText: {
    color: "#E53935",
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  addText: {
    color: "#E53935",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default AddressListScreen;
