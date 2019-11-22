<template>
    <v-data-table
        :headers="headers"
        :items="colls"
        sort-by="name"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>
                    <v-icon>mdi-file-document-box-multiple</v-icon>
                    Collections
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
                            <v-icon left>mdi-file-document-box-plus</v-icon>
                            <span>Create Collection</span>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">New Collection</span>
                        </v-card-title>
                        <v-divider class="my-4"></v-divider>
                        <v-card-text>
                            <v-form v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-text-field
                                            v-model.trim="newItem.name" 
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
                            </v-form>
                        </v-card-text>
                        <v-divider class="my-4"></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Create Collection</v-btn>
                        </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
            <v-btn block text @click="openCollection(item.name)">{{ item.name }}</v-btn>
        </template>
        <template v-slot:item.avgObjSize="{ item }">
            {{ item.avgObjSize ? convertValues(item.avgObjSize) : '-' }}
        </template>
        <template v-slot:item.totalObjSize="{ item }">
            {{ convertValues(item.totalObjSize) }}
        </template>
        <template v-slot:item.totalIndexSize="{ item }">
            {{ convertValues(item.totalIndexSize) }}
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon small @click="deleteItem(item)" title="Delete">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
</template>
<script>
import { LOAD_COLLECTIONS, DROP_COLLECTION, CREATE_COLLECTION } from '@/mutationTypes'
import preloadDataByRoute from '@/helpers/preloadDataByRoute'
export default {
    name: 'collections',
    data: () => ({
        dialog: false,
        headers: [
            { text: 'Collection Name', align: 'left', value: 'name'},
            { text: 'Documents', align: 'center', value: 'documents'},
            { text: 'Avg. Document Size', align: 'center', value: 'avgObjSize' },
            { text: 'Total Document Size', align: 'center', value: 'totalObjSize' },
            { text: 'Num. Indexes', align: 'center', value: 'nindexes' },
            { text: 'Total Index Size', align: 'center', value: 'totalIndexSize' },
            { text: '', align: 'center', value: 'action', sortable: false }
        ],
        colls: [],
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
            name: '',
            capped: false,
            size: 0,
            max: 0
        },
        defaultItem: {
            name: '',
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
        openCollection(collname) {
            const { database } = this.$route.params
            this.$router.push(`/databases/${database}/${collname}`)
        },
        initialize() {
            const colls = this.$store.getters.colls
            if (colls.length) {
                return this.colls = colls
            }
            this.$store.dispatch(LOAD_COLLECTIONS, {
                cacheKey: this.$route.fullPath,
                dbName: this.$route.params.database
            })
            .then(colls => {
                this.colls = colls
            })
        },
        deleteItem(item) {
            if (confirm(`Are you sure you want to delete "${item.name}" collection?`)) {
                this.$store.dispatch(DROP_COLLECTION, {
                    dbname: this.$route.params.database,
                    coll: item
                })
                .then(status => {
                    if (status) this.initialize()
                    else alert('The collection has not been removed')
                })
            } 
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.newItem = { ...this.defaultItem }   //   Object.assign({}, this.defaultItem)
            }, 300)
        },
        save() {
            this.$store.dispatch(CREATE_COLLECTION, {
                dbname: this.$route.params.database, 
                coll: this.newItem
            })
            .then(() => {
                this.initialize()
            })
            this.close()
        },
        convertValues(size) {
            return size > 1024 ? (size / 1024).toFixed(1) + ' kB' : size.toFixed(1) + ' B'
        }
    },
    beforeRouteLeave(to, from, next) {
        preloadDataByRoute(to)
        .then(() => {
            next()
        })
    },
}
</script>