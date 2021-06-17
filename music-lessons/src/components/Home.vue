<template>
    <div class="text-center container  p-5" >
<h1> Music Lesson Helper  </h1>
 <b-button class="m-2" @click="toggleRegister"  variant="outline-primary">Sign up</b-button> 
 
 <b-button class="m-2" @click="toggleLogin"  variant="outline-primary">Login</b-button>

<div v-if=login class="rounded" >
    <form  class="mt-3 p-3" >
        <b-row class="mb-1">
         <b-col sm="3">
         <label  :for="userName">User Name:</label> 
         </b-col>
         <b-col sm="6"> 
         <b-form-input autofocus v-model="userName" placeholder="User Name"></b-form-input>
         </b-col>
     </b-row>
     <b-row class="mb-1">
         <b-col sm="3">
         <label   :for="password">Password:</label> 
         </b-col>
         <b-col sm="6"> 
              <b-form-input autocomplete="off"  v-model="password" :type=ptype placeholder="Password"></b-form-input>
         </b-col>
     </b-row>
     <b-row v-if=loginFailed > <p style="color:red" > Login Failed   </p></b-row>
           <b-button @click.prevent="logIntoAccount"  variant="primary">Login</b-button>
    </form>
</div>
<div v-if=signup class="rounded" >
 <form  class="mt-3 p-3" >
     <b-row class="mb-1">
         <b-col sm="3">
         <label :for="firstName">First Name:</label> 
         </b-col>
         <b-col sm="6"> 
         <b-form-input ref="fName" v-model="firstName" placeholder="First Name"></b-form-input>
         </b-col>
     </b-row>
     <b-row class="mb-1">
         <b-col sm="3">
         <label :for="lastName">Last Name:</label> 
         </b-col>
         <b-col sm="6"> 
    <b-form-input v-model="lastName" placeholder="Last Name"></b-form-input>
         </b-col>
     </b-row>
      <b-row class="mb-1">
         <b-col sm="3">
         <label   :for="userName">User Name:</label> 
         </b-col>
         <b-col sm="6"> 
         <b-form-input v-model="userName" placeholder="User Name"></b-form-input>
         </b-col>
         <p v-if=userNameIsTaken class="m-1"  style="color: red"> Username is taken - please pick another </p>
     </b-row>
     <b-row class="mb-1">
         <b-col sm="3">
         <label   :for="studioName">Studio Name:</label> 
         </b-col>
         <b-col sm="6"> 
    <b-form-input v-model="studioName" placeholder="Studio Name"></b-form-input>
         </b-col>
     </b-row >
      <b-row class="mb-1">
         <b-col sm="3">
         <label   :for="email">Email:</label> 
         </b-col>
         <b-col sm="6"> 
    <b-form-input  autocomplete="off"  v-model="email" :type=etype placeholder="Email"></b-form-input>
         </b-col>
     </b-row>
      <b-row class="mb-1">
         <b-col sm="3">
         <label   :for="password">Password:</label> 
         </b-col>
         <b-col sm="6"> 
              <b-form-input autocomplete="off"  v-model="password" :type=ptype placeholder="Password"></b-form-input>
         </b-col>
     </b-row>
      <b-button @click.prevent="register"  variant="primary">Submit/Register</b-button>

  </form>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
//import _ from 'lodash';

export default{
    props: {
        name: String
    },
    data() {
        return {
            answer: '',
            signup: false,
            login: false,
            firstName: '',
            lastName: '',
            userName: '',
            studioName: '',
            email: '',
            password: '',
            ptype: 'password',
            etype: 'email',
            ans: '',
            user: '',
            loginFailed: false
        }
    },
    methods: {
        ...mapActions([]),
        expensiveOp(userName) {
            var self = this;
            
            axios.post('http://localhost:3000/checkIfUserNameExists', {
                UserName : userName,
            }).then(response => {
            self.ans = response.data.results.recordset[0][""];
            self.ans ==1 ? self.UserNameTakenFn() : self.UserNameNotTakenFn()           
            });
          //  self.ans ==1 ? "setUserNameIsTaken(true)" : "setUserNameIsTaken(true)"           
    },
        toggleRegister() {
            this.clearFields();
            this.login = false
            this.signup = !this.signup
        },
        toggleLogin() {
            this.clearFields();
            this.signup = false
            this.login = !this.login
        },
        clearFields() {
            this.firstName = '',
            this.lastName = '',
            this.userName = '',
            this.studioName = '',
            this.email = '',
            this.password = ""
        },
        register() {
            if(this.userNameIsTaken || this.firstName.length <2 || this.password.length < 4 || this.lastName.length<2 ){
                alert('please fill out all fields - password requires 4 characters');
                this.userName = '';
                this.firstName = '';
                this.lastName = '';
                this.password = '';
                this.studioName = '';
                this.email = '';
                this.UserNameNotTakenFn();
                return
            }
            axios.post('http://localhost:3000/addInstructor', {
                FirstName: this.firstName,
                LastName: this.lastName,
                StudioName: this.studioName, 
                UserName: this.userName, 
                Email: this.email,
                Password: this.password
            }).then(response => {
                console.log(response)
                const n = response.data.user
                const jwttoken = response.data.accessToken;
                localStorage.setItem("token",  jwttoken)
                this.$store.dispatch('setInstructorName', n)
                 this.$router.push({name: 'TeacherHome'}).catch(() => {})
            }).catch(err => console.log(err));             
        },
        logIntoAccount() {
           if(this.userName.length<4 || this.password.length < 4 ){
               alert('username and passwords are at least 4 characters')
               return
           }
           axios.post('http://localhost:3000/login', {
               UserName: this.userName,
               Password: this.password
           }).then(response => {
                console.log(response)
                const n = response.data.user
                const jwttoken = response.data.accessToken;
                if(jwttoken){
                localStorage.setItem("token",  jwttoken)
                this.$store.dispatch('setInstructorName', n)
                 this.$router.push({name: 'TeacherHome'}).catch(() => {})
                 }else{
                     console.log('login failed');
                     this.loginFailed = true;
                     this.password = '';
                     setTimeout(() => {this.loginFailed = false}, 4000);
                     return
                 }
            }).catch(err => console.log(err));
             this.UserNameNotTakenFn();
        },
        UserNameTakenFn() {
            this.$store.dispatch("setUserNameIsTaken", true)
        },
        UserNameNotTakenFn() {
            this.$store.dispatch("setUserNameIsTaken", false)
        }
    },
    computed: mapState( ["userNameIsTaken", "instructorName"]),
    watch: {  
        userName: function (userName) {
            this.expensiveOp(userName)
        }
    }
}
</script>

<style scoped>
.rounded {
    border: 3px solid forestgreen;
    border-radius: 15px;
    background: rgba(76, 175, 80, 0.3);
    margin: 5%;
}
</style>
