import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedUpload = ({route}) => {
    const userId = route.params.userId;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>FeedUpload</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Optional: set a background color
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000', // Optional: set a text color
    },
});

export default FeedUpload;
