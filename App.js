import React from 'react';
import { View } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import Gameboard from './components/Gameboard';
import styles from './style/style';

export default class App extends React.Component {

    render() {
      return (
      <View style={styles.container}>
        <Header />
        <Gameboard />
        <Footer />
      </View>
    );
  }
}