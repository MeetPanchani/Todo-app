import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import Header from './components/header';
import TodoItem from './components/todoItem';
import AddTodo from './components/addTodo';
let flag = 0

export default function App() {
  const [todos, setTodos] = useState([]);
  const [updateItem, setUpdateItem] = useState({})
  const [count, setCount] = useState(1)

  const storeData = () => {
    AsyncStorage.setItem('todo', JSON.stringify(todos));
  };

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('todo');
      if (value !== null) {
        const parseValue = JSON.parse(value)
        const index = Number(parseValue[0].key)
        setTodos(parseValue)
        setCount(index + 1)
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if(flag == 0){
      flag = flag + 1
    } else {
      storeData()
    }
  }, [todos])

  useEffect(() => {
    retrieveData()
  }, [])

  const deleteHandler = (key) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(todo => todo.key != key)
    });
  }

  const submitHandler = (text) => {
    Keyboard.dismiss()
    if(text.length > 3) {
      if(Object.keys(updateItem).length == 0){
        setTodos((prevTodos) => {
          return [
            { text: text, key: count.toString() },
            ...prevTodos
          ]
        })
        setCount((prevCount) => prevCount + 1)
      } else {
        if(text === updateItem.text){
          Alert.alert('OOPS!', 'Entered text must be different', [
            {text: 'Understood', onPress: () => console.log('alert closed')}
          ])
        } else {
          const itemIndex = todos.findIndex(item => item.key == updateItem.key)
          const tempTodos = [...todos]
          tempTodos[itemIndex] = {...tempTodos[itemIndex], text: text}
          setTodos(tempTodos)
          setUpdateItem({})
        }
        
      }
    } else {
       Alert.alert('OOPS!', 'Todos must be over 3 chars long', [
         {text: 'Understood', onPress: () => console.log('alert closed')}
       ])
    }
  }

  const updateHandler = (key) => {
    const newItem = todos.filter(item => item.key == key)[0]
    setUpdateItem(newItem)
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss()
      setUpdateItem({})
      console.log('dismissed keyboard')
    }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <AddTodo submitHandler={submitHandler} updateItem={updateItem}/>
          <View style={styles.list}>
            <FlatList
              data={todos}
              renderItem={({ item }) => (
                <TodoItem item={item} deleteHandler={deleteHandler} updateHandler={updateHandler}/>
              )}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 40,
    flex: 1,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
});
