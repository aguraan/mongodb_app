<template>
    <v-data-table
        :items="docs"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>
                    <v-icon>mdi-file-document-box</v-icon>
                    Documents
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
                            <span>Insert Document</span>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Insert Document</span>
                        </v-card-title>
                        <v-divider class="my-4"></v-divider>
                        <v-card-text>

                            <v-simple-table dense>
                                <tbody>
                                <tr>
                                    <td>_id</td>
                                    <td> : </td>
                                    <td>ObjectID("{{ objectId }}")</td>
                                </tr>
                                </tbody>
                            </v-simple-table>    
                            
                        </v-card-text>
                        <v-divider class="my-4"></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="insert" :disabled="!valid">Insert</v-btn>
                        </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item="{item}">
            <tr>
                <v-card v-if="editedIndex === docs.indexOf(item)"  class="ma-3 subtitle-2">
                    <v-container>
                        <v-row>
                            <v-col cols="12" class="py-5 pr-12">
                                <div class="d-flex edit-row-custom" v-for="(prop, i) in editedItem" :key="i">

                                    <div class="numeration mr-6">
                                        <v-icon @click="deleteRow(i)" class="btn" small>mdi-close-circle</v-icon>
                                        <v-icon @click="addRow(i)" class="btn btn-plus" small>mdi-plus</v-icon>
                                        <span class="num">{{i + 1}}</span>
                                    </div>
                                    
                                    <s-edit-dialog
                                    @s-save="edit = true"
                                    @s-cancel="deleteIfEmpty(i)"
                                    :return-value.sync="editedItem[i][0]"
                                    :label="prop[0]"
                                    >
                                       <strong :ref="'prop' + i" class="grey--text text--darken-3">{{ prop[0] }}</strong>
                                    </s-edit-dialog>

                                    <div class="mx-1">:</div>

                                    <s-edit-dialog
                                    @s-save="edit = true"
                                    :return-value.sync="editedItem[i][1]"
                                    :label="prop[1]">
                                        <span :ref="'value' + i" v-if="prop[0] === '_id'" class="orange--text text--darken-3">ObjectID("{{ prop[1] }}")</span>
                                        <span :ref="'value' + i" v-else-if="typeof prop[1] == 'string'" class="blue--text">"{{ prop[1] }}"</span>
                                        <span :ref="'value' + i" v-else class="indigo--text">{{ prop[1] }}</span>
                                    </s-edit-dialog>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions :class="edit && 'warning'">
                        <div class="ml-12 white--text font-italic subtitle-1">Document Modified.</div>
                        <v-spacer></v-spacer>
                        <v-btn :color="btnColors" text small @click="cancel">Cancel</v-btn>
                        <v-btn :color="btnColors" text small @click="update">Update</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-else class="ma-3 subtitle-2">
                    <v-container>
                        <v-row>
                            <v-col cols="10" class="py-5 pr-12">
                                <div class="d-flex" v-for="(value, name, i) in item" :key="i">
                                    <div style="width: 3rem" class="mr-6"></div>
                                    <div><strong class="grey--text text--darken-3">{{ name }}</strong></div>
                                    <div class="mx-1">:</div>
                                    <div v-if="name === '_id'" class="orange--text text--darken-3">ObjectID("{{ value }}")</div>
                                    <div v-else-if="typeof value == 'string'" class="blue--text">"{{ value }}"</div>
                                    <div v-else-if="typeof value == 'number' || typeof value == 'boolean'" class="indigo--text">{{ value }}</div>
                                    <div v-else>{{ value }}</div>
                                </div>
                            </v-col>
                            <v-col cols="2" class="text-right">
                                <v-btn text icon small @click="editItem(item)" title="Редактировать">
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn text icon small @click="deleteItem(item)" title="Удалить">
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </tr>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
</template>
<script>
import { GET_OBJECT_ID, UPDATE_DOCUMENT, DELETE_DOCUMENT } from '@/mutationTypes'
import SEditDialog from '@/components/SEditDialog.vue'
export default {
    name: 'documents',
    components: {
        SEditDialog
    },
    data: () => ({
        dialog: false,
        edit: false,
        docs: [],
        objectId: '',
        valid: false,
        editedIndex: -1,
        editedItem: [],
    }),
    computed: {
        btnColors() {
            return this.edit ? 'white' : 'blue darken-1'
        }
    },
    watch: {
        dialog(val) {
            val || this.close(),
            val && this.generateId()
        },
    },
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            this.docs = this.$store.getters.docs
        },
        generateId() {
            this.$store.dispatch(GET_OBJECT_ID)
            .then(() => {
                this.objectId = this.$store.getters.objectId
            })
        },
        editItem(item) {
            this.editedIndex = this.docs.indexOf(item)
            // this.editedItem = this.objToArr(item)
            this.editedItem = Object.entries(item)
        },
        deleteIfEmpty(i) {
            setTimeout(() => {
                if (this.editedItem[i][0] == null || this.editedItem[i][0] == '') this.deleteRow(i)
            })
        },
        deleteRow(i) {
            setTimeout(() => {
                this.editedItem.splice(i, 1)
                this.edit = true  
            })
        },
        addRow(i) {
            this.editedItem.splice(i + 1, 0, [null, ''])
            setTimeout(() => {
                this.$refs['prop' + (i + 1)][0].click()
                this.edit = true
            })
        },
        cancel() {
            this.editedIndex = -1
            this.edit = false
            setTimeout(() => {
                this.editedItem = []
            }, 300)
        },
        update() {
            // const doc = this.arrToObj(this.editedItem)
            const doc = Object.fromEntries(this.editedItem)
            this.$store.dispatch(UPDATE_DOCUMENT, {
                doc,
                editedIndex: this.editedIndex,
                dbname: this.$route.params.database,
                collname: this.$route.params.collection
            })
            .then(() => {
                this.cancel()
                this.initialize()
            })
        },
        deleteItem(item) {
            if (confirm(`Are you sure you want to delete this document?`)) {
                this.$store.dispatch(DELETE_DOCUMENT, {
                    dbname: this.$route.params.database,
                    collname: this.$route.params.collection,
                    doc: item
                })
                .then(() => {
                    this.initialize()
                })
            }
        },
        insert() {

        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = {}
            }, 300)
        },
        objToArr(obj) {
            const arr = []
            for (let key in obj) {
                arr.push([key, obj[key]])
            }
            return arr
        },
        arrToObj(arr) {
            const obj = {}
            arr.forEach(item => {
                obj[item[0]] = item[1]
            })
            return obj
        }
    },
}
</script>
<style scope>
.edit-row-custom:hover {
    background-color: #FFF3E0;
}
.btn {
    display: none !important;
    cursor: pointer;
}
.btn-plus {
    border: 1px solid grey;
    margin-right: -1px;
    /* margin-left: .5rem; */
}
.num {
    display: inline-block;
}
.edit-row-custom:hover .btn {
    display: inline-block !important;
}
.edit-row-custom:hover .num {
    display: none !important;
}
.numeration {
    width: 3rem;
    font-size: .7rem;
    color: grey;
    text-align: right;
}
</style>