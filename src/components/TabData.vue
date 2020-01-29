<template>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Recherche"
                single-line
                hide-details
            >
            </v-text-field>
        </v-card-title>
    
        <v-data-table
            :headers="headers"
            :items="trucksScore"
            :search="search"
            :pagination.sync="pagination"
            :loading="loadingTrucks"
            :no-data-text="this.loadText"
            rows-per-page-text="Lignes par page"
        >
            <template v-slot:items="props">
                <tr @click="showScoreDetail(props.item)" >
                    <td>
                        <v-layout justify-center>
                            {{props.item.name}}
                        </v-layout>
                    </td>
                    <td class="text-xs-right title" :style="{'color': getColor(props.item.score)}">
                        <v-layout justify-center>
                            {{props.item.score}}
                        </v-layout>
                    </td>
                    <td class="text-xs-right title" :style="{'color': getColor(props.item.anticipation)}">
                        <v-layout justify-center>
                            {{props.item.anticipation}}
                        </v-layout>
                    </td>
                    <td class="text-xs-right title" :style="{'color': getColor(props.item.engine)}">
                        <v-layout justify-center>
                            {{props.item.engine}}
                        </v-layout>
                    </td>
                    <td class="text-xs-right title" :style="{'color': getColor(props.item.speed)}">
                        <v-layout justify-center>
                            {{props.item.speed}}
                        </v-layout>
                    </td>
                    <td class="text-xs-right title" :style="{'color': getColor(props.item.idle)}">
                        <v-layout justify-center>
                            {{props.item.idle}}
                        </v-layout>
                    </td>
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
        <v-dialog v-model="dialog_score" max-width="400" >
            <ScoreDetail />
        </v-dialog>
    </v-card>
</template>

<script>

import ScoreDetail from './ScoreDetail.vue';

export default {
    components: {
        ScoreDetail
    },
    props: {
        name: String,
        tabData: Array
    },
    created() {

        this.headers[0].text = this.$props.name;
    },
    data() {
        return {
            loadText: "Chargement en cours...",
            search: '',
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
            pagination: {
                sortBy: 'score',
                rowsPerPage: -1,
                descending: true
            },
            loadingTrucks: true,
            dialog_score: false
        }
    },
    methods: {

        getColor(perc) {

            if(perc <= 59) {

                return "#BB0B0B";//rouge
            } else if(perc <= 79) {

                return "#FFCC00";//yellow
            } else if(perc <= 100) {

                return "#32CD32";//green
            }
        },
        showScoreDetail(data) {

            this.$store.commit('setScoreDetail', data);
            this.dialog_score = true;
        }
    },
    watch: {
        tabData: {

            handler(tab) {

                this.trucksScore = [];
                this.loadingTrucks = true;
                this.loadText = "Chargement en cours...";
                window.setTimeout(() => {

                    this.trucksScore = tab;
                    this.loadingTrucks = false;
                    this.loadText = "Pas de données";
                }, 1000);
            }
        }
    }
}
</script>