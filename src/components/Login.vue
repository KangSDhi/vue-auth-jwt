<template>
    <div>
        EMAIL: <input type="text" v-model="email"> <br/>
        PASSWORD: <input type="password" v-model="password"> <br/>
        <button @click="login">login</button> 
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
        }
    },
    methods: {
        login() {
            let user = {
                email: this.email,
                password: this.password
            };
            axios.post('http://localhost:5000/login', user)
            .then(res => {
                console.log(res);
            })
        }
    }
}
</script>