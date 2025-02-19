import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';

const Home =()=>{
    return(
        <View style={{ alignItems: "center", width: "100%" }}>
            <SafeAreaView style={{flex:1,marginHorizontal:20}}>
                <TextInput placeholder='Tìm kiếm' clearButtonMode='always' style={style.searchBox}/>
            </SafeAreaView>
           
        </View>
    )
}
const style = StyleSheet.create({
    searchBox:{
        paddingHorizontal:20,paddingVertical:10,borderColor:'#ccc',borderWidth:1,borderRadius:8
    }
})
export default Home

