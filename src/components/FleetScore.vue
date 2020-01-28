<template>
<div v-if="isSet">
    <div :style="{width: '100%', 'background-color': getColor(this.score)}">
        <v-container bg fill-height grid-list-md text-xs-center>
            <v-layout row wrap align-center>
                <v-flex :style="{ 'color': 'white'}">
                    <div class="headline">
                        Score total<br>
                    </div>
                    <div class="display-4">{{this.score}}</div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
    <!-- <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center> -->
        <div :style="{width: '100%'}">
            <div class="headline" :style="{'width': '33%', margin: '0 auto'}">
                <div class="space_text">
                    <Pedal /> Anticipation et freinage 
                    <span :style="{'float': 'right', 'color': getColor(this.anticipation)}">{{this.anticipation}}</span><br>
                </div>
                <div class="space_text">
                    <Engine /> Moteur et boite de vitesse 
                    <span :style="{'float': 'right', 'color': getColor(this.engine)}">{{this.engine}}</span><br>
                </div>
                <div class="space_text">
                    <Speed /> Adaptation de la vitesse 
                    <span :style="{'float': 'right', 'color': getColor(this.speed)}">{{this.speed}}</span><br>
                </div>
                <div class="space_text">
                    <Truck /> A l'arrêt 
                    <span :style="{'float': 'right', 'color': getColor(this.idle)}">{{this.idle}}</span>
                </div>
            </div>
        </div>
        <!-- </v-layout>
    </v-container> -->
    
</div>
</template>

<script>

import Pedal from '../img_component/Pedal.vue';
import Engine from '../img_component/Engine.vue';
import Speed from '../img_component/Speed.vue';
import Truck from '../img_component/Truck.vue';

export default {
    components: {
        Pedal,
        Engine,
        Speed,
        Truck,
    },
    data: () => {

        return {
            anticipation: '',
            engine: '',
            idle: '',
            score: '',
            speed: '',
            isSet: false
        }
    },
    props: {

        fleetScore: Object
    },
    methods: {
        getColor(perc) {
            perc = Number(perc);

            if(perc <= 59) {

                return "#BB0B0B";//rouge
            } else if(perc <= 79) {

                return "#FFCC00";//yellow
            } else if(perc <= 100) {

                return "#32CD32";//green
            }
        }
    },
    watch: {
        fleetScore: {

            handler(data) {

                this.anticipation = data.anticipation;
                this.engine = data.engine;
                this.idle = data.idle;
                this.score = data.score;
                this.speed = data.speed;
                this.isSet = true;
            }
        }
    }
}
</script>

<style scoped>
.space_text {

    margin-bottom: 15px;
}
</style>