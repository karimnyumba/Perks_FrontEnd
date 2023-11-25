import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    scrollViewContent: {
      alignItems: "center",
      flexGrow: 1,
    },
    scrollcontainer: {
        width: '90%',
        marginTop: 10,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: '5%',
        paddingTop: '5%',
        paddingBottom: '2%',
        borderBottomWidth: 1,
        borderColor: '#02113F',
    },
    rewardImg: {
        width: '20%',
        height: '100%',
        resizeMode: 'contain',
    },
    rewardInfo: {
        width: '65%',
        paddingStart: 15,
    },
    rewardCard: {
        fontSize: 19,
        fontWeight: '500',
        color: 'black',
        paddingBottom: 10,
    },
    pointsCard: {
        fontSize: 13,
        color: 'black'
    },
    getAndRedeemButton: {
        backgroundColor: '#02113F',
        borderRadius: 10,
        textAlign: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginLeft: 10,
    },
    getAndRedeemReward: {
        fontSize: 13,
        color: 'white',
    },
    imagesomething: {
        height: '100%',
    },
    card: {
        width: '90%',
        height: '20%',
        marginBottom: '5%',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    contentOfCard: {
        width: '100%',
        paddingTop: '5%',
        paddingHorizontal: 20,
    },
    restaurantName: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    points: {
        color: 'gold',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    userName: {
        color: 'white',
        fontSize: 15,
        fontWeight: '400',
        top: '8%',
    },
    rewardsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: '5%',
    },
    leftTitle: {
        fontSize: 18,
        alignSelf: 'flex-end',
        fontWeight: 'bold',
    },
    rewardsButton: {
        backgroundColor: '#02113F',
        borderRadius: 10,
        textAlign: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
    },
    myRewardsText: {
        fontSize: 15,
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%',
    },
    loadingTopCard: {
        marginVertical: '3.5%',
    },
    noRewardsText: {
        fontSize: 17,
        marginTop: '30%',
        alignSelf: 'center',
    }
});

export default styles;
