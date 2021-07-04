<template>
    <div id="main">
        <div class="home-link" >
            <b-row class="text-align-center p-2" >
            <b-col class="text-align-center" >
                        <h4 style="margin-bottom:.75rem" >Student:  <span >    {{ StudentFirstName}}   {{ StudentLastName}} (Id: {{StudentId}}  )  </span></h4>
            </b-col>
            <b-col class="text-align-center" >
        <router-link   style="text-decoration:none;font-size: 1.5em; color:black;" 
        :to="{name: 'TeacherHome'}"> <span style="background: #ffffb3;padding:1.2rem;margin:1.3em;  border: 2px solid black; border-radius:10px"
        > {{instructorName}}'s  Home page </span> </router-link></b-col>
        </b-row>
        </div>
        <hr>

        <div class="container">
        <b-button @click="displayLessonForm = !displayLessonForm"  
          variant="info" class="m-2 " >{{ this.displayLessonForm?  'Cancel Schedule Lesson' :'Schedule Lesson'  }}</b-button>

 <b-button v-if="this.lessons.length===0" @click.prevent="getLessons(StudentId)" variant="info" class="m-2"> View {{ StudentFirstName}}'s Lessons </b-button> 
          <b-button v-else @click.prevent="hideLessons" variant="danger" class="m-2" > Hide Lessons </b-button>
          <p style="color:red"  v-if=StudentWithNoLessons > Student has no registered Lessons  </p> 

</div>
          <div v-if="this.lessons.length>0" class="lesson-form" >
<ul>
  
         <b-row class="align-items-center"  v-for="lesson in lessons" :key="lesson.LessonId" >

                   
                  <b-col v-b-hover="handleHover" :key="lesson.LessonId" > <b-icon v-if="isHovered"  icon="calendar-date" scale="1.5"  ></b-icon> 
                        <b-icon v-else  icon="calendar-date"  ></b-icon>  {{lesson.LessonDate  }}</b-col>
                  
                  <b-col> <b-icon icon="clock"></b-icon>  {{lesson.LessonTime  }}</b-col>
                  <b-col> <b-icon icon="bell" ></b-icon> {{lesson.LessonDuration  }} min </b-col>
                  <b-col><b-button class="mb-2" >Adjust </b-button></b-col>
                  <b-col><b-button class="mb-2" >Delete </b-button></b-col>
                  <hr>
              </b-row>

          </ul>
          </div>
         

        <div v-if="displayLessonForm" class="lesson-form">
            <b-form @submit="onSubmit">
                <b-row class="fluid">
                    <label for="StudentFirstName"> Student Name</label>
<h4> {{StudentFirstName}} {{ StudentLastName }}  </h4>
                    <b-col sm="auto" >
                        <div>
                            <h4>lesson duration:</h4>
                         <b-form-radio-group
                            v-model="form.selected"
                            :options="form.options"
                            class="mb-2"
                            value-field="item"
                            text-field="name"
                            disabled-field="notEnabled"
                            inline
                            ></b-form-radio-group>
                            <div class="mt-3">Selected: <strong>{{ form.selected }}</strong></div>
                        </div>
                    </b-col>

                    <b-col sm="auto" >
                         <label for="example-datepicker">Choose a date</label>
                        <b-form-datepicker id="example-datepicker" v-model="form.value" class="mb-2"></b-form-datepicker>
                    </b-col>

                    <b-col sm="auto">
                         <b-time v-model="form.timeValue" show-seconds locale="en">
                            <div class="d-flex" dir="ltr">
                            <b-button
                            class="m-2"
                                size="sm"
                                variant="outline-danger"
                                v-if="form.timeValue"
                                @click="clearTime"
                            >
                                Clear time
                            </b-button>
                            <b-button
                                size="sm"
                                variant="outline-primary"
                                class="m-2"
                                @click="setNow"
                            >
                                Set Now
                            </b-button>
                            </div>
                        </b-time>
                    </b-col>
                </b-row>
      <b-button class="m-2" type="submit" variant="primary">Submit</b-button>
      <b-button class="m-2" type="reset" variant="danger">Reset</b-button>
            </b-form>

</div>
    
    </div>
</template>


<script>

import axios from 'axios'
import { mapState } from 'vuex'
import authHeader from '../helpers/auth-header'
export default {
    data() {
        return {
            isHovered: false,
            displayLessonForm: false,
            lessons: [],
            StudentWithNoLessons: false,
            form: {
                StudentFirstName: '',
                timeValue: '',
                value: '',
                selected: 0, // Must be an array reference!
                options: [
                    { item: 30, name: '30' },
                    { item: 45, name: '45' },
                    { item: 60, name: '60' }        
                    ]
            }
        }
    },
    methods: {
        handleHover(hovered) {
            this.isHovered = hovered;
        },
        onSubmit(event) {
            event.preventDefault();
            axios.post('http://localhost:3000/newLesson',
            {
                selected :this.form.selected,
                LessonTime: this.form.timeValue,
                LessonDate: this.form.value,
                StudentId: sessionStorage.getItem('StudentId'),
                instructorUserName: sessionStorage.getItem('instructorName')
            },{
                headers: authHeader()
            }
            ).then(response => console.log(response)).catch(error => console.log(error));
             this.form.selected = '30 minutes',
            this.form.timeValue = '',
            this.form.value = '',
            this.displayLessonForm = false
          //  console.log(this.form, this.StudentFirstName, this.StudentLastName)
        },
        getLessons(StudentId) {
            console.log("Student ID: ", StudentId);
            axios.get('http://localhost:3000/lessonsByStudentId', {
                params: {
                     StudentId
                },
                headers:  authHeader()
            })
            .then(results => {
                console.log("results: : : :", results);
                this.lessons = results.data.results[0];
                if(this.lessons.length===0) {
                this.StudentWithNoLessons = true
                    setTimeout(() => {
                        this.StudentWithNoLessons = false
                    }, 4000);
                }
            }).catch(error => {
                if(error){
                console.log(error)
                }
            })

            // axios.post('http://localhost:3000/lessonsByStudentId',
            // {

            // })
        },
        hideLessons() {
            this.lessons = [];
        },
        onReset(event) {
            event.preventDefault()
            this.form.selected = '30 minutes',
            this.form.timeValue = '',
            this.form.value = '',
            this.displayLessonForm = true
        },
        setNow() {
        const now = new Date()
        // Grab the HH:mm:ss part of the time string
        this.form.timeValue = now.toTimeString().slice(0, 8)
      },
      clearTime() {
        this.form.timeValue = ''
      }
    },
    computed: mapState({instructorName: "instructorName", StudentFirstName: "FirstName"  , StudentLastName: "LastName"  , StudentId: "StudentId" })
}
</script>


<style scoped>

#main {
    width: 100%;
    height: 100vh;
    padding-top: 60px;
}

.home-link {
    text-align: center;
}

.lesson-form {
    font-size: 1rem;
    padding: 1.5rem;
    background-color:aliceblue;
    border: 2px solid burlywood;
    border-radius: 10px;
}
</style>