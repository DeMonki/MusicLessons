<template>
<div>

<div v-if="lessons.length>0" >
    <ul>
<b-row   v-for="lesson in lessons" :key="lesson.LessonId"  > 
    <b-col> 
    {{ lesson.StudentName }} 
    </b-col>
    <b-col>
        {{ lesson.LessonTime }}
    </b-col>
    <b-col>
        {{ lesson.LessonDate  }}
    </b-col>
      </b-row>
      </ul>
</div>

</div>
</template>

<script>
export default {
    props: ["lessons"],
    data() {
        return {
            thing: 'thing'
        }
    }
    
}
</script>