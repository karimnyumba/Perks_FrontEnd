import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyName: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: '5%',
        padding: 20,
        left: 13,
    },
    logoImg: {
        width: 70,
        height: 50,
    },
    nameText: {
        fontSize: 30,
        top: 19,
        right: 38,
    },
    loginText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: '9%',
        marginBottom: '6%',
    },
    input: {
      width: '80%',
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 10,
      marginTop: '5%',
      marginBottom: '5%',
      padding: 10,
      paddingStart: 20,
    },
    customButton: {
        width: '75%',
        height: '7%',
        backgroundColor: "#02113F",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: '8%',
        marginBottom: '8%',
    },
    buttonText: {
        fontSize: 18,
        color: "#ECE1E1",
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordVisibilityIcon: {
        position: 'absolute',
        right: 15,
    },
    forgotPwordText: {
        width: '100%',
        paddingStart: '15%',
        textDecorationLine: 'underline',
        color: '#1E1E1E',
    },
    signUpText: {
        color: 'blue',
        marginBottom: 30,
    },
    horizontalLine: {
        height: 1,
        width: '90%',
        backgroundColor: 'gray',
        marginVertical: 20,
    },
    footerText: {
        textAlign: 'center',
        color: 'gray',
    },
    errorMsg: {
        width: '78%',
        bottom: '2%',
        color: 'red',
        fontWeight: '300',
        fontSize: 13,
    },
});

export default styles;