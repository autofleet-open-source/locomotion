import React, { useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';
import network from '../../services/network';
import Auth from '../../services/auth';

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

      if(payload.userProfile) {
        const { data: userData } = await network.get('api/v1/me')
        if(userData  === null) {
          Auth.logout(navigation);
        }

        const userProfile = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar,
          email: userData.email,
        };

        AppSettings.update({ userProfile });

        if(!userData.active) {
          page = 'Lock';
        }

        if (needOnboarding(userProfile)) {
          page = 'Onboarding';
        }
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