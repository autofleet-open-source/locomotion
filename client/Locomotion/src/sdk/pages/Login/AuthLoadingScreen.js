import React, { useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';

const AuthLoadingScreen = ({ navigation }) => {
  const [appState, dispatch] = useStateValue();
  const init = () => {
    async function getFromStorage() {
      const payload = await AppSettings.getSettings();

      await dispatch({
        type: 'changeState',
        payload,
      });

      let page = payload.auth ? 'App' : 'Auth';
      if (payload.userProfile && needOnboarding(payload.userProfile)) {
        page = 'Onboarding';
      }

      navigation.navigate(page);
    }
    if (!appState) { // Load app state
      getFromStorage();
    }
  };
  useEffect(init, []);
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};
export default AuthLoadingScreen;
