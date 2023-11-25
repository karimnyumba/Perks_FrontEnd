import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  topPart: {
    height: '25%',
    width: '100%',
    marginTop: 0,
  },
  headerImage: {
    height: '115%',
  },
  overlay: {
    position: 'absolute',
    height: '115%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    height: '100%',
    width: '100%',
  },
  titleText: {
    width: '100%',
    top: '45%',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  searchIcon: {
    alignItems: 'flex-end',
    padding: '5%',
  },
  searchInput: {
    paddingRight: '50%',
  },
  page: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  openButton: {
    height: 80,
    width: '90%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    marginVertical: '2%',
    marginLeft: '5%',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 9,
      },
    }),
  },
  restaurantImage: {
    width: '30%',
    height: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
  },
  restaurantInfo: {
    paddingStart: '5%',
  },
  restaurantname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  pointsCard: {
      fontSize: 15,
      marginTop: 10,
  },
  noRestaurantsView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '25%',
  },
  noRestaurantsText: {
    width: '85%',
    top: '65%',
    marginTop: '15%',
    marginBottom: '10%',
    textAlign: 'center',
    fontSize: 18,
    color: 'grey',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
});

export default styles;
