<template>
    <v-card outlined>
        <!-- scoreDetail{{this.$store.state.scoreDetail.auto}} -->
        <v-card-title class="headline">Score d'efficacité énergétique</v-card-title>

        <v-card-text>
          {{roundNumber(this.$store.state.scoreDetail.auto)}}
        </v-card-text>
    </v-card>
</template>


<script>

export default {

    methods: {

        roundNumber(a) {

            return a.toFixed(1);
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

</style>