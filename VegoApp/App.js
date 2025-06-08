import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TabNavigator from './components/TabNavigator';

import { AuthProvider, AuthContext } from './context/AuthContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isFirstLaunch, isLoggedIn, setIsFirstLaunch, setIsLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name="Onboarding">
          {props => (
            <OnboardingScreen
              {...props}
              onComplete={() => setIsFirstLaunch(false)}
            />
          )}
        </Stack.Screen>
      ) : !isLoggedIn ? (
        <>
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                onLogin={() => setIsLoggedIn(true)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signup">
            {props => (
              <SignupScreen
                {...props}
                onLogin={() => setIsLoggedIn(true)}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
