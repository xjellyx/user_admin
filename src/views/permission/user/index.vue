<template>
    <div class="perm-user">
        <el-table
                :data="userList"
                style="width: 100%"
                :row-class-name="tableRowClassName">
            <el-table-column
                    prop="id"
                    label="ID"
                    sortable
                    align="center"
                    min-width="30">
            </el-table-column>
            <el-table-column
                    prop="uid"
                    label="UID"
                    align="center"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="createdAt"
                    label="CreatedTime"
                    sortable
                    align="center"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="Username"
                    align="center"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="Role"
                    align="center"
                    min-width="80">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.roleRefer"
                               @change="changeAuthority(scope.row)">
                        <el-option
                                v-for="item in roleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    align="center"
                    label="Status"
                    min-width="80">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.status"
                               @change="changeStatus(scope.row)">
                        <el-option
                                v-for="item in options.status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column fixed="right"  align="center" label="Edit" min-width="100">
                <template slot-scope="scope">
                    <!--                    edit-->
                    <el-button type="primary"
                               size="small"
                               @click="editUser(scope.row.uid)"
                               icon="el-icon-edit">Edit</el-button>
                    <!--                    delete-->
                    <el-button type="danger"
                               size="small"
                               @click="deleteUser(scope.row.uid)"
                               icon="el-icon-delete">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :current-page="page"
                :page-size="pageSize"
                :page-sizes="[10, 30, 50, 100]"
                :style="{float:'right',padding:'20px'}"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <el-dialog
                title="Edit User"
                custom-class="user-dialog"
                :visible.sync="dialogVisible"
                center
        >
            <el-form  :inline="true" :rules="rules" ref="userForm"
                     label-position="top"
                     label-width="85px"
                     :model="userForm">
                <el-form-item label="Username" label-width="80px" prop="username">
                    <el-input placeholder="username" v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="Password" label-width="80px" prop="password">
                    <el-input placeholder="password" v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="Phone" label-width="80px" prop="phone">
                    <el-input placeholder="phone" v-model="userForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="Role" label-width="80px" prop="role">
                    <el-select  v-model="userForm.roleRefer">
                        <el-option
                                v-for="item in roleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Status" label-width="80px" prop="status">
                    <el-select  v-model="userForm.status">
                        <el-option
                                v-for="item in options.status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="cancelDialog">No</el-button>
                <el-button @click="enterDialog" type="primary">Yes</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {delUser, editUserInfo, getUserKV, getUserList} from "@/api/user";
    import {getRoleList} from "@/api/role";
    import moment from 'moment'
    import {mapGetters} from 'vuex'
    export default {
        name: "User",
        data() {
            return {
                rules: {
                    username: [
                        { required: true, message: "Please input username", trigger: "blur" },
                        { min: 6, message: "The less length is 6", trigger: "blur"}
                    ],
                    password: [
                        { required: true, message: "Please input password", trigger: "blur" },
                        { min: 6, message: "The less length is 6", trigger: "blur"}
                    ],
                    phone: [
                        { required: true, message: "Please input Phone", trigger: "blur" }
                    ],
                    role: [
                        { required: true, message: "Please input role", trigger: "blur" }
                    ],
                    status: [{ required: true, message: "Please input status", trigger: "blur" }]
                },
                userList: [],
                roleList:[],
                page: 0,
                pageSize: 10,
                total: 0,
                userForm:{
                    uid: '',
                    password:"",
                    username: "",
                    phone: "",
                    roleRefer:'',
                    status:''
                },
                roleOptions:[],
                options: {},
                dialogVisible: false
            }
        },
        computed: {
            ...mapGetters("user",["userInfo"]),
        },
        created() {
            this.handlerSetRoleOptions()
            this.getUserAll()
            this.handlerGetUserKV()
        },
        methods: {
            async getUserAll(){
                const {data} = await getUserList({})
                this.userList = data
                this.userList.forEach(item =>{
                    item.createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm:ss")
                    // 0 role general; 1 role admin; 2 role superAdmin
                    // switch (item.role) {
                    //     case 0:
                    //         item.role = "general"
                    //         break
                    //     case 1:
                    //         item.role = "admin"
                    //         break
                    //     case 2:
                    //         item.role ="superAdmin"
                    //         break
                    //
                    // }
                })
                this.total = this.userList.length
            },
            async handlerSetRoleOptions(){
               const res = await getRoleList()
                this.roleList = res.data
                this.roleList.forEach(item =>{
                    this.roleOptions.push({"label":item.role,"value":item.id})
                })
                console.log("aaaaaaaaaaaaaaa",this.roleOptions)
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.page = 1
            },
            handleCurrentChange(val) {
                this.page  = val
            },
            tableRowClassName({row}) {
                if (row.status === 4) {
                    return 'warning-row';
                } else  {
                    return 'success-row';
                }
            },
            // deleteUser
            deleteUser(uid){
                this.$confirm('This operation will permanently delete this data, Whether to continue?',
                    'prompt',{
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'warning'
                    }
                ).then(async () => {
                    const res = await delUser(uid)
                    if (res.meta.message === "success") {
                        this.userList.forEach((item,index) =>{
                            if (item.uid === uid){
                                this.userList.splice(index,1)
                            }

                        })
                        this.$message({
                            type: 'success',
                            message: 'success!'})
                    }

                })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'Has been canceled'
                        })
                    })

            },
            async changeAuthority(row){
                const res = await editUserInfo({uid:row.uid,role:row.role})
                if (res.meta.message === "success"){
                    this.$message({
                        type: 'success',
                        message: 'success!'})
                }
                if (this.userInfo.uid === row.uid){
                    await  this.$store.dispatch("user/getUserInfo")
                }
                },
            // change user status
           async changeStatus(row){
                const res = await editUserInfo({uid:row.uid,status:String(row.status)})
                if (res.meta.message === "success"){
                    this.$message({
                        type: 'success',
                        message: 'success!'})
                }
               if (this.userInfo.uid === row.uid){
                   await  this.$store.dispatch("user/getUserInfo")
               }
            },
            // editUser
            async editUser(uid){
                this.dialogVisible = true
                this.userForm.uid = uid
            },
            async handlerGetUserKV(){
                const res= await getUserKV()
                this.options= res.data
            },
            async enterDialog(){
                const res = await editUserInfo(this.userForm)
                if (res.meta.message === "success"){
                    this.$message({
                        type: 'success',
                        message: 'success!'})
                }
                if (this.userInfo.uid === this.userForm.uid){
                    await  this.$store.dispatch("user/getUserInfo")
                }
            },
            async cancelDialog(){
                this.userForm = {}
                this.dialogVisible = false
            }
            },

    }
</script>

<style>
    .el-table .warning-row {
        background-color: #fde6e6;
    }

    .el-table .success-row {
        background-color: #ebf9ec;
    }
</style>
