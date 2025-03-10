import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'


const ManDanhGia = () => {
  const [selectedRating, setSelectedRating] = useState(0); // Lưu số sao được chọn
  const [noidungdanhgia, setNoidungdanhgia] = useState(""); // Lưu số sao được chọn
  const [isAnonymous, setIsAnonymous] = useState(false); // State cho checkbox ẩn danh

  const handleStarPress = (rating) => {
    setSelectedRating(rating);
  };
  const saorong=require('../assets/icon_saorong.png');
  const saovang=require('../assets/icon_saovang.png');


  return (
    <View style={styles.container}>
     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:10}}>
      <TouchableOpacity>
        <Image source={require('../assets/icon_back.png')} />
      </TouchableOpacity>
      <Text style={{fontSize:23,fontWeight:'bold'}}>Đánh giá sản phẩm</Text>
      <TouchableOpacity>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#5908B0'}}>Lưu</Text>
      </TouchableOpacity>

     </View>

     <View style={styles.container2}>
      <View style={{flexDirection:'row',alignItems:'center', width:'100%'}}>
      <Image style={{height:120,width:100,borderColor:'black',borderWidth:1}} source={{uri:'https://cbqqo.edu.vn/storage/app/public/photos/3/5e51ed485ef00.jpg'}} />
      <Text style={{fontSize:23,marginLeft:20}}>Sách: Tôi đi học</Text>
      </View>

      <View style={{alignItems:'center', justifyContent:'center', marginTop: 20}}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Mời bạn đánh giá</Text>
      <View style={{flexDirection:'row',marginTop:5}}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
          <Image
            source={star <= selectedRating ? saovang : saorong}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
      </View>

      <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',marginTop:20}}>
        <TouchableOpacity style={styles.nut}>
           <Image source={require('../assets/icon_mayanh.png')} />
           <Text>Thêm hình ảnh</Text>
            
        </TouchableOpacity>
        <TouchableOpacity style={styles.nut}>
        <Image source={require('../assets/icon_mayquay.png')} />
        <Text>Thêm video</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop:20,width:'100%'}}>
     <TextInput
     style={styles.onhap}
     placeholder='Nhập đánh giá của bạn về sản phẩm...'
     multiline
     numberOfLines={5}
     value={noidungdanhgia}
     onChangeText={setNoidungdanhgia}
     
     />
      </View>
      </View>
     </View>

     <View style={{marginTop:10,padding:10}}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Đánh giá ẩn danh</Text>
      <View style={{flexDirection:'row',marginTop:5,justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{fontSize:15}}>Tên tài khoản của bạn sẽ hiển thị như 0******1</Text>
        <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            {isAnonymous && <Image source={require('../assets/icon_tichtron.png')} />}
          </TouchableOpacity>
      </View>
     </View>
    </View>
  )
}

export default ManDanhGia

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    backgroundColor:'#FFFFFF'
  },
  container2:{
    flex:'auto',
    backgroundColor:'#D9D9D9',
    marginTop:20,
    padding:20
   
  },
  star: {
    width: 25,  // Kích thước ảnh sao
    height: 25,
    margin: 10,
  },
  nut:{
    height:100,
    width:'40%',
    backgroundColor:'#FFFDFD',
    
    justifyContent:'space-evenly',
    alignItems:'center',
    borderRadius: 10, // Bo góc nhẹ để đổ bóng đẹp hơn
    shadowColor: '#000', // Màu bóng (đen)
    shadowOffset: { width: 0, height: 4 }, // Độ lệch bóng
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 4, // Bán kính bóng
    elevation: 5, // Đổ bóng cho Android
  },
  onhap:{
    width:'100%',
    height:230,
    backgroundColor:'#FFFFFF',
    borderWidth:1,
    borderColor:'black',
    textAlignVertical: 'top',
    padding:10

  },
  checkbox: {
    width: 27,
    height: 27,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
})