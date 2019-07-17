<template>
    <v-app>
        Hello from entry point
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
                <v-btn flat icon color="blue lighten-2" v-on="on" class="showDialog">
                    <v-icon>build</v-icon>
                </v-btn>
            </template>
            <Settings/>
        </v-dialog>
    </v-app>
</template>


<script>

import FuelEfficiencyScore from '../class/FuelEfficiencyScore.js';
import FetchData from '../class/FetchData.js';

import defaultConfig from '../config/defaultConfig.js';

import Settings from './Settings.vue';

export default {
    components: {
        Settings
    },
    created() {
        
        this.init();
    },
    methods: {

        init() {

            const tmpData = new FetchData();
            
            var data = tmpData.getData();

            const myScore = new FuelEfficiencyScore(data, this.$store.state.config);
            myScore.getScore();
        }
    },
    computed: {
        dialog: {
            get () {
                
                return this.$store.state.dialog;
            },
            set (value) {
                this.$store.commit('setDialog', value);
            }
        }
    },
    watch: {
        dialog: function(e) {

            const tmpData = new FetchData();
            
            var data = tmpData.getData();

            const myScore = new FuelEfficiencyScore(data, this.$store.state.config);
            myScore.getScore();
        }
    }
};
</script>
