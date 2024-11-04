import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FaUser, FaLock } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth'; // Suponiendo que tienes este hook adaptado para React Native
import { Global } from '../../helpers/Global';

const Login = () => {
    const [form, setForm] = useState({});
    const [loged, setLoged] = useState("not_sended");
    const { setAuth } = useAuth(); // Usa el hook de autenticación adaptado para React Native
    const navigation = useNavigation(); // Usa useNavigation en lugar de useNavigate

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const loginUser = async () => {
        let userToLogin = form;

        try {
            const request = await fetch(`${Global.url}usuario/login`, {
                method: 'POST',
                body: JSON.stringify(userToLogin),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();

            if (data.status === 'success') {
                // Almacena los datos en el dispositivo
                setAuth(data.user);  // Usando el contexto de autenticación

                setLoged('loged');

                // Redirige según el rol del usuario
                if (data.user.rol === 'admin') {
                    navigation.navigate('AdminProfile'); // Redirige a la página de administrador
                } else if (data.user.rol === 'vendedor') {
                    navigation.navigate('VendedorProfile'); // Redirige a la página del vendedor
                } else {
                    navigation.navigate('LandingPage');
                }
            } else {
                setLoged('error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            setLoged('error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            {loged === 'loged' && <Text style={styles.success}>Usuario Identificado Correctamente</Text>}
            {loged === 'error' && <Text style={styles.error}>Usuario no Identificado</Text>}

            <View style={styles.inputGroup}>
                <FaUser style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="eMail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(value) => handleChange('email', value)}
                />
            </View>

            <View style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    onChangeText={(value) => handleChange('password', value)}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('RecoverPass')}>
                <Text style={styles.link}>¿Olvidaste la contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={loginUser}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <Text style={styles.label}>No tienes cuenta todavía?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        paddingVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#2196F3',
        textAlign: 'center',
        marginVertical: 10,
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginVertical: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    label: {
        textAlign: 'center',
        marginTop: 20,
    },
});
