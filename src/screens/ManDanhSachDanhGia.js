import { StyleSheet, Text, View,TouchableOpacity,Image, FlatList } from 'react-native'
import React from 'react'

const ManDanhSachDanhGia = () => {
  const Data=[
    {id:1,noidung:'Sách hay đấy',sosao:5,tenuser:'Nguyen Van A',anh:{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK8cu1CSWR5Olmpms_4WnF6FIiItNMjQP4BA&s'},che:true},
    {id:2,noidung:'Sách khôgn hayhaykkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',sosao:3,tenuser:'Nguyen Van B',anh:{uri:'https://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg'},che:false},
    {id:3,noidung:'Sách khá hayhay',sosao:4,tenuser:'Nguyen Van C',anh:{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXSjkWNYkyTK94NswJwN5f4kUJ7eQMn2GJ7w&s'},che:true},
    {id:4,noidung:'Sách mớivvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',sosao:3,tenuser:'Nguyen Van D',anh:{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/User_icon-cp.svg/1656px-User_icon-cp.svg.png'},che:false},
    {id:5,noidung:'Sách okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',sosao:5,tenuser:'Nguyen Van E',anh:{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK8cu1CSWR5Olmpms_4WnF6FIiItNMjQP4BA&s'},che:true},
  ]
  const renderItem=({item})=>{
    const saovang=require('../assets/icon_saovang.png');
    const saorong=require('../assets/icon_saorong.png');
    const hideName = (name) => {
      if (item.che) {
        return name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1);
      }
      return name;
    };
       return(
        <View style={{height:'auto',width:'100%',marginTop:10,padding:5,borderBottomWidth:1,borderColor:'#D9D9D9'}}>
        <View style={{flexDirection:'row'}}>
      <Image style={{height:50,width:50,borderRadius:30}} source={item.anh}/>
      <View style={{marginLeft:10}}>
      <Text style={{fontSize:16,fontWeight:'bold'}}>{hideName(item.tenuser)}</Text>
      <View style={{ flexDirection: "row", marginTop: 5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Image
                key={star}
                source={star <= item.sosao ? saovang : saorong}
                style={{ width: 15, height: 15, marginRight: 2 }}
              />
            ))}
          </View>

          <Text style={{marginTop:10}}>{item.noidung}</Text>
      </View>
        </View>

       </View>
       )
  }
  return (
    <View style={styles.container}>
     <View style={{flexDirection:'row',justifyContent:'center',}}>
           <TouchableOpacity onPress={()=>{navigation.goBack()}}>
            <Image style={{height:20,width:20,position:'absolute',right:90,top:5}} source={require('../assets/icon_back.png')} />
           </TouchableOpacity>
           <Text style={styles.title}>Bài đánh giá</Text>
          </View>
          <View style={{marginTop:30}}>
            <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item)=>item.id}
            ListEmptyComponent={<Text style={{textAlign:'center',
                    marginTop:20
                   }}>Không có đánh giá nào về sách</Text>}
            />
          </View>
    
    </View>
  )
}

export default ManDanhSachDanhGia

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    backgroundColor:'#FFFFFF'
   
  },
  title:{
    fontSize:20,
    fontWeight:'bold',

 },
})