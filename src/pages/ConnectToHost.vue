<template>
        <v-layout justify-center>
            <v-card min-width="600">
                <v-card-title>Connect To Host</v-card-title>
                <v-card-text>
                    <v-layout column>
                        <v-form>
                            <v-text-field v-model="host" required label="Hostname"></v-text-field>
                            <v-text-field v-model="port" required label="Port"></v-text-field>
                            <v-layout justify-end>
                                <v-btn @click="connect" color="success" :disabled="loading || connected">Соединить</v-btn>
                            </v-layout>
                        </v-form>
                    </v-layout>
                </v-card-text> 
            </v-card>
        </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import { UPDATE_HOST, UPDATE_PORT, CONNECT } from '@/mutationTypes'
export default {
    name: 'ConnectToHost',
    data: () => ({
        //
    }),
    computed: {
        host: {
            get() {
                return this.$store.getters.host
            },
            set(val) {
                this.$store.commit(UPDATE_HOST, val)
            }
        },
        port: {
            get() {
                return this.$store.getters.port
            },
            set(val) {
                this.$store.commit(UPDATE_PORT, val)
            }
        },
        ...mapGetters(['loading', 'connected'])
    },
    methods: {
        connect() {
            this.$store.dispatch(CONNECT)
            .then(() => {
                this.$router.push('/databases')
            })
        }
    },
}
</script>