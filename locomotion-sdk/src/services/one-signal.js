import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import Config from 'react-native-config';
import network from './network';
import AppSettings from './app-settings';

const notificationsHandlers = {

};

class NotificationsService {
  constructor() {
    this.network = network;
  }

  init = () => {
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
    };

    OneSignal.addEventListener('received', this.triggerOnNotification);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onAnyEvent);
    OneSignal.init(Config.ONESIGNAL_APP_ID, { kOSSettingsKeyAutoPrompt: true });
    OneSignal.requestPermissions(permissions);
    OneSignal.inFocusDisplaying(2);
    OneSignal.setSubscription(true);
  }

  onAnyEvent = async (data) => {
    console.log('onAnyEvent', data);
    const { userProfile } = await AppSettings.getSettings();
    if (userProfile.pushUserId !== data.userId || userProfile.pushToken !== data.pushToken) {
      this.registerOnServer({
        pushToken: data.pushToken,
        pushUserId: data.userId,
      });
    }
  }

  onOpened = (openResult) => {
    if (!openResult.notification.payload || !openResult.notification.payload.notificationId) {
      console.error('Recive notification without notificationId', openResult);
      return;
    }
    const method = notificationsHandlers[openResult.notification.payload.notificationId];
    if (method) {
      method();
    }
  }

  triggerOnNotification = (payload) => {
    console.log('new notification', payload);
  }

  registerOnServer = async ({ pushUserId, pushToken }) => {
    const pushUserData = {
      pushUserId,
      pushToken,
      deviceType: Platform.OS,
    };

    const response = await network.patch('api/v1/me', pushUserData);
    console.log(response.data);
  };

  getOneSignalId = () => new Promise(resolve => OneSignal.getPermissionSubscriptionState(({ userId }) => resolve(userId)));
}

export default new NotificationsService();
