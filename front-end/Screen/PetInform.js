import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

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
                    <View style={styles.section}>
                        <Text style={styles.title}>{`펫 이름: ${petDetails.p_name}`}</Text>
                        <Text style={styles.label}>{`견종: ${petDetails.p_type}`}</Text>
                        <Text style={styles.label}>{`털 색깔: ${petDetails.p_color}`}</Text>
                        <Text style={styles.label}>{`나이: ${petDetails.p_age}`}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.resultLabel}>{`진단 결과: ${petDetails.diagnosis_result}`}</Text>
                        <Text style={styles.detailsLabel}>세부 내용:</Text>
                        <Text style={styles.detailItem}>{`정상: ${petDetails.detail_normal}%`}</Text>
                        <Text style={styles.detailItem}>{`초기: ${petDetails.detail_initial}%`}</Text>
                        <Text style={styles.detailItem}>{`중기: ${petDetails.detail_mid}%`}</Text>
                        <Text style={styles.detailItem}>{`말기: ${petDetails.detail_final}%`}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.detailsLabel}>진단 결과 사진</Text>
                        <View style={styles.imagesContainer}>
                            {petDetails.p_images && petDetails.p_images.map((imageUri, index) => (
                                <Image key={index} source={{ uri: imageUri }} style={styles.image} />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.dateLabel}>{`진단 날짜: ${petDetails.p_diagnosis_date}`}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {}}>
                            <Text style={styles.buttonText}>다시 찍기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {}}>
                            <Text style={styles.buttonText}>저장하기</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5DC',
    },
    section: {
        width: '100%',
        backgroundColor: '#A9B48C',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    label: {
        fontSize: 18,
        color: '#000',
        marginVertical: 3,
    },
    resultLabel: {
        fontSize: 18,
        color: '#2E8B57', // 어두운 녹색 계열로 변경
        fontWeight: 'bold',
    },
    detailsLabel: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 10,
    },
    detailItem: {
        fontSize: 16,
        color: '#2E8B57', // 세부 항목의 색상도 같은 계열로 변경
    },
    imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    dateLabel: {
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
    },
    button: {
        backgroundColor: '#6F4E37',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30, // 둥근 모서리
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PetDetails;
