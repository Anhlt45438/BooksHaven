import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Platform, Dimensions, FlatList, Text } from "react-native";

const data = [
  { id: 1, image: 'https://th.bing.com/th/id/R.d9e66c2256c7091a90c1d4fe9a53a401?rik=NwPzNhuuIh1DZw&pid=ImgRaw&r=0', price: 150000, title: 'Đắc Nhân Tâm' },
  { id: 2, image: 'https://th.bing.com/th/id/OIP.ulRq3BxYWAb5Di8WMto1cQHaE7?rs=1&pid=ImgDetMain', price: 200000, title: 'Nhà Giả Kim' },
  { id: 3, image: 'https://th.bing.com/th/id/OIP.gp-FE30sRRH6dQbCbGCNHwHaHa?rs=1&pid=ImgDetMain', price: 180000, title: 'Muôn Kiếp Nhân Sinh' },
  { id: 4, image: 'https://th.bing.com/th/id/OIP.Y1mgBvAVGLQQu0538kslHAHaE7?rs=1&pid=ImgDetMain', price: 220000, title: 'Bí Mật Của Naoko' },
  { id: 5, image: 'https://th.bing.com/th/id/OIP.uQ6_BBUp2gQdxy4NaYtgbgHaE7?rs=1&pid=ImgDetMain', price: 135000, title: 'Dám Bị Ghét' },
  { id: 6, image: 'https://th.bing.com/th/id/OIP.-nLarKhZcQK60PYF00DHwQHaE7?rs=1&pid=ImgDetMain', price: 250000, title: 'Tư Duy Nhanh Và Chậm' },
];

const { width } = Dimensions.get('window');
const numColumns = 2;

const SearchComponent = () => {
  const [query, setQuery] = useState("");

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Giá: {item.price} VND</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <View style={styles.searchBoxContainer}>
          <TextInput
            placeholder="Tìm kiếm..."
            style={styles.searchBox}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
          />
          {Platform.OS === "android" && query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}> 
              <Image source={require("../assets/image/closed.jpg")} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={require('../assets/image/conversation.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.suggestionText}>Gợi ý hôm nay</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
  },
  clearIcon: {
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    width: width / numColumns - 30,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
    textAlign: 'center',
  },
});

export default SearchComponent;
