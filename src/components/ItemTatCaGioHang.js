import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Otich from './Otich';


const ItemTatCaGioHang = ({ item, onCheckChange, onUpdateQuantity, isChecked, onDelete }) => {


    const [checked, setChecked] = useState(isChecked);
    const [localQuantity, setLocalQuantity] = useState(item.soluong || 1);
    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);



  const toggleCheckbox=()=>{
    const newChecked=!checked
    setChecked(newChecked)
    onCheckChange(newChecked, item.gia);
}
  const tangSoLuong=()=>{
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onUpdateQuantity(newQuantity, checked);
  }
  const giamSoLuong=()=>{
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onUpdateQuantity(newQuantity, checked);
    }
  }
  const handleDelete = () => {
    onDelete(item.id); // Gọi hàm xóa trong component cha
  };
    
   
  return (
    <View style={styles.container}>
      <View >
      <Image style={{height:90,width:70,padding:10}} source={item.anh}/>
      </View>
      <View style={styles.it}>
           <View style={{flexDirection:'row',paddingLeft:15,paddingTop:10,alignItems:'center',justifyContent:'space-between'}}>
            <View style={{flexDirection:'column',width:250}}>
            <Text>{item.ten}- {item.shop}</Text>
            <Text style={{paddingTop:3}}>{item.gia}</Text>
            <Text style={{color:'#5900FF',paddingTop:3}}>{item.theloai}</Text>
            
            <View style={{flexDirection:'row',paddingTop:10,alignItems:'center'}}>
             <TouchableOpacity onPress={giamSoLuong} >
             <Image style={{height:20,width:20}} source={require('../assets/icon_tru.png')} />
             </TouchableOpacity>

             <Text style={{marginLeft:15,backgroundColor:'black',color:'white',fontWeight:'bold',padding:5,borderRadius:10}}>{localQuantity}</Text>

                                <TouchableOpacity style={{paddingLeft:15}} onPress={tangSoLuong} >
                                    <Image style={{height:25,width:25}} source={require('../assets/icon_cong.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{paddingLeft:15}} onPress={handleDelete} >
                                    <Image style={{height:25,width:25}} source={require('../assets/thungrac.png')} />
                                </TouchableOpacity>

                            </View>

                        </View>

            
            <TouchableOpacity onPress={toggleCheckbox} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Image style={{height:24,width:24}} source={require('../assets/dautich2.png')}/>}
        </View>
    </TouchableOpacity>
           </View>
          
           
 

            </View>
        </View>
    )
}

export default ItemTatCaGioHang
const styles = StyleSheet.create({
  container:{
flexDirection:'row',
alignItems:'center',
marginTop:10,


  },
  it:{
    height:'auto',
    width:'80%',
    backgroundColor:'#EBEBF1',
    paddingBottom:5,
      borderTopRightRadius:20,
      borderBottomRightRadius:20,
      

    },
    checkboxContainer: {
        marginRight:20,
        alignItems: 'center',

    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
    },
    checked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    label: {
        fontSize: 16,
    },
})