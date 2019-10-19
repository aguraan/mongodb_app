<template>
    <v-data-table
        :headers="headers"
        :items="databases"
        sort-by="storageSize"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>
                    <v-icon>mdi-database</v-icon>
                    Databases
                </v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">
                            <v-icon left>mdi-database-plus</v-icon>
                            <span>Create Database</span>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-form v-model="valid">
                            <v-card-title>
                                <span class="headline">New Database</span>
                            </v-card-title>
                            <v-divider class="my-4"></v-divider>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field 
                                            v-model.trim="newItem.dbname" 
                                            :rules="nameRules" 
                                            label="Database name" 
                                            required>
                                            </v-text-field>
                                            <v-text-field 
                                            v-model.trim="newItem.colname" 
                                            :rules="nameRules" 
                                            label="Collection name"
                                            required>
                                            </v-text-field>
                                            <v-switch v-model="newItem.capped" class="ma-4" label="Capped Collection"></v-switch>
                                            <v-expand-transition>
                                                <v-row v-show="newItem.capped">
                                                    <v-col cols="6">
                                                        <v-text-field 
                                                        v-model.number="newItem.size" 
                                                        :rules="newItem.capped ? sizeRulesRequired : sizeRules" 
                                                        label="Size" 
                                                        :required="newItem.capped">
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <v-text-field 
                                                        v-model.number="newItem.max" 
                                                        :rules="maxRules" 
                                                        label="Max">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-expand-transition>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-divider class="my-4"></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="success" text @click="save" :disabled="!valid">Create Database</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.db="{ item }">
            <v-btn block text @click="openDatabase(item.db)">{{ item.db }}</v-btn>
        </template>
        <template v-slot:item.storageSize="{ item }">
            {{ convertValues(item.storageSize) }}
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon small @click="deleteItem(item)" title="Delete">
                mdi-database-remove
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
</template>
<script>
import { LOAD_COLLECTIONS, DROP_DATABASE, CREATE_DATABASE } from '@/mutationTypes'
export default {
    name: 'databases',
    data: () => ({
        dialog: false,
        headers: [
            { text: 'Database Name', align: 'left', value: 'db'},
            { text: 'Storage Size', align: 'center', value: 'storageSize'},
            { text: 'Collections', align: 'center', value: 'collections' },
            { text: 'Indexes', align: 'center', value: 'indexes' },
            { text: '', align: 'center', value: 'action', sortable: false }
        ],
        databases: [],
        valid: false,
        nameRules: [
            v => !!v || '"Name" is required'
        ],
        sizeRulesRequired: [
            v => !!v || '"Size" is required',
            v => Number.isInteger(+v) || '"Size" must be a integer'
        ],
        sizeRules: [
            v => Number.isInteger(+v) || '"Size" must be a integer'
        ],
        maxRules: [
            v => Number.isInteger(+v) || '"Max" must be a integer'
        ],
        newItem: {
            dbname: '',
            colname: '',
            capped: false,
            size: 0,
            max: 0
        },
        defaultItem: {
            dbname: '',
            colname: '',
            capped: false,
            size: 0,
            max: 0
        },
    }),
    watch: {
        dialog(val) {
        val || this.close()
        },
    },
    created() {
        this.initialize()
    },
    methods: {
        openDatabase(name) {
            this.$store.dispatch(LOAD_COLLECTIONS, name)
            .then(() => {
                this.$router.push(`/databases/${name}`)
            })
        },
        initialize() {
            this.databases = this.$store.getters.databases
        },
        deleteItem(item) {
            confirm(`Are you sure you want to delete "${item.db}" database?`) && this.$store.dispatch(DROP_DATABASE, item)
            .then(() => {
                this.initialize()
            })
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.newItem = Object.assign({}, this.defaultItem)
            }, 300)
        },
        save() {
            this.$store.dispatch(CREATE_DATABASE, this.newItem)
            .then(() => {
                this.initialize()
            })
            this.close()
        },
        convertValues(size) {
            return size > 1024 ? (size / 1024).toFixed(1) + ' kB' : size.toFixed(1) + ' B'
        }
    },
}
</script>