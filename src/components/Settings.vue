<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeDialog">
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Paramètre</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click="setDefault">Defaut</v-btn>
                <v-btn dark flat @click="saveConfig">Enregistrer</v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <!-- <v-list three-line subheader>
            <v-expansion-panel>
                <v-expansion-panel-content>

                <template v-slot:header>
                    <div>
                        anticipation_and_braking
                        <v-flex xs1>
                    <v-text-field
                        v-model="state.config.anticipation_and_braking.group_weight"
                        label=""
                    ></v-text-field>
                </v-flex>
                    </div>
                </template>

                <v-list three-line>
                    <v-layout row wrap>

                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs1 ref="inputs">
                            <v-text-field
                                v-model="state.config.anticipation_and_braking.coasting"
                                label="Coasting"
                                @input="verifAnticipation()"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.anticipation_and_braking.braking"
                                label="Braking"
                                @input="verifAnticipation()"
                            ></v-text-field>
                            {{this.anticipation_and_braking}}
                            {{anticipation_and_braking_error}}
                        </v-flex>
                    </v-layout>

                </v-list>

                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-content>

                <template v-slot:header>
                    <div>
                        engine_and_gear_utilisation
                        <v-flex xs1>
                    <v-text-field
                        v-model="state.config.engine_and_gear_utilisation.group_weight"
                        label=""
                    ></v-text-field>
                </v-flex>
                    </div>
                </template>

                <v-list three-line>
                    <v-layout row wrap>

                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs1 ref="inputs">
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_auto"
                                label="I shift auto"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_manuel"
                                label="I shift manual"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_power"
                                label="I shift power"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.top_gear"
                                label="top gear"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.withing_eco"
                                label="eco"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.out_eco"
                                label="out eco"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.overrev"
                                label="overRev"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.engine_load"
                                label="engine load"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                </v-list>

                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-content>

                <template v-slot:header>
                    <div>
                        speed_adaption
                        <v-flex xs1>
                    <v-text-field
                        v-model="state.config.speed_adaption.group_weight"
                        label=""
                    ></v-text-field>
                </v-flex>
                    </div>
                </template>

                <v-list three-line>
                    <v-layout row wrap>

                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs1 ref="inputs" class="grey lighten-3">
                            <v-text-field
                                v-model="state.config.speed_adaption.fleet_overspeed"
                                label="Fleet overspeed"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.speed_adaption.cruise_control"
                                label="Cruise control"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                </v-list>

                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-content>

                <template v-slot:header>
                    <div>
                        stand_still
                        <v-flex xs1>
                    <v-text-field
                        v-model="state.config.stand_still.group_weight"
                        label=""
                    ></v-text-field>
                </v-flex>
                    </div>
                </template>

                <v-list three-line>
                    <v-layout row wrap>

                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs1 ref="inputs">
                            <v-text-field
                                v-model="state.config.stand_still.idling"
                                label="idling"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                </v-list>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-list> -->
        <v-expansion-panel
            expand
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                        <div>
                            <v-text-field
                                v-model="state.config.anticipation_and_braking.group_weight"
                                label="Anticipation et freinage"
                                class="field_settings"
                            ></v-text-field>
                        </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-text-field
                        v-model="state.config.anticipation_and_braking.coasting"
                        label="Coasting"
                        @input="verifAnticipation()"
                        class="field_settings"
                    ></v-text-field>
                    <v-text-field
                        v-model="state.config.anticipation_and_braking.braking"
                        label="Braking"
                        @input="verifAnticipation()"
                        class="field_settings"
                    ></v-text-field>
                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
            expand
        >
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div>
                        <v-text-field
                            v-model="state.config.engine_and_gear_utilisation.group_weight"
                            label="Moteur et boite de vitesse"
                            class="field_settings"
                        ></v-text-field>
                    </div>
                </template>

                <v-card class="grey lighten-3">

                    <v-container class="field_settings">
                        <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_auto"
                                label="I shift auto"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_manuel"
                                label="I shift manual"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.i_shift_power"
                                label="I shift power"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.top_gear"
                                label="top gear"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.withing_eco"
                                label="eco"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.out_eco"
                                label="out eco"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.overrev"
                                label="overRev"
                            ></v-text-field>
                            <v-text-field
                                v-model="state.config.engine_and_gear_utilisation.engine_load"
                                label="engine load"
                            ></v-text-field>
                    </v-container>
                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>

        

    </v-card>
</template>


<script>


//TODO DESIGN SETTINGS

export default {
    methods: {
        closeDialog() {

            this.$store.commit('setConfig', this.state.config);
            this.$store.commit('setDialog', false);
        },
        saveConfig() {

            //TODO CHECK DECENT VALUE
            localStorage.setItem('config', JSON.stringify(this.state.config));
            this.$store.commit('setDialog', false);
        },
        verifAnticipation(a) {

            this.anticipation_and_braking = 
                Number(this.state.config.anticipation_and_braking.coasting)
                + Number(this.state.config.anticipation_and_braking.braking);

            if(this.anticipation_and_braking != 100) {

                this.anticipation_and_braking_error = 'Erreur';
            } else {

                this.anticipation_and_braking_error = '';
            }
        },
        setDefault() {

            this.$store.commit('defaultConfig');
            this.$store.commit('setDialog', false);
        }
    },
    created() {

        this.state = this.$store.state;
    },
    data: () => {

        return {
            state: null,
            anticipation_and_braking: 100,
            anticipation_and_braking_error: '',
            panel: [false, true, true]
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