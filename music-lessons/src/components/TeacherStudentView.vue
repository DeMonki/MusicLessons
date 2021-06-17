<template>
<div >
    <div v-if="students.length>0">

        <h2>Student Roster</h2>
        <ul>
              <b-row v-for="student in students" :key="student.StudentId" >
                  <b-col class="m-1 bg-warning btn-sm btn" sm="8">
                      <router-link  @click.native="setStudent(student)"    :to="{ name: 'StudentPage', params: { id: student.StudentId, name: student.FirstName, last: student.LastName } }" >
                      {{ student.FirstName }} {{student.LastName}}  {{ student.StudentId }}
                      </router-link>
                  </b-col>
              </b-row>
              </ul>
      </div>
    </div>
</template>

<script>

export default {

    props: ["students"],
    data() {
        return {
            lesson: ''
        }
    },
    methods: {
        setStudent (student) {
            console.log("work", student)
            this.$store.dispatch('setStudent', student)
        }
    }


}
</script>

