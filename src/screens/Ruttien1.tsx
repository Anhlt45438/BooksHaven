import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, Image, ScrollView } from "react-native";

const WithdrawScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <Image source={require('../assets/image/back1.png')} />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>Rút tiền</Text>
        </View>

        {/* Bank Account */}
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Rút tiền từ số dư TK Shopee</Text>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
          <Image source={require('../assets/image/banking.png')} />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "bold" }}>BIDV - NH Đầu tư & Phát triển VN *5478</Text>
        </View>

        {/* Input Amount */}
        <Text style={{ fontSize: 16, marginTop: 16 }}>Số tiền muốn rút</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, fontSize: 18, marginTop: 8 }}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Available Balance */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          <Switch value={isChecked} onValueChange={() => setIsChecked(!isChecked)} />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Số dư có thể rút: đ1.265.267</Text>
        </View>

        {/* Fee Information */}
        <Text style={{ fontSize: 16, marginTop: 16 }}>Phí rút tiền: đ11.000</Text>
        <Text style={{ color: "gray", fontSize: 14 }}>Phí rút tiền chỉ áp dụng cho các giao dịch thành công.</Text>

        {/* Warning Message */}
        <Text style={{ color: "red", marginTop: 8 }}>Bạn chỉ còn 3 lần rút trong ngày hôm nay</Text>
      </ScrollView>
      
      {/* Amount Transferred to Bank */}
      <View style={{ padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ddd" }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Số tiền chuyển vào tài khoản ngân hàng</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF4500" }}>đ{amount ? (parseInt(amount) - 11000).toLocaleString() : "0"}</Text>
      </View>
      
      {/* Confirm Button */}
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <TouchableOpacity style={{ backgroundColor: "#FF4500", padding: 15, borderRadius: 8, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WithdrawScreen;