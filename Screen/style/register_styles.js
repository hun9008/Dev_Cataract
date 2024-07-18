import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 2,
  },
  buttonStyle: {
    backgroundColor: '#084B8A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#084B8A',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 14,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  checkBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
    },
    checkBox: {
      marginRight: 5,
    },
    label: {
      marginRight: 10,
      marginTop: 5,
      fontSize: 15,
      color: '#8b9cb5',
    },
    birthPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 80,
        marginRight: 80,
        marginTop: 20,
      },
      wheelPicker: {
        width: 80,
        height: 150,
      },
});