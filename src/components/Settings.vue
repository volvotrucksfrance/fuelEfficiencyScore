<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeDialog">
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Paramètre</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click="setDefault">Paramètres par défaut</v-btn>
                <v-btn dark flat @click="saveConfig">Enregistrer</v-btn>
            </v-toolbar-items>
        </v-toolbar>

    <v-expansion-panels accordion>
        <v-expansion-panel
            expand
            focusable
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                        <div>
                            <v-text-field
                                v-model="state.config.anticipation_and_braking.group_weight"
                                label="Anticipation et freinage"
                                class="field_settings"
                                @input="totalVerif()"
                                :error="anticipation_and_braking_error"
                            ></v-text-field>
                        </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-text-field
                        v-model="state.config.anticipation_and_braking.coasting"
                        label="Roue libre"
                        @input="verifAnticipation()"
                        class="field_settings"
                    ></v-text-field>
                    <v-text-field
                        v-model="state.config.anticipation_and_braking.braking"
                        label="Freinage"
                        @input="verifAnticipation()"
                        class="field_settings"
                    ></v-text-field>

                    <v-layout justify-center class="headline" :class="anticipation_and_braking_color">
                            Sous-total: {{this.anticipation_and_braking}}
                    </v-layout>

                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
            expand
            focusable
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div>
                        <v-text-field
                            v-model="state.config.engine_and_gear_utilisation.group_weight"
                            label="Moteur et boite de vitesse"
                            class="field_settings"
                            @input="totalVerif()"
                            :error="engine_and_gear_utilisation_error"
                        ></v-text-field>
                    </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-container class="field_settings">
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_auto"
                                label="Mode automatique"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_manuel"
                                label="Mode manuel"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_power"
                                label="Mode de puissance"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.top_gear"
                                label="Rapport supérieur"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.withing_eco"
                                label="En mode économique"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.out_eco"
                                label="Au-delà du mode économique"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.overrev"
                                label="Overrev"
                                @input="verifEngine()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.engine_load"
                                label="Surcharge moteur"
                                @input="verifEngine()"
                            ></v-text-field>

                    </v-container>

                    <v-layout justify-center class="headline" :class="engine_and_gear_utilisation_color">
                            Sous-total: {{this.engine_and_gear_utilisation}}
                    </v-layout>

                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
            expand
            focusable
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                        <div>
                            <v-text-field
                                v-model="state.config.speed_adaption.group_weight"
                                label="Adaptation de vitesse"
                                class="field_settings"
                                :error="speed_adaption_error"
                                @input="totalVerif()"
                            ></v-text-field>
                        </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-text-field
                        v-model="state.config.speed_adaption.fleet_overspeed"
                        label="Survitesse"
                        class="field_settings"
                        @input="verifSpeed()"
                    ></v-text-field>
                    <v-text-field
                        v-model="state.config.speed_adaption.cruise_control"
                        label="Régulateur de vitesse"
                        class="field_settings"
                        @input="verifSpeed()"
                    ></v-text-field>

                    <v-layout justify-center class="headline" :class="speed_adaption_color">
                            Sous-total: {{this.speed_adaption}}
                    </v-layout>

                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
            expand
            focusable
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                        <div>
                            <v-text-field
                                v-model="state.config.stand_still.group_weight"
                                label="A l'arrêt"
                                class="field_settings"
                                @input="totalVerif()"
                                :error="stand_still_error"
                            ></v-text-field>
                        </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-text-field
                        v-model="state.config.stand_still.idling"
                        label="Ralenti"
                        class="field_settings"
                        @input="verifStill()"
                    ></v-text-field>

                </v-card>

                <v-layout justify-center class="headline" :class="stand_still_color">
                        Sous-total: {{this.stand_still}}
                </v-layout>

            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>

        <v-footer fixed>
            <v-layout justify-center class="display-1" :class="error_total_style">
                    Total : {{this.total_sum}}
            </v-layout>
        </v-footer>

    </v-card>
</template>


<script>


//TODO DESIGN SETTINGS

export default {
    methods: {

        resetState() {
            this.total_sum = 100;
            this.error_total_style = '',

            this.anticipation_and_braking = 100;
            this.anticipation_and_braking_color = '';
            this.anticipation_and_braking_error = false;

            this.engine_and_gear_utilisation = 100;
            this.engine_and_gear_utilisation_color = '';
            this.engine_and_gear_utilisation_error = false;

            this.speed_adaption = 100;
            this.speed_adaption_color = '';
            this.speed_adaption_error = false;

            this.stand_still = 100;
            this.stand_still_color = '';
            this.stand_still_error = false;
        },
        roundValue(e) {

            return Math.round(e * 1000) / 1000;
        },
        totalVerif() {

            this.total_sum = Number(this.state.config.anticipation_and_braking.group_weight)
                + Number(this.state.config.engine_and_gear_utilisation.group_weight)
                + Number(this.state.config.speed_adaption.group_weight)
                + Number(this.state.config.stand_still.group_weight);

            if(this.total_sum != 100) {

                this.error_total_style =  "red--text";
            } else {

                this.error_total_style =  "";
            }
        },

        closeDialog() {

            this.resetState();
            this.$store.commit('setConfig', JSON.parse(this.saveState));
            this.$store.commit('setDialog', false);
        },
        saveConfig() {
            
            this.resetState();
            localStorage.setItem('config', JSON.stringify(this.state.config));
            this.$store.commit('setDialog', false);
        },
        verifAnticipation(a) {

            this.anticipation_and_braking = 
                Number(this.state.config.anticipation_and_braking.coasting)
                + Number(this.state.config.anticipation_and_braking.braking);

            if(this.anticipation_and_braking != 100) {

                this.anticipation_and_braking_color = 'red--text';
                this.anticipation_and_braking_error = true;
            } else {

                this.anticipation_and_braking_color = '';
                this.anticipation_and_braking_error =  false;
            }
        },

        verifEngine() {

            this.engine_and_gear_utilisation = 
                Number(this.state.config.engine_and_gear_utilisation.i_shift_auto)
                + Number(this.state.config.engine_and_gear_utilisation.i_shift_power)
                + Number(this.state.config.engine_and_gear_utilisation.i_shift_manuel)
                + Number(this.state.config.engine_and_gear_utilisation.top_gear)
                + Number(this.state.config.engine_and_gear_utilisation.withing_eco)

                + Number(this.state.config.engine_and_gear_utilisation.out_eco)
                + Number(this.state.config.engine_and_gear_utilisation.overrev)
                + Number(this.state.config.engine_and_gear_utilisation.engine_load);


            this.engine_and_gear_utilisation = this.roundValue(this.engine_and_gear_utilisation);

            if(this.engine_and_gear_utilisation != 100) {

                this.engine_and_gear_utilisation_color = 'red--text';
                this.engine_and_gear_utilisation_error = true;
            } else {

                this.engine_and_gear_utilisation_color = '';
                this.engine_and_gear_utilisation_error =  false;
            }
        },

        verifSpeed() {

            this.speed_adaption = 
                Number(this.state.config.speed_adaption.fleet_overspeed)
                + Number(this.state.config.speed_adaption.cruise_control);

            if(this.speed_adaption != 100) {

                this.speed_adaption_color = 'red--text';
                this.speed_adaption_error = true;
            } else {

                this.speed_adaption_color = '';
                this.speed_adaption_error =  false;
            }
        },

        verifStill() {

            this.stand_still = Number(this.state.config.stand_still.idling);

            if(this.stand_still != 100) {

                this.stand_still_color = 'red--text';
                this.stand_still_error = true;
            } else {

                this.stand_still_color = '';
                this.stand_still_error =  false;
            }
        },

        setDefault() {

            this.$store.commit('defaultConfig');
            this.$store.commit('setDialog', false);
        }
    },
    created() {

        this.state = this.$store.state;
        this.saveState = JSON.stringify(this.$store.state.config);
    },
    data: () => {

        return {
            state: null,
            saveState: null,
            total_sum: 100,
            error_total_style: '',

            anticipation_and_braking: 100,
            anticipation_and_braking_color: '',
            anticipation_and_braking_error: false,

            engine_and_gear_utilisation: 100,
            engine_and_gear_utilisation_color: '',
            engine_and_gear_utilisation_error: false,

            speed_adaption: 100,
            speed_adaption_color: '',
            speed_adaption_error: false,

            stand_still: 100,
            stand_still_color: '',
            stand_still_error: false
        }
    }
};
</script>

<style>

.v-text-field input {

  text-align: center
}

.field_settings {

    width: 50%;
    margin: auto;
}
</style>