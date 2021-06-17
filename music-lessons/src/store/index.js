import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoggedIn: true,
        user: '',
        instructorName: sessionStorage.getItem('instructorName'),
        instructorId: sessionStorage.getItem('instructorName'),
        FirstName: sessionStorage.getItem('FirstName'),
        LastName: sessionStorage.getItem('LastName'),
        StudentId: sessionStorage.getItem('StudentId'),
        userNameIsTaken: false
    },
    getters: {
        state: (state) => {
            return {...state}
        }
    },
    mutations: {
        SET_USER: (state, payload) => {
            state.user = payload;
        },
        setStudent (state, s) {
            console.log("hit second", s)

            state.FirstName = s.FirstName,
            sessionStorage.setItem('FirstName',s.FirstName)
            state.LastName =s.LastName,
            sessionStorage.setItem('LastName',s.LastName)
            state.StudentId = s.StudentId
            sessionStorage.setItem('StudentId',s.StudentId)

            
        },
        setInstructorName (state, instructorName) {
            state.instructorName = instructorName
            sessionStorage.setItem('instructorName',instructorName)

        },
        logoutInstructor (state) {
            state.instructorName = ''

        },
        setUserNameIsTaken(state, payload) {
            state.userNameIsTaken = payload
        }
    },
    actions: {
        SET_USER: (context, payload) => {
            context.commit("SET_USER", payload);
        },
       async setUserNameIsTaken ({commit}, boolValue) {
           console.log('hit async')
            return Promise.resolve(commit('setUserNameIsTaken', boolValue))
        },
        async setInstructorName({commit}, name) {
            return Promise.resolve(commit('setInstructorName', name))
        },
        setStudent({commit}, s ){
            console.log("hit first")
            console.log(s)
            commit('setStudent', s)
        },
        logoutInstructor({commit}) {
            commit('logoutInstructor')
        }
    }
})