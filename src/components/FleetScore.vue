<template>
<div>
    <div :style="{width: '100%', 'background-color': getColor(65)}">
        <v-container bg fill-height grid-list-md text-xs-center>
            <v-layout row wrap align-center>
                <v-flex class="display-4" :style="{ 'color': 'white'}">
                    65
                </v-flex>
            </v-layout>
        </v-container>
    </div>
    <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center>
            <v-flex class="display-3">
                    <Pedal/> Anticipation et freinage 
                    <span :style="{'color': getColor(65)}">65</span><br>
                    <Engine/> Moteur et boite de vitesse 
                    <span :style="{'color': getColor(65)}">65</span><br>
                    <Speed/> Adaptation de la vitesse 
                    <span :style="{'color': getColor(65)}">65</span><br>
                    <Truck/> A l'arrêt 
                    <span :style="{'color': getColor(65)}">65</span>
            </v-flex>
        </v-layout>
    </v-container>
    
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
    }
}
</script>