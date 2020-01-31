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

                <v-container fill-height>
                    <v-layout row wrap align-center>
                        <v-flex class="text-xs-center red--text">
                            {{this.errorLogin}}
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
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <template v-slot:activator="{ on }">
                        <v-btn flat v-on="on" class="showDialog">
                            Paramètre
                        </v-btn>
                    </template>
                    <Settings/>
                </v-dialog>
                </v-toolbar-items>
                <v-toolbar-items>
                    <v-btn flat v-on="on" class="showDialog" @click="logout">
                        Se déconnecter
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-content style="margin-top: 50px;">
            <v-container bg grid-list-md text-xs-center>
                <v-layout row wrap align-center>
                    <v-flex xs12 lg12>
                        <p>{{msgDate}}</p>
                    </v-flex>
                    
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
                                    label="Date de début"
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
                        <v-row>
                            <p class="red--text">{{this.errorDate}}</p>
                        </v-row>
                        <v-row>
                            <v-btn 
                                color="success"
                                @click="getScore"
                                outline
                                large
                                fab
                            >
                                GO
                            </v-btn>
                        </v-row>
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

                <v-toolbar-title>Score d'éfficacité énergétique {{this.convertFrenchFormat(this.$store.state.startTime)}} - {{this.convertFrenchFormat(this.$store.state.stopTime)}}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-toolbar-items>
                    <v-btn flat @click="print" class="showDialog" v-if="isLoaded">
                        Exporter en PDF
                    </v-btn>
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

            <FleetScore class="toolbar_margin" :fleetScore="this.fleetScore"/>

            <div :style="{'max-width':'1000px', 'margin': '0 auto'}">
                <v-tabs
                    grow
                    id="tabScore"
                    ref="tabScore"
                >
                    <v-tabs-slider color="black"></v-tabs-slider>

                    <v-tab
                        href="#tab-1"
                    >
                        CONDUCTEUR
                    </v-tab>

                    <v-tab
                        href="#tab-2"
                    >
                        CAMION
                    </v-tab>

                    <v-tab-item
                        value="tab-1"
                    >
                        <div>
                            <TabData name="Nom" :tabData="this.driverScore"/>
                        </div>
                    </v-tab-item>

                    <v-tab-item
                        value="tab-2"
                    >
                        <TabData name="VIN" :tabData="this.trucksScore"/>
                    </v-tab-item>

                </v-tabs>
            </div>
        </div>
        </transition>
        <!-- END SHOW SCORE -->
    </div>
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

import TabData from './TabData';
import FleetScore from './FleetScore.vue';


//TODO DELETE
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ipc = require('electron').ipcRenderer;

export default {
    name: "EntryPoint",
    components: {
        Settings,
        ScoreDetail,
        TabData,
        FleetScore
    },
    data() {

        return {
            isLoaded: false,
            errorLogin: '',
            msgDate: '',
            userData: null,
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
                    text: 'VIN',
                    align: 'left',
                    value: 'name',
                    width: "1%"
                },
                { text: 'Score', value: 'score', width: "1" },
                { text: 'Anticipation et freinage', value: 'anticipation', width: "1" },
                { text: 'Moteur et boite de vitesse', value: 'engine', width: "1" },
                { text: 'Adaptation de vitesse', value: 'speed', width: "1" },
                { text: 'Ralenti', value: 'idle', width: "1" }
            ],
            trucksScore: [

            ],
            driverScore: [

            ],
            fleetScore: null,
            search: "",
            timeoutTest: null,
            saveFetchedData: [],
            brutTrucksScore: [],
            brutDriversScore: [],
            errorDate: ''
        }
    },
    async created() {

        this.login = localStorage.getItem('login') || "";
        this.password = localStorage.getItem('password')  || "";
    },

    methods: {
        convertFrenchFormat(date) {

            const myDate = moment(date, 'YYYY-MM-DD');
            return myDate.format('DD/MM/YYYY');
        },

        logout() {

            this.dateDebut = '';
            this.dateFin = '';
            this.errorDate = '';
            this.showDate = false;
            this.showLogin = true;
        },
        
        async loginGaido() {

            try {

                this.dataFetcher = new FetchData(this.login, this.password);
                let tmpDrivers = await this.dataFetcher.loginToGaido();

                this.msgDate = `Données disponibles entre le ${new Date(tmpDrivers.oldRecord).toLocaleDateString('fr-FR')} et le ${new Date().toLocaleDateString('fr-FR')}`;
                this.userData = tmpDrivers;
                return tmpDrivers;
            } catch(err) {

            }
            
        },

        async tryCredentials() {

            this.isLogging = true;
            this.showLogin = await this.loginGaido();

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

                this.errorLogin = 'Erreur login/mot de passe';
                this.showLogin = true;
            }
        },

        getDriverNameById(id) {

            for(var i in this.driverData) {

                if(this.driverData[i].tachoDriverIdentification.cardIssuingMemberState + this.driverData[i].tachoDriverIdentification.driverIdentification == id) {

                    return this.driverData[i].firstName + ' ' + this.driverData[i].lastName;
                }
            }

            return id.substring(1);
        },

        computedDateFormattedMomentjs(tmpDate) {

            return tmpDate ? moment(tmpDate).format(DATE_FORMAT) : ''
        },

        async getScore() {

            this.dataFetcher = new FetchData(this.login, this.password);

            if(this.dateDebut > this.dateFin) {

                return this.errorDate = 'La date de début doit etre antérieur à la date de fin';

            } else if(this.dateDebut == null || this.dateFin == null) {

                return this.errorDate = 'Veuillez selectionner une date de début et de fin';

            } else {
                
                let mostOldRecord = this.userData.oldRecord;
                let mostRecentRecord = this.userData.recentRecord;
                var isDebutToday = moment(this.dateDebut).isSame(new Date(), "day");
                var isFinToday = moment(this.dateFin).isSame(new Date(), "day");
                if(!isDebutToday && !isFinToday) {
                    //on check les 2 dates dans la bonne range
                    if(!moment(this.dateDebut).isBetween(mostOldRecord, mostRecentRecord, null, '[]') ||
                        !moment(this.dateFin).isBetween(mostOldRecord, mostRecentRecord, null, '[]')) {

                        mostOldRecord = moment(mostOldRecord, 'YYYY-MM-DD');
                        mostOldRecord = moment(mostOldRecord).add(1, 'days');
                        mostOldRecord = this.convertFrenchFormat(mostOldRecord);
                        mostRecentRecord = this.convertFrenchFormat(mostRecentRecord);
                        

                        return this.errorDate = `L'intervalle de date doit etre compris entre le ${mostOldRecord} et le ${mostRecentRecord}`;

                    }
                    
                } else if(!isDebutToday && isFinToday) {
                    //on check si debut dans la range
                    if(!moment(this.dateDebut).isBetween(mostOldRecord, mostRecentRecord, null, '[]')) {

                        mostOldRecord = moment(mostOldRecord, 'YYYY-MM-DD');
                        mostOldRecord = moment(mostOldRecord).add(1, 'days');
                        mostOldRecord = this.convertFrenchFormat(mostOldRecord);
                        mostRecentRecord = this.convertFrenchFormat(mostRecentRecord);

                        return this.errorDate = `L'intervalle de date doit etre compris entre le ${mostOldRecord} et le ${mostRecentRecord}`;
                    }

                }

                this.errorDate = '';

                this.trucksScore = [];
                this.loadingTrucks = true;
                //this.loadText = this.$store.state.pourcentage;
                this.$store.commit('setStartDate', this.dateDebut);
                this.$store.commit('setStopDate', this.dateFin);
                this.showDate = false;
                this.showScores = true; 

                this.brutDriversScore = await this.dataFetcher.getVehiclesDataGaido(this.dateDebut, this.dateFin, this.$store, 'driverID');
                this.brutTrucksScore = await this.dataFetcher.getVehiclesDataGaido(this.dateDebut, this.dateFin, this.$store, 'vin');

                this.driverData = await this.dataFetcher.getDrivers();
                
                this.driverScore = await this.brutDataToArray(this.brutDriversScore, false);
                this.trucksScore = await this.brutDataToArray(this.brutTrucksScore, true);

                this.$emit('update:tabData', this.driverScore);
                this.$emit('update:tabData', this.trucksScore);
                this.isLoaded = true;
            }
        },

        async brutDataToArray(data, isTruck) {

            const myMergeData = new MergeData();
            myMergeData.byTrucks(data);
            this.saveFetchedData = myMergeData.getFormatedData(myMergeData.getDataTrucks());
            var tabData = [];

            for(var i in this.saveFetchedData) {

                const myScore = new FuelEfficiencyScore(this.saveFetchedData[i], this.$store.state.config);
                
                var computedScore = myScore.getScore();
                if(!isNaN(computedScore.score)) {

                    computedScore.brutData = myScore.getFesScore();
                    computedScore.brutVolvoConnect = this.saveFetchedData[i];

                    if(isTruck) {

                        computedScore.name = this.saveFetchedData[i].id;

                    } else {

                        computedScore.name = this.getDriverNameById(this.saveFetchedData[i].id);
                    }

                    tabData.push(computedScore);
                }
            }

            if(isTruck) {

                const fleetData = myMergeData.getDataFleet();
                const formatFleet = myMergeData.convertData('fleet', fleetData);
                const myScore = new FuelEfficiencyScore(formatFleet, this.$store.state.config);
                
                this.fleetScore = myScore.getScore();

                this.$emit('update:fleetScore', this.fleetScore);
            }

            this.loadingTrucks = false;
            return tabData;
        },

        goToListDrivers() {

            window.scrollTo(0, 0);
            this.showScores = false;
            this.showDate = true;
            this.isLoaded = false;
        },
        print() {

            window.setTimeout(() => {

                var element = document.getElementById('tabScore');
                var width = element.width;
                var height = element.height;

                const A4height = 1600;// A4 height
                const A4width = 1000;// A4 height

                var pdf = new jsPDF({
                                orientation: 'p',
                                unit: 'px',
                                format: [A4width, A4height]
                            });

                html2canvas(element).then(canvas => {

                        for (var i = 0; i <= this.$refs.tabScore.$el.clientHeight/A4height; i++) {
                            //! This is all just html2canvas stuff
                            var srcImg  = canvas;
                            var sX      = 0;
                            var sY      = A4height*i; // start A4height pixels down for every new page
                            var sWidth  = A4width;
                            var sHeight = A4height;
                            var dX      = 0;
                            var dY      = 0;
                            var dWidth  = A4width;
                            var dHeight = A4height;

                            window.onePageCanvas = document.createElement("canvas");
                            onePageCanvas.setAttribute('width', A4width);
                            onePageCanvas.setAttribute('height', A4height);
                            var ctx = onePageCanvas.getContext('2d');
                            // details on this usage of this function: 
                            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

                            // document.body.appendChild(canvas);
                            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                            var width         = onePageCanvas.width;
                            var height        = onePageCanvas.clientHeight;

                            //! If we're on anything other than the first page,
                            // add another page
                            if (i > 0) {
                                pdf.addPage(A4width, A4height); //8.5" x 11" in pts (in*72)
                            }
                            //! now we declare that we're working on that page
                            pdf.setPage(i+1);
                            //! now we add content to that page!
                            pdf.addImage(canvasDataURL, 'PNG', 0, 0, (width*.72), (height*.71));

                        }

                    pdf.save(
                        `fes_${this.convertFrenchFormat(this.$store.state.startTime)}_${this.convertFrenchFormat(this.$store.state.stopTime)}`
                    );
                });
            }, 350);
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
        dialog: async function(e) {

            this.driverScore = await this.brutDataToArray(this.brutDriversScore, false);
            this.trucksScore = await this.brutDataToArray(this.brutTrucksScore, true);

            this.$emit('update:tabData', this.driverScore);
            this.$emit('update:tabData', this.trucksScore);
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
    margin-top: 200px;
}
.top_margin {

    margin-top: 20vh;
}
.toolbar_margin {

    padding-top: 65px;
}
</style>