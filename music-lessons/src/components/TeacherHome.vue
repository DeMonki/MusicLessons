<template>
 <div id="inst-portal">
     <div class="mt-3"  >
     <b-button @click="logout" variant="dark" style="position: absolute !important; right: 25px !important; top: 35px !important;"   > Logout </b-button>
     </div>

          <h1>Instructor's Portal</h1>
          <h2>Instructor: {{ instructorName }} </h2>
          <hr>
      <div>
          <b-button v-if="!displayStudentForm"  @click="displayStudentForm = !displayStudentForm"  
          variant="info" class="m-3" >Add New Student</b-button>
                    <b-button v-else  @click="displayStudentForm = !displayStudentForm"  
          variant="danger" class="m-3" > Hide New Student Form </b-button>

          <b-button v-if="students.length===0" @click.prevent="getStudents"  variant="info" class="m-3" > Get Student Roster</b-button>  
          <b-button v-else @click.prevent="hideStudents"  variant="danger" class="m-3" > Hide Student Roster</b-button> 

          <b-button v-if="lessons.length===0" @click.prevent="getLessons" variant="info" class="m-3"> View Lessons </b-button> 
          <b-button v-else @click.prevent="hideLessons" variant="danger" class="m-3" > Hide Lessons </b-button>
          <p style="color:red"  v-if=InstWithNoStudents > Instructor has no registered Students  </p> 
          <p style="color:red"  v-if=InstWithNoLessons > Instructor has no registered Lessons  </p> 

      </div>
<div v-if=displayStudentForm class="rounded" >
 <form  class="mt-3 p-3" >
     <label for="add student form">Add Student</label>
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
         <label   :for="password">Password:</label> 
         </b-col>
         <b-col sm="6"> 
              <b-form-input autocomplete="off"  v-model="password" :type=ptype placeholder="Password"></b-form-input>
         </b-col>
     </b-row>
      <b-button @click.prevent="registerNewStudent"  variant="primary">Add Student</b-button>
  </form>
 
  </div>
   <b-row ><p style="color:red"  v-if=addedStudentToaster> Successfully added Student to {{instructorName}}'s roster!!  </p>
              </b-row> 
      <TeacherStudentView :students="students"  />
      <TeacherLessons :lessons="lessons"   />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'
import TeacherStudentView from './TeacherStudentView.vue'
import TeacherLessons from './TeacherLessons.vue'
import authHeader from '../helpers/auth-header'
export default {
    components: {
        TeacherStudentView,
        TeacherLessons
    },
    data() {
        return {
            students: [],
            lessons: [],
            loading: false,
            studentForm: false,
            displayStudentForm: false,
            displayingStudentRoster: false,
            InstWithNoStudents: false,
            InstWithNoLessons: false,
            addedStudentToaster: false,
            firstName: '',
            lastName: '',
            password: '',
            ptype: 'password',
            date: ''
        }
    },
    methods: {
            getStudents() {
                let instId = this.instructorName
                console.log("ID: ", instId)
            axios.get('http://localhost:3000/getStudents', {
                params: {
                    instructorName: instId
                },
                headers:  authHeader()
            })
            .then(results => {
                console.log(results);
                this.students = results.data.results.recordset
                if(this.students.length===0) {
                this.InstWithNoStudents = true
                    setTimeout(() => {
                        this.InstWithNoStudents = false
                    }, 4000);
                }
            }).catch(error => {
                if(error){
                this.$router.push({name: 'Home'}).catch(() => {})
                }
            })
        },
        logout() {
            localStorage.removeItem("token")
                this.$store.dispatch('logoutInstructor')
                 this.$router.push({name: 'Home'}).catch(() => {})
        },
        hideStudents() {
            this.students = [];
        },
        hideLessons() {
            this.lessons = [];
        },
        getLessons() {
                let instId = this.instructorName
                console.log("ID: ", instId)
            axios.get('http://localhost:3000/getLessons', {
                params: {
                    instructorName: instId
                },
                headers:  authHeader()
            })
            .then(results => {
                console.log("results: : : :", results);
                this.lessons = results.data.results.recordset
                if(this.lessons.length===0) {
                this.InstWithNoLessons = true
                    setTimeout(() => {
                        this.InstWithNoLessons = false
                    }, 4000);
                }
            }).catch(error => {
                if(error){
                this.$router.push({name: 'Home'}).catch(() => {})
                }
            })
        },
        registerNewStudent() {
            axios.post('http://localhost:3000/registerNewStudent', 
                {FirstName: this.firstName,
                LastName: this.lastName,
                Password: this.password,
                InstructorName: this.instructorName,
            },{
            headers: authHeader()
            }).then(response => {
                
                if(response.status ===200 ){
                console.log("response.status :::::::  ", response.status);
                this.addedStudentToaster = true;
                console.log(this.addedStudentToaster);
                setTimeout(() => {
                    this.addedStudentToaster = false
                }, 4000);
            } 
                if(this.students.length>0) {
               this.getStudents();
            }

            }).catch(err => console.log(err));
            this.firstName = '';
            this.lastName = '';
            this.password = '';
            this.displayStudentForm = false;
        }
    },
    computed: mapState( {instructorName: "instructorName"})
}
</script>

<style scoped>

#inst-portal {
    text-align: center;
}
    ul {
        list-style: none;
        text-align: left;
    }
</style>