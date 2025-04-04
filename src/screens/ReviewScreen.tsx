import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ToReviewScreen from "./ToReviewScreen";
import ReviewedScreen from "./ReviewedScreen";
import {useNavigation} from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

const ReviewTabScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/icons/back.png')}
                        style={{width: 26, height: 26}}
                    />
                </TouchableOpacity>
                <View style={{flex: 1,alignItems: 'center',marginRight: 26}}>
                    <Text style={styles.headertext}>Đánh giá của tui</Text>
                </View>
            </View>


            {/* Tabs */}
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
                    tabBarIndicatorStyle: { backgroundColor: "#ff4500" },
                    tabBarScrollEnabled: false,

                }}
            >
                <Tab.Screen name="Đánh giá" component={ToReviewScreen} />
                <Tab.Screen name="Đã đánh giá" component={ReviewedScreen} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        alignItems: "center",
        flexDirection: 'row',
    },
    back: {
        marginTop: 4,
    },
    headertext: {
        marginLeft: 26,
        fontSize: 21,
        marginTop: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ReviewTabScreen;