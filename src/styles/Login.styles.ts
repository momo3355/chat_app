// styles/Login.styles.ts
import { StyleSheet } from 'react-native';

// Purple Theme Colors
export const Colors = {
  primaryPurple: '#8B5CF6',
  darkPurple: '#7C3AED',
  lightPurple: '#A78BFA',
  white: '#FFFFFF',
  placeholderText: 'rgba(255, 255, 255, 0.6)',
  inputBorder: 'rgba(255, 255, 255, 0.3)',
  disabledButton: 'rgba(255, 255, 255, 0.4)',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryPurple,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 48,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.white,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.disabledButton,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryPurple,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  signUpLink: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
