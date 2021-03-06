import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {Button} from 'react-native';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import jj from '../cennzapp'
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import { REACT_APP_GOOGLE_API_KEY } from 'react-native-dotenv';
const MY_API_KEY = REACT_APP_GOOGLE_API_KEY;
console.log(MY_API_KEY);
class GoogleSuggest extends React.Component {
  state = {
      search: "",
      value: "",
  }

  handleInputChange = e => {
      this.setState({search: e.target.value, value: e.target.value})
  }

  handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
      console.log(geocodedPrediction, originalPrediction) // eslint-disable-line
      this.setState({search: "", value: geocodedPrediction.formatted_address})
  }
  
  handleNoResult = () => {
      console.log('No results for ', this.state.search)
  }

  handleStatusUpdate = (status) => {
      console.log(status)
  }

  render() {
      const {search, value} = this.state
      return (
          <ReactGoogleMapLoader
              params={{
                  key: MY_API_KEY,
                  libraries: "places,geocode",
              }}
              render={googleMaps =>
                  googleMaps && (
                      <ReactGooglePlacesSuggest
                          googleMaps={googleMaps}
                          autocompletionRequest={{
                              input: search,
                              componentRestrictions:{country:"sg"}
                              // Optional options
                              // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
                          }}
                          // Optional props
                          
                          onNoResult={this.handleNoResult}
                          onSelectSuggest={this.handleSelectSuggest}
                          onStatusUpdate={this.handleStatusUpdate}
                          textNoResults="My custom no results text" // null or "" if you want to disable the no results item
                          customRender={prediction => (
                              <div className="customWrapper">
                                  {prediction
                                      ? prediction.description
                                      : "My custom no results text"}
                              </div>
                          )}
                      >
                          <input
                              type="text"
                              value={value}
                              placeholder="Search a location"
                              onChange={this.handleInputChange}
                          />
                      </ReactGooglePlacesSuggest>
                  )
              }
          />
      )
  }
}
export default function HomeScreen(props) {
  //jj();
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <GoogleSuggest/>
        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
          <Button
          title="Go to Floorplan"
          onPress={() =>
            props.navigation.navigate('FloorplanUp', {
              default_ipfs: '127.0.0.1:5001',
            })
          }
        />
        <Button
          title="Go to Foodmenu"
          onPress={() =>
            props.navigation.navigate('FoodMenuUp', {
              default_ipfs: '127.0.0.1:5001',
            })
          }
        />
        <Button
          title="Go to Profile"
          onPress={() =>
            props.navigation.navigate('Profile', {
            })
          }
        />
        </View>

        <View style={styles.getStartedContainer}>
          <DevelopmentModeNotice />

          <Text style={styles.getStartedText}>Get started by opening</Text>

          <View
            style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
            <MonoText>screens/HomeScreen.js</MonoText>
          </View>

          <Text style={styles.getStartedText}>
            Change this text and your app will automatically reload.
          </Text>
        </View>

        <View style={styles.helpContainer}>
          <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
            <Text style={styles.helpLinkText}>
              Help, it didn’t automatically reload!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          This is a tab bar. You can edit it in:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            navigation/MainTabNavigator.js
          </MonoText>
        </View>
      </View>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
