<template>
        <v-expansion-panel
            expand
            focusable
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div class="subtitle-2 text-center">Agnostic RTL Alignment</div>
                </template>
                <span class="display-3" :style="{padding: '0 7px 0 7px', 'color': 'white', 'background-color': getColor(80)}">80</span>
            </v-expansion-panel-content>
        </v-expansion-panel>
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

<style scoped>
.v-expansion-panel__header > .v-expansion-panel__header__icon {
  flex: 1 1 auto !important;
}
</style>