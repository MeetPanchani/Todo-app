import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function AddTodo({ submitHandler, updateItem }) {

    const [text, setText] = useState('');

    const changeHandler = (value) => {
        setText(value.nativeEvent.text)
    }
    const focusHandler = () => {
        setText('')
        console.log(text)
    }
    

    return (
        <View>
            <TextInput 
                style={styles.input}
                placeholder={updateItem.text ? updateItem.text : 'new todo...'}
                onChange={changeHandler}
                onFocus={focusHandler}
                />
            <Button onPress={() => submitHandler(text)} title={updateItem.text ? 'update' : 'add todo'} color='#0313fc' />
        </View>
    )
}   

const styles = StyleSheet.create({
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    }
})