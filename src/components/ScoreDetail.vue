<template>
    <v-card 
        outlined
        @keyup="showBrut()"
    >
        <!-- scoreDetail{{this.$store.state.scoreDetail.auto}} -->
        <v-card-title class="headline justify-center">
                Score d'éfficacité énergétique
                <span class="display-3" :style="{'margin-top': '10px',padding: '0 7px 0 7px', 'color': 'white', 'background-color': getColor(this.$store.state.scoreDetail.score)}">  {{this.$store.state.scoreDetail.score}}  </span>
        </v-card-title>

        <v-card-text>
            <div>
                <div class="title">
                    <Pedal/>
                    <span>Anticipation et freinage: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.anticipation)}">{{roundNumber(this.$store.state.scoreDetail.anticipation)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Roue libre: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.coasting)}">{{roundNumber(this.$store.state.scoreDetail.brutData.coasting)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.coasting)}}% distance</span><br>
                    <span>- Freinage: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.braking)}">{{roundNumber(this.$store.state.scoreDetail.brutData.braking)}}</span>
                    <span class="brutDataDisplay">
                        {{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.ratioFreinage)}}
                        - freinage: 
                        {{parseInt(this.$store.state.scoreDetail.brutVolvoConnect.freinage)}}
                         arret: 
                        {{parseInt(this.$store.state.scoreDetail.brutVolvoConnect.arret)}}
                    </span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Engine/>
                    <span>Moteur et boite de vitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.engine)}">{{roundNumber(this.$store.state.scoreDetail.engine)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Mode automatique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.i_shift_a)}">{{roundNumber(this.$store.state.scoreDetail.brutData.i_shift_a)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.auto)}}% temps</span><br>
                    <span>- Mode manuel: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.i_shift_m)}">{{roundNumber(this.$store.state.scoreDetail.brutData.i_shift_m)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.manual)}}% temps</span><br>
                    <span>- Mode puissance: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.i_shift_p)}">{{roundNumber(this.$store.state.scoreDetail.brutData.i_shift_p)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.power)}}% temps</span><br>
                    <span>- Rapport supérieur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.topgear)}">{{roundNumber(this.$store.state.scoreDetail.brutData.topgear)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.topGear)}}% distance</span><br>
                    <span>- En mode économique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.inEco)}">{{roundNumber(this.$store.state.scoreDetail.brutData.inEco)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.inEco)}}% carburant</span><br>
                    <span>- Au-delà du mode économique: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.outEco)}">{{roundNumber(this.$store.state.scoreDetail.brutData.outEco)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.outEco)}}% carburant</span><br>
                    <span>- Surrégime moteur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.overrev)}">{{roundNumber(this.$store.state.scoreDetail.brutData.overrev)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.overrev)}}% temps</span><br>
                    <span>- Charge moteur: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.engineload)}">{{roundNumber(this.$store.state.scoreDetail.brutData.engineload)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.engineload)}}% distance</span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Speed/>
                    <span>Adaptation de la vitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.speed)}">{{roundNumber(this.$store.state.scoreDetail.speed)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Survitesse: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.overspeed)}">{{roundNumber(this.$store.state.scoreDetail.brutData.overspeed)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.overspeed)}}% carburant</span><br>
                    <span>- Régulateur d'allure: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.cruise)}">{{roundNumber(this.$store.state.scoreDetail.brutData.cruise)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.cruise)}}% distance</span>
                </div>
            </div>
            <div>
                <div class="title">
                    <Truck/>
                    <span>A l'arrêt: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.idle)}">{{roundNumber(this.$store.state.scoreDetail.idle)}}</span>
                </div>
                <div class="icon_margin">
                    <span>- Ralenti: </span>
                    <span :style="{'color': getColor(this.$store.state.scoreDetail.brutData.idling)}">{{roundNumber(this.$store.state.scoreDetail.brutData.idling)}}</span>
                    <span class="brutDataDisplay">{{roundNumber(this.$store.state.scoreDetail.brutVolvoConnect.idling)}}% temps</span><br>
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

.brutDataDisplay {

    float: right;
    display: none;
}
</style>