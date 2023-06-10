/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = { primary: '#1f145c', white: '#ffffff' };



const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState();

  React.useEffect(() => {
    console.log('2');
    getTodoFromUserDevice();
  }, []);

  React.useEffect(() => {
    console.log('1');
    saveTodoToUserDevice(todos);
  }, [todos]);

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity style={[styles.actionIcon]} onPress={() => markTodoComplete(todo?.id)}>
            <Icon name='done' size={20} color={COLORS.white}></Icon>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.actionIcon, { backgroundColor: "red" }]} onPress={() => deleteTodo(todo?.id)}>
          <Icon name='delete' size={20} color={COLORS.white}></Icon>
        </TouchableOpacity>
      </View>
    );
  };

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please Input Todo")
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  }

  const markTodoComplete = todoId => {
    const newTodo = todos.map(item => {
      if (item.id == todoId) {
        return { ...item, completed: true }
      }
      return item;

    });
    setTodos(newTodo);
  }

  const deleteTodo = todoId => {
    const newTodo = todos.filter(item => item.id != todoId);
    setTodos(newTodo);
  };

  const clearTodo = () => {
    Alert.alert('confirm', 'Clear Todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      { text: 'No' }
    ]);
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    } catch (e) {
      // displaying error
      console.log(e);
    }
  };

  const getTodoFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>

      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: COLORS.primary }}>
          ToDo App
        </Text>
        <Icon name="trash" size={25} color="red" onPress={clearTodo} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Add Todo" value={textInput} onChangeText={text => setTextInput(text)} />
          </View>
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.iconContainer} >
              <Icon name="add" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    padding: 20,
    flexDirection: 'row',
    color: COLORS.white,
    elevation: 1,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    marginLeft: 5,
    borderRadius: 3,
  }
});

export default App;
