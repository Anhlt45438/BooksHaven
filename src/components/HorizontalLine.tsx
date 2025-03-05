import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = ({ color = '#ececec', thickness = 1, marginVertical = 10 }) => {
    return <View style={[styles.line, { backgroundColor: color, height: thickness, marginVertical }]} />;
};

const styles = StyleSheet.create({
    line: {
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});

export default HorizontalLine;
