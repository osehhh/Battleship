import React, { useState, useEffect, useRef, setState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../style/style';


const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';
const NBR_OF_COLS = 5;
const NBR_OF_ROWS = 5;
let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
document.title = "Battleship"

export default function Gameboard() {

    const [board, setBoard] = useState(initialBoard);
    const [gameStarted, setGameStarted] = useState(false);
    const [status, setStatus] = useState("Game has not started");
    const [hits, setHits] = useState(0);
    const [bombs, setBombs] = useState(15);
    const [ships, setShips] = useState(3);
    const [counter, setCounter] = useState(30);
    const [buttonName, setButtonName] = useState('Start game');
    const timerRef = useRef();
    const [randomBoat, setRandomBoat] = useState([]);

    
    const items = [];
    for (let x = 0; x < NBR_OF_ROWS; x++) {
        const cols = [];
        for (let y = 0; y < NBR_OF_COLS; y++) {
            cols.push(
                <Pressable
                    key={x * NBR_OF_COLS + y}
                    style={styles.item}
                    onPress={() => drawItem(x * NBR_OF_COLS + y)}>
                    <Entypo
                        key={x * NBR_OF_COLS + y}
                        name={board[x * NBR_OF_COLS + y]}
                        size={32}
                        color={chooseItemColor(x * NBR_OF_COLS + y)} />
                </Pressable>
            );
        }
        let row =
            <View key={"row" + x}>
                {cols.map((item) => item)}
            </View>
        items.push(row);
    }


    function drawItem(number) {

        if (gameStarted && bombs > 0) {

            setBombs(bombs => bombs - 1);

            if (board[number] === START) {
                if (randomBoat.includes(number)) {
                    board[number] = CIRCLE;
                    setHits(hits => hits + 1);
                    setShips(ships => ships - 1);
                }
                else {
                    board[number] = CROSS;
                }
            }
        }
        else {
            setStatus('Click the start button first...')
        }
    }


    useEffect(() => {
        

        if (bombs === 0 && ships > 0) {
            setStatus('Game over. Ships remaining');
            initialize();
        }

        if (counter === 0) {
            initialize();
            setGameStarted(gameStarted => !gameStarted);
            setStatus('Timeout. Ships remaining');

        }
        else if (hits === 3) {
            initialize();
            setStatus('You sinked all ships.');
            setGameStarted(gameStarted => !gameStarted);
        }
    }, [counter])


    function timer() {

        const time =
            setInterval(() => {
                setCounter(counter => counter - 1);
            }, 1000);
        timerRef.current = time;
    }

    function stop() {
        clearInterval(timerRef.current);
    }

    function initialize() {
        stop();
    }


    function randomBoats() {

        for (var i = 0; randomBoat.length; i++) {
            randomBoat.shift();
        }

        for (var i = 0; i < 3; i++) {
            var number = Math.floor(Math.random() * 24) + 0;
            if (randomBoat.includes(number)) {
                i--;
            }
            else {
                randomBoat.push(number);
            }
        }
    }

    function startGame() {
        let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
        setCounter(30);
        setBoard(initialBoard);
        setShips(3);
        setBombs(15);
        setHits(0);
        randomBoats();
        if (gameStarted) {
            stop();
            timer();
        } else {
            setGameStarted(gameStarted => !gameStarted);
            timer();
            setStatus('Game is on...');
            setButtonName('New game');
            setBoard(initialBoard);
        }
    }

    function chooseItemColor(number) {
        if (board[number] === CROSS) {
            return '#FF3031';
        }
        else if (board[number] === CIRCLE) {
            return '#45CE30';
        }
        else {
            return '#74B9FF';
        }
    }

    return (

        <View style={styles.gameboard}>
            <View style={styles.flex}>{items}</View>
            <Pressable style={styles.button} onPress={() => startGame()}>
                <Text style={styles.buttonText}>{buttonName}</Text>
            </Pressable>
            <View>
                <Text style={styles.gameinfo}>Hits: {hits} Bombs: {bombs} Ships: {ships}</Text>
            </View>
            <View>
                <Text style={styles.gameinfo}>Time: {counter} sec</Text>
            </View>
            <View>
                <Text style={styles.gameinfo}>Status: {status}</Text>
            </View>
        </View>

    );

}