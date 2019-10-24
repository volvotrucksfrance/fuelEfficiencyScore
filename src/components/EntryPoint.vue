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
                                label="Mot de passe"
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
            <v-toolbar fixed flat color="white">
                <v-toolbar-title></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn flat v-on="on" class="showDialog" @click="logout">
                        Se déconnecter
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-content style="margin-top: 50px;">
            <v-container bg grid-list-md text-xs-center>
                <v-layout row wrap align-center>
                    <v-flex xs6 lg6>
                        <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        full-width
                        max-width="400"
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
                        max-width="400"
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
            <v-toolbar fixed flat color="white">
            <v-btn icon color="dark" @click="goToListDrivers">
              <v-icon>arrow_back</v-icon>
            </v-btn>

            <v-toolbar-title>Score fuel efficiency {{this.convertFrenchFormat(this.$store.state.startTime)}} - {{this.convertFrenchFormat(this.$store.state.stopTime)}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Recherche"
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
                    :items="trucksScore"
                    :search="search"
                    :pagination.sync="pagination"
                    :loading="loadingTrucks"
                    :no-data-text="this.$store.state.pourcentage"
                    rows-per-page-text="Lignes par page"
                >
                <template v-slot:items="props">
                    <tr @click="showScoreDetail(props.item.brutData)" >
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right title" :style="{'color': getColor(props.item.score)}">{{ props.item.score }}</td>
                        <td class="text-xs-right title" :style="{'color': getColor(props.item.anticipation)}">{{ props.item.anticipation }}</td>
                        <td class="text-xs-right title" :style="{'color': getColor(props.item.engine)}">{{ props.item.engine }}</td>
                        <td class="text-xs-right title" :style="{'color': getColor(props.item.speed)}">{{ props.item.speed }}</td>
                        <td class="text-xs-right title" :style="{'color': getColor(props.item.idle)}">{{ props.item.idle }}</td>
                    </tr>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="warning">
                        Aucun résultat.
                    </v-alert>
                </template>

                <template slot="pageText" slot-scope="item">
                    Element de {{item.pageStart}} - {{item.pageStop}}, sur {{item.itemsLength}}
                </template>
                </v-data-table>
            </v-container>
        </div>
        </transition>
        <!-- END SHOW SCORE -->


    </div>
    <v-dialog v-model="dialog_score" max-width="400" >
        <ScoreDetail />
    </v-dialog>
    </v-app>
</template>

<script>

import FetchData from '../class/FetchData.js';
import FuelEfficiencyScore from '../class/FuelEfficiencyScore.js';
import MergeData from '../class/MergeData.js';

import ScoreDetail from './ScoreDetail.vue';
import Settings from './Settings.vue';
import moment from 'moment';
import format from 'date-fns/format';
import { setTimeout } from 'timers';
moment.locale('fr');

const DATE_FORMAT = "DD/MM/YYYY";

export default {
    name: "EntryPoint",
    components: {
        Settings,
        ScoreDetail
    },
    data() {

        return {
            dialog_score: false,
            loadText: this.$store.state.pourcentage,
            loadingTrucks: true,
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
                sortBy: 'score',
                rowsPerPage: -1,
                descending: true
            },
            selected: [],
            headers: [
                {
                    text: 'Nom',
                    align: 'left',
                    value: 'name',
                    width: "1%"
                },
                { text: 'Score', value: 'score' },
                { text: 'Anticipation et freinage', value: 'anticipation' },
                { text: 'Moteur et boite de vitesse', value: 'engine' },
                { text: 'Adaptation de vitesse', value: 'speed' },
                { text: 'Ralenti', value: 'idle' }
            ],
            trucksScore: [

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
        showScoreDetail(data) {

            console.log(data);
            this.$store.commit('setScoreDetail', data);
            this.dialog_score = true;
        }, 
        convertFrenchFormat(date) {

            const myDate = moment(date, 'YYYY-MM-DD');
            return myDate.format('DD/MM/YYYY');
        },
        getColor(perc) {

            if(perc <= 59) {

                return "#BB0B0B";//rouge
            } else if(perc <= 79) {

                return "#FFCC00";//yellow
            } else if(perc <= 100) {

                return "#32CD32";//green
            }
        },

        logout() {

            this.showDate = false;
            this.showLogin = true;
        },
        
        async fetchDrivers() {

            this.dataFetcher = new FetchData(this.login, this.password);
            let tmpDrivers = await this.dataFetcher.getDrivers();

            return tmpDrivers;
        },

        async tryCredentials() {

            this.isLogging = true;
            this.showLogin = await this.fetchDrivers();

            this.saveCredentials();
        },

        saveCredentials() {

            this.isLogging = false;
            if(this.showLogin) {

                localStorage.setItem('login', this.login);
                localStorage.setItem('password', this.password);

                //User is logged so show list driverData
                this.showDate = true;
                this.showLogin = false;
            } else {

                this.$notify({
                    group: 'notif',
                    title: 'Message',
                    text: 'Erreur login/mot de passe',
                    type: 'warning'
                });
                this.showLogin = true;
            }
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
                    text: 'La date de debut doit etre antérieur à la date de fin'
                });
            } else if(this.dateDebut == null || this.dateFin == null) {

                return this.$notify({
                    group: 'notif',
                    title: 'Message',
                    text: 'Veuillez selectionner une date de debut et de fin'
                });
            } else {

                this.trucksScore = [];
                this.loadingTrucks = true;
                //this.loadText = this.$store.state.pourcentage;
                this.$store.commit('setStartDate', this.dateDebut);
                this.$store.commit('setStopDate', this.dateFin);
                this.showDate = false;
                this.showScores = true;  
                this.allData = await this.dataFetcher.getVehiclesData(this.dateDebut, this.dateFin, this.$store, this);
                const myMergeData = new MergeData();
                myMergeData.byTrucks(this.allData);
                this.saveFetchedData = myMergeData.getFormatedData(myMergeData.getDataTrucks());
                var tabTrucksScore = [];
                for(var i in this.saveFetchedData) {

                    const myScore = new FuelEfficiencyScore(this.saveFetchedData[i], this.$store.state.config);
                    
                    var truckScore = myScore.getScore();
                    if(!isNaN(truckScore.score)) {

                        truckScore.brutData = this.saveFetchedData[i];
                        truckScore.brutData.score = truckScore;
                        truckScore.name = this.saveFetchedData[i].vin;
                        tabTrucksScore.push(truckScore);
                    }
                    
                }

                this.loadingTrucks = false;
                this.trucksScore = tabTrucksScore;
                this.loadText = "Pas de données"
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
            var tabTrucksScore = [];
            for(var i in this.saveFetchedData) {

                const myScore = new FuelEfficiencyScore(this.saveFetchedData[i], this.$store.state.config);
                
                var truckScore = myScore.getScore();
                if(!isNaN(truckScore.score)) {

                    truckScore.brutData = this.saveFetchedData[i];
                    truckScore.brutData.score = truckScore;
                    truckScore.name = this.saveFetchedData[i].vin;
                    tabTrucksScore.push(truckScore);
                }
                
            }
            this.trucksScore = tabTrucksScore;
        }
    }
}

</script>

<style scoped>
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