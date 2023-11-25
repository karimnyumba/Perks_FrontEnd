import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    scrollViewContent: {
      alignItems: "center",
      flexGrow: 1,
    },
    topPart: {
        height: '25%',
        width: '100%',
        marginBottom: '10%',
    },
    headerImage: {
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlayContent: {
        height: '100%',
        width: '100%',
    },
    titleText: {
        width: '100%',
        top: '50%',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    openButton: {
        height: '10%',
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 10,
        marginVertical: '2%',
        // Shadow properties
        ...Platform.select({
            ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            },
            android: {
            elevation: 4,
            },
        }),
    },
    shawarmaImg: {
        width: '20%',
        height: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',  
    },
    shishiImg: {
        width: '20%',
        height: '80%',
        borderRadius: 10,
    },
    craveImg: {
        width: '20%',
        height: '80%',
        borderRadius: 45,
    },
    restaurantInfo: {
        paddingStart: '5%',
    },
    restaurantname: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    pointsCard: {
        fontSize: 12,
        marginTop: 5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default styles;
