<template>
    <div class="perm-api">
        <div class="search-term">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="Path">
                <el-input placeholder="path" v-model="searchForm.path" clearable></el-input>
            </el-form-item>
            <el-form-item label="Description">
                <el-input placeholder="description" v-model="searchForm.description" clearable></el-input>
            </el-form-item>
            <el-form-item label="APIGroup">
                <el-input placeholder="apiGroup" v-model="searchForm.apiGroup" clearable></el-input>
            </el-form-item>
            <el-form-item label="Method">
                <el-input placeholder="method" v-model="searchForm.method" clearable ></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="onSubmit" type="primary">Query</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="userInfo.role===2" @click="openDialog('add')" type="primary">Add API</el-button>
            </el-form-item>
        </el-form>
        </div>
<!--        table-->
        <el-table :data="apiData"  border stripe>
            <el-table-column label="ID" prop="id" min-width="60px" sortable></el-table-column>
            <el-table-column label="Path" prop="path" min-width="180px" ></el-table-column>
            <el-table-column label="apiGroup" prop="apiGroup" min-width="100px" ></el-table-column>
            <el-table-column label="Description" prop="description" min-width="200px" ></el-table-column>
            <el-table-column label="Method" prop="method" min-width="80px" ></el-table-column>
            <el-table-column label="Edit" min-width="300px" >
                <template slot-scope="scope">
                    <el-button v-if="userInfo.role===2" @click="editApiGroup(scope.row)" size="small" type="primary" icon="el-icon-edit">Edit</el-button>
                    <el-button v-if="userInfo.role===2" @click="deleteApi(scope.row.id)" size="small" type="danger" icon="el-icon-delete">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

<!--        dialog-->
        <el-dialog :before-close="handleCloseDialog"
                   :title="dialogTitle"
                   :visible.sync="dialogApiVisible"
        >
            <el-form :inline="true" :model="form" :rules="rules" ref="apiForm">
                <el-form-item label="Path" prop="path">
                    <el-input placeholder="path" v-model="form.path" clearable></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="description">
                    <el-input placeholder="description" v-model="form.description" clearable></el-input>
                </el-form-item>
                <el-form-item label="APIGroup" prop="apiGroup" >
                    <el-input placeholder="apiGroup" v-model="form.apiGroup" clearable></el-input>
                </el-form-item>
                <el-form-item label="Method" prop="method">
                    <el-input placeholder="method" v-model="form.method" clearable></el-input>
                </el-form-item>
            </el-form>
            <div class="warning" v-if="dialogTitle==='Add API'">New Api needs to be configured in role management before it can be used</div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="handleCloseDialog">No</el-button>
                <el-button @click="enterDialog" type="primary">Yes</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {addApi,editApi,removeApi,getApiList} from "../../../api/api";
    import {mapGetters} from 'vuex'
    export default {
        name: "index",
        data(){
            return {
                dialogTitle:'',
                dialogApiVisible:false,
                searchForm:{
                    path:'',
                    description:'',
                    method:'',
                    apiGroup:''
                },
                form:{},
                apiData:[],
                rules: {
                    path: [{ required: true, message: 'Please input path', trigger: 'blur' }],
                    apiGroup: [
                        { required: true, message: 'Please input apiGroup', trigger: 'blur' }
                    ],
                    method: [
                        { required: true, message: 'Please input method', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please input description', trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            ...mapGetters("user",["userInfo"]),
        },
        created() {
            this.getDataList()
            },
        methods:{
            // sort change
            sortChange() {

            },
            // submit query
            onSubmit(){
                this.getDataList(this.searchForm)
            },
            // open add  api dialog
            openDialog(t){
                switch (t) {
                    case 'add':
                        this.dialogTitle = 'Add API'
                        break
                    case 'edit':
                        this.dialogTitle = 'Edit Api'
                        break
                    default:
                        break
                }
                this.dialogApiVisible = true
            },
            // edit api
            editApiGroup(row){
                this.form=row
                this.openDialog("edit")
            },
           async getDataList(data){
                const res  = await getApiList(data)
               this.apiData = res.data
            },
            // delete api
            deleteApi(id){
                this.$confirm("This operation will permanently delete this data, Whether to continue?",
                'prompt',
                    {
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'warning'
                    }
                ).then(async () => {
                    await removeApi(id)
                    this.apiData.forEach((item,index) =>{
                        if (item.id === id){
                            this.apiData.splice(index,1)
                        }
                    })

                    this.$message({
                        type: 'success',
                        message: 'success!'})
                })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'Has been canceled'
                        })
                    })
            },
            // before close handle
            handleCloseDialog(){
                this.dialogApiVisible = false
                this.form = {}
            },
            // enter
            enterDialog(){
                this.$refs.apiForm.validate(async valid =>{
                    if(valid){
                    switch (this.dialogTitle) {
                        case "Add API":
                           const res = await addApi([this.form])
                                this.$message({
                                    message:res.meta.message,
                                    type:"success",
                                })
                            this.apiData = res.data
                            break
                        case "Edit Api":
                           const res1 = await editApi(this.form)
                            this.$message({
                                message:res1.meta.message,
                                type:"success",
                            })
                            break
                        default:
                                break
                    }
                    }else {
                        this.$message({
                            message:"please input data",
                            type:"waring",
                        })
                    }
                })
                this.handleCloseDialog()
            }
        }
    }
</script>

<style >
    .search-term {
        margin-top: 20px;
        border-left: 0;
        border-right: 0;
    }
</style>