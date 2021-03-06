import React, { useRef } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import axios from 'axios';

type Props = {
  appId: string;
  appSecret: string;
  redirectUrl: string;
  isVisisble: boolean;
  onCancel: () => void;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  cancelText?: string;
  cancelTextColor?: string;
  cancelButtonBackgroundColor?: string;
};

/**
 * Login with instagram on React Native
 * @param appId app id
 * @param appSecret app secret
 * @param redirectUrl redirect url
 * @param isVisisble whether to show the login or not
 * @param onCancel cancel instgram login
 * @param onSuccess after login success, returns a token
 * @param onError when there is a error during login
 * @param cancelText text to display, default cancel
 * @param cancelTextColor color of the cancel text, default white
 * @param cancelButtonBackgroundColor background color of the cancel button, default redisn
 */
const LoginWithInstagram = ({
  isVisisble,
  appId,
  appSecret,
  redirectUrl,
  onCancel,
  onSuccess,
  onError,
  cancelText,
  cancelTextColor,
  cancelButtonBackgroundColor,
}: Props) => {
  const webView = useRef<any>();

  const scopes = ['user_profile'];
  const instaAuthUrl = `https://api.instagram.com/oauth/authorize/?client_id=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scopes.join(
    ','
  )}`;

  const patchPostMessageJsCode = `(${String(function () {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function (
      message: any,
      targetOrigin: any,
      transfer: any
    ) {
      originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = function () {
      return String(Object.hasOwnProperty).replace(
        'hasOwnProperty',
        'postMessage'
      );
    };
    window.postMessage = patchedPostMessage;
  })})();`;

  const onNavigationStateChange = async (event: WebViewNavigation) => {
    if (event.url.startsWith(redirectUrl)) {
      webView.current.stopLoading();
      const code = event.url.split('code=')[1];
      try {
        let form = new FormData();
        form.append('client_id', appId);
        form.append('client_secret', appSecret);
        form.append('grant_type', 'authorization_code');
        form.append('redirect_uri', redirectUrl);
        form.append('code', code);

        const { data } = await axios.post(
          'https://api.instagram.com/oauth/access_token',
          form,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        onSuccess(data.access_token);
      } catch (error) {
        onError(error.response.data.error_message);
      }
    }
  };

  return (
    <Modal visible={isVisisble} animationType='slide'>
      <SafeAreaView style={{ height: '100%' }}>
        <TouchableOpacity
          style={{
            backgroundColor: cancelButtonBackgroundColor ?? '#FF5733',
            justifyContent: 'center',
            position: 'absolute',
            bottom: '5%',
            zIndex: 1,
            alignSelf: 'center',
            width: 120,
            height: 50,
            borderRadius: 10,
          }}
          onPress={onCancel}
        >
          <Text
            style={{ textAlign: 'center', color: cancelTextColor ?? 'white' }}
          >
            {cancelText ?? 'Cancel'}
          </Text>
        </TouchableOpacity>
        <WebView
          ref={(ref) => (webView.current = ref)}
          source={{
            uri: instaAuthUrl,
            headers: {
              'Accept-Language': 'en',
            },
          }}
          startInLoadingState
          onError={(err) => console.log({ err })}
          onMessage={(msg) => console.log({ msg })}
          onNavigationStateChange={onNavigationStateChange}
          injectedJavaScript={patchPostMessageJsCode}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default LoginWithInstagram;
