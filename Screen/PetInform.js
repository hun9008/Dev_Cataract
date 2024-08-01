import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PetDetails = ({ route }) => {
    const { userId, p_name } = route.params;
    const [petDetails, setPetDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const url = `http://cataractserver.hunian.site/account/user/pet?user_id=${userId}&pet_name=${p_name}`;
                const response = await fetch(url);
                const data = await response.json();
                setPetDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pet details:', error);
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [userId, p_name]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {petDetails ? (
                <>
                    <Text style={styles.label}>Name: {petDetails.p_name}</Text>
                    <Text style={styles.label}>Type: {petDetails.p_type}</Text>
                    <Text style={styles.label}>Color: {petDetails.p_color}</Text>
                    <Text style={styles.label}>Age: {petDetails.p_age}</Text>
                </>
            ) : (
                <Text>No pet details found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
    },
});

export default PetDetails;
