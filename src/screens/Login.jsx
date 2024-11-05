import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, StatusBar, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Global } from '../helpers/Global';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import useAuth from '../hooks/useAuth';

export default function Login() {
    const { form, changed } = useForm({});
    const [loged, setLoged] = useState("not_sended");
    const { setAuth } = useAuth();
    const navigation = useNavigation();

    const loginUser = async () => {
        let userToLogin = form;

        try {
            const request = await fetch(Global.url + 'usuario/login', {
                method: 'POST',
                body: JSON.stringify(userToLogin),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();

            if (data.status === 'success') {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('rol', JSON.stringify(data.user.rol));

                setAuth(data.user);
                setLoged('loged');

                if (data.user.rol === 'admin') {
                    navigation.navigate('AdminProfile');
                } else if (data.user.rol === 'vendedor') {
                    navigation.navigate('VendedorProfile');
                } else {
                    navigation.navigate('Landing');
                }
            } else {
                setLoged('error');
                Alert.alert('Error', 'Usuario no Identificado');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setLoged('error');
            Alert.alert('Error', 'Ha ocurrido un error en la solicitud');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ImageBackground
                source={require('../img/FondoLogin.png')}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>
                        <Text style={styles.text}>Log</Text>
                        <Text style={styles.textBold}>In</Text>
                    </Text>

                    {loged === 'loged' && <Text style={styles.success}>Usuario Identificado Correctamente</Text>}
                    {loged === 'error' && <Text style={styles.error}>Usuario no Identificado</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder='Ingrese Correo electrónico'
                        placeholderTextColor="grey"
                        onChangeText={(value) => changed({ target: { name: 'email', value } })}
                        keyboardType='email-address'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Ingrese Contraseña'
                        placeholderTextColor="grey"
                        onChangeText={(value) => changed({ target: { name: 'password', value } })}
                        secureTextEntry
                    />
                    <View style={styles.rememberContainer}>
                        <TouchableOpacity>
                            <Text style={styles.text}>Recuérdame</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('RecoverPass')}>
                            <Text style={styles.text}>Olvidaste la contraseña?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={loginUser}>
                        <Text style={styles.buttonText}>Iniciar Sesion</Text>
                    </TouchableOpacity>
                    <View style={styles.registerContainer}>
                        <Text style={styles.text}>No tienes cuenta todavía?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: '200',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        width: '82%',
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    success: {
        color: 'green',
    },
    error: {
        color: 'red',
    },
    rememberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 12,
    },
    text: {
        color: 'white',
    },
    textBold: {
        fontWeight: '600',
    },
    link: {
        color: 'white',
        fontWeight: 'bold',
    },
});
