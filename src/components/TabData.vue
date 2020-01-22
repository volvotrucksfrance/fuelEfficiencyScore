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
            :no-data-text="this.$store.state.pourcentage"
            rows-per-page-text="Lignes par page"
        >
            <template v-slot:items="props">
                <tr @click="showScoreDetail(props.item)" >
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
            loadText: this.$store.state.pourcentage,
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

                this.trucksScore = tab;
                this.loadingTrucks = false;
                this.loadText = "Pas de données";
            }
        }
    }
}
</script>