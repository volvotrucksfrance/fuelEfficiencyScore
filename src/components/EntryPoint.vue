<template>
    <v-app>
    <div class="body_app">
        <notifications group="notif"/>

        <!-- LOGIN -->
        <transition name="fade">
            <v-container v-if="showLogin" class="center_body top_margin">

                <v-container fill-height>
                    <v-layout row wrap align-center>
                        <v-flex class="text-xs-center">
                            <v-text-field
                                v-model="login"
                                label="Login"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-container fill-height>
                    <v-layout row wrap align-center>
                        <v-flex class="text-xs-center">
                            <v-text-field
                                v-model="password"
                                label="Password"
                                type="password"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-container fill-height>
                    <v-layout row wrap align-center>
                        <v-flex class="text-xs-center">
                            <v-btn
                                color="success"
                                v-on:click="tryCredentials"
                                class="login_btn"
                                :loading="isLogging"
                            >
                                Login
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>

            </v-container>
        </transition>
        <!-- END LOGIN -->

        <!-- SHOW DATE -->
        <transition name="fade">
        <div v-if="showDate" class="center_body">
            <v-toolbar fixed flat color="white" app>
                <v-toolbar-title></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn flat v-on="on" class="showDialog" @click="logout">
                        Se déconnecter
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-content>
            <v-container bg grid-list-md text-xs-center>
                <v-layout row wrap align-center>
                    <v-flex xs6 lg6>
                        <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        full-width
                        max-width="290"
                        >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            :value="computedDateFormattedMomentjs(dateDebut)"
                            label="Date de debut"
                            readonly
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="dateDebut"
                            @change="menu1 = false"
                            locale="fr-fr"
                        ></v-date-picker>
                        </v-menu>
                    </v-flex>

                    <v-flex xs6 lg6>
                        <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        full-width
                        max-width="290"
                        >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            :value="computedDateFormattedMomentjs(dateFin)"
                            label="Date de fin"
                            readonly
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="dateFin"
                            @change="menu2 = false"
                            locale="fr-fr"
                        ></v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-container>
                <v-layout row wrap align-center>
                    <v-flex class="text-xs-center">
                        <v-btn 
                            color="success"
                            @click="getScore"
                            outline
                            large
                            fab
                        >
                            GO
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
                
            </v-content>
            </div>
        </transition>
        <!-- END SHOW DATE -->
        
        <!-- SHOW SCORE -->
        <transition name="fade">
        <div v-if="showScores">
            <v-toolbar fixed flat color="white" app>
            <v-btn icon color="dark" @click="goToListDrivers">
              <v-icon>arrow_back</v-icon>
            </v-btn>

            <v-toolbar-title>Score fuel efficiency</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <template v-slot:activator="{ on }">
                        <v-btn flat v-on="on" class="showDialog">
                            Paramètre
                        </v-btn>
                    </template>
                    <Settings/>
                </v-dialog>
            </v-toolbar-items>
          </v-toolbar>
           <v-container>
                <v-card-title>
                <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="driversScores"
                    :search="search"
                    :pagination.sync="pagination"
                >
                <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-right" :style="{'background-color': getColor(props.item.score)}">{{ props.item.score }}</td>
                    <td class="text-xs-right">{{ props.item.anticipation }}</td>
                    <td class="text-xs-right">{{ props.item.engine }}</td>
                    <td class="text-xs-right">{{ props.item.speed }}</td>
                    <td class="text-xs-right">{{ props.item.idle }}</td>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="warning">
                        Aucun résultat.
                    </v-alert>
                </template>
                </v-data-table>
            </v-container>
        </div>
        </transition>
        <!-- END SHOW SCORE -->


    </div>
    </v-app>
</template>

<script>


import FetchDrivers from '../class/FetchDrivers.js';
import FuelEfficiencyScore from '../class/FuelEfficiencyScore.js';
import FetchData from '../class/FetchData.js';
import MergeData from '../class/MergeData.js';

import Settings from './Settings.vue';
import moment from 'moment';
import format from 'date-fns/format';
import { setTimeout } from 'timers';
moment.locale('fr');

const DATE_FORMAT = "DD/MM/YYYY";

export default {
    components: {
        Settings
    },
    data() {

        return {
            showLogin: true,
            showDate: false,
            login: "",
            password: "",
            driverData: null,
            dateDebut: null,
            dateFin: null,
            menu1: false,
            menu2: false,
            vehicleList: null,
            dataFetcher: null,
            isLogging: false,
            showScores: false,
            pagination: {
                sortBy: 'name',
                rowsPerPage: -1
            },
            selected: [],
            headers: [
                {
                    text: 'Nom',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Score', value: 'score' },
                { text: 'Anticipation et freinage', value: 'anticipation_and_braking' },
                { text: 'Moteur et boite de vitesse', value: 'engine_and_gear_utilisation' },
                { text: 'Adaptation de vitesse', value: 'speed_adaption' },
                { text: 'Ralenti', value: 'idle' }
            ],
            driversScores: [

            ],
            search: "",
            timeoutTest: null,
            saveFetchedData: []
        }
    },
    async created() {

        this.login = localStorage.getItem('login') || "";
        this.password = localStorage.getItem('password')  || "";
    },

    methods: {

        getColor(e) {

            return '#7FFF00';
        },

        logout() {

            this.showDate = false;
            this.showLogin = true;
        },
        
        async fetchDrivers() {

            this.dataFetcher = new FetchDrivers(this.login, this.password);
            let tmpDrivers = await this.dataFetcher.getDrivers();

            console.log(tmpDrivers);
            const res = tmpDrivers.length != 0;

            if(res) {

                this.driverData = tmpDrivers;
                this.vehicleList = await this.dataFetcher.getVehicles();

                this.vehicleList = this.vehicleList.data.vehicleResponse;
            }
            
            return !(res);
        },

        async tryCredentials() {

            this.isLogging = true;
            this.showLogin = await this.fetchDrivers();

            this.saveCredentials();
        },

        saveCredentials() {

            if(!this.showLogin) {

                localStorage.setItem('login', this.login);
                localStorage.setItem('password', this.password);

                //User is logged so show list driverData
                this.showDate = true;
            }
            this.isLogging = false;
        },

        getDriverNameById(id) {

            for(var i in this.driverData) {

                if(this.driverData[i].tachoDriverIdentification.driverIdentification.trim() == id.trim()) {

                    return this.driverData[i].firstName + this.driverData[i].lastName;
                }
            }

            return 'Unknown';
        },

        computedDateFormattedMomentjs(tmpDate) {

            return tmpDate ? moment(tmpDate).format(DATE_FORMAT) : ''
        },

        async getScore() {

            if(this.dateDebut > this.dateFin) {

                return this.$notify({
                    group: 'notif',
                    title: 'Message',
                    text: 'Date de debut doit etre antérieur à la date de fin'
                });
            } else if(this.dateDebut == null || this.dateFin == null) {

                return this.$notify({
                    group: 'notif',
                    title: 'Message',
                    text: 'Veuillez selectionner une date de debut et de fin'
                });
            } else {

                this.showDate = false;
                this.showScores = true;
                this.allData = await this.dataFetcher.getVehiclesData(this.dateDebut, this.dateFin);
                const myMergeData = new MergeData();
                myMergeData.byDriver(this.allData);

                this.saveFetchedData = myMergeData.getFormatedData();
                

                this.driversScores = [];
                for(var i in this.saveFetchedData) {

                    let myScore = new FuelEfficiencyScore(this.saveFetchedData[i], this.$store.state.config);
                    
                    let driverScore = myScore.getScore();
                    driverScore.name = this.getDriverNameById(driverScore.name);

                    this.driversScores.push(driverScore);
                }
            }
        },

        goToListDrivers() {

            window.scrollTo(0, 0);
            this.showScores = false;
            this.showDate = true;
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

            window.scrollTo(0, 0);
            this.driversScores = [];
            for(var i in this.saveFetchedData) {
                    
                const myScore = new FuelEfficiencyScore(this.saveFetchedData[i], this.$store.state.config);
                this.driversScores.push(myScore.getScore());
            }
        }
    }
}

</script>

<style>
.body_app {

    width: 100%;
    height: 1000px;
}

.login_btn {

    padding: 0;
    margin: 0;
    width: 100%;
}

.logout_btn {

    float: right;
}

.showDialog {

    float: right;
}

.fade-enter-active, .fade-leave-active {

    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {

    opacity: 0;
}

.center_body {

    margin: auto;
    width: 50%;
    max-width: 600px;
}
.top_margin {

    margin-top: 20vh;
}

</style>