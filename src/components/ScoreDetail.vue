<template>
    <v-card outlined>
        <!-- scoreDetail{{this.$store.state.scoreDetail.auto}} -->
        <v-card-title class="headline">
            <div>
                Score d'efficacité énergétique<br>
                <span class="display-3" :style="{padding: '0 7px 0 7px', 'color': 'white', 'background-color': getColor(this.$store.state.scoreDetail.score.score)}">  {{this.$store.state.scoreDetail.score.score}}  </span>
            </div>
        </v-card-title>

        <v-card-text>
            <div>
                <div class="title">
                    <Pedal/>
                    <span>Anticipation et freinage: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.score.anticipation)}">{{roundNumber(this.$store.state.scoreDetail.score.anticipation)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Roue libre: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.coasting)}">{{roundNumber(this.$store.state.scoreDetail.coasting)}}</span><br>
                    <span>- Freinage: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.braking)}">{{roundNumber(this.$store.state.scoreDetail.braking)}}</span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Engine/>
                    <span>Moteur et boite de vitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.score.engine)}">{{roundNumber(this.$store.state.scoreDetail.score.engine)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Mode automatique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.i_shift_a)}">{{roundNumber(this.$store.state.scoreDetail.i_shift_a)}}</span><br>
                    <span>- Mode manuel: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.i_shift_m)}">{{roundNumber(this.$store.state.scoreDetail.i_shift_m)}}</span><br>
                    <span>- Mode puissance: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.i_shift_p)}">{{roundNumber(this.$store.state.scoreDetail.i_shift_p)}}</span><br>
                    <span>- Rapport supérieur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.topgear)}">{{roundNumber(this.$store.state.scoreDetail.topgear)}}</span><br>
                    <span>- En mode économique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.inEco)}">{{roundNumber(this.$store.state.scoreDetail.inEco)}}</span><br>
                    <span>- Au-delà du mode économique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.outEco)}">{{roundNumber(this.$store.state.scoreDetail.outEco)}}</span><br>
                    <span>- Overrev: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.overrev)}">{{roundNumber(this.$store.state.scoreDetail.overrev)}}</span><br>
                    <span>- Surcharge moteur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.engineload)}">{{roundNumber(this.$store.state.scoreDetail.engineload)}}</span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Speed/>
                    <span>Adaptation de la vitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.score.speed)}">{{roundNumber(this.$store.state.scoreDetail.score.speed)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Survitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.overspeed)}">{{roundNumber(this.$store.state.scoreDetail.overspeed)}}</span><br>
                    <span>- Régulateur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.cruise)}">{{roundNumber(this.$store.state.scoreDetail.cruise)}}</span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Truck/>
                    <span>A l'arrêt: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.score.idle)}">{{roundNumber(this.$store.state.scoreDetail.score.idle)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Ralenti: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.idling)}">{{roundNumber(this.$store.state.scoreDetail.idling)}}</span><br>
                </div>
            </div>
        </v-card-text>
    </v-card>
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
        Truck
    },
    methods: {

        roundNumber(a) {

            return Number(a).toFixed(1);
        },

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
    created() {

        console.log('created scoreDetail', this.$store.state);
    },
    data: () => {

        return {
        }
    }
};
</script>

<style>
.icon_margin {

    margin-top: 10px;
    margin-left: 35px;
}
</style>