<template>
    <div class="perm-user">
      <div class="perm-user-add">
        <!--                    add-->
        <el-button type="primary"
                   size="small"
                   @click="addUser"
                   icon="el-icon-edit">Add user</el-button>
      </div>
        <el-table
                :data="userList"
                stripe
                border
                style="width: 100%"
                :row-class-name="tableRowClassName">
            <el-table-column
                    prop="id"
                    label="ID"
                    sortable
                    align="center"
                    min-width="30px">
            </el-table-column>
            <el-table-column
                    prop="uid"
                    label="UID"
                    align="center"
                    min-width="100px">
            </el-table-column>
            <el-table-column
                    label="CreatedTime"
                    sortable
                    align="center"
                    min-width="100px"
            >              <template slot-scope="scope">
                {{ moment(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="Username"
                    align="center"
                    min-width="100px">
            </el-table-column>
            <el-table-column
                    label="Role"
                    align="center"
                    min-width="80px">
                <template slot-scope="scope">
                    <el-select :disabled="scope.row.uid===userInfo.uid || Number(scope.row.role.level) >= Number(userInfo.role.level)" v-model="scope.row.roleRefer"
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
                    min-width="80px">
                <template slot-scope="scope">
                    <el-select :disabled="scope.row.uid===userInfo.uid || Number(scope.row.role.level) >= Number(userInfo.role.level)" v-model="scope.row.status"
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
            <el-table-column fixed="right"  align="center" label="Edit" width="350px">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.uid===userInfo.uid || Number(scope.row.role.level) >= Number(userInfo.role.level)" type="primary"
                               size="small"
                               @click="editUser(scope.row)"
                               icon="el-icon-edit">Edit</el-button>
                    <!--                    delete-->
                    <el-button :disabled="scope.row.uid===userInfo.uid || Number(scope.row.role.level) >= Number(userInfo.role.level)" type="danger"
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
            <el-form  :inline="true" :rules="isAdd?rules:{}" ref="userForm"
                     label-position="top"
                     label-width="85px"
                     :model="userForm">
                <el-form-item label="Username" label-width="80px" prop="username">
                    <el-input placeholder="username" v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="Password" label-width="80px" prop="password">
                    <el-input placeholder="password" v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item v-if="isAdd===false" label="Phone" label-width="80px" prop="phone">
                    <el-input placeholder="phone" v-model="userForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="Role" label-width="80px" prop="roleRefer">
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

                <el-form-item  v-if="isAdd===false"  label="Status" label-width="80px" prop="status">
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
    import {delUser, editUserInfo, getUserKV, getUserList,addUser,getUserCount} from "@/api/user";
    import {getRoleList} from "@/api/role";
    import moment from 'moment'
    import {mapGetters} from 'vuex'
    export default {
        name: "User",
        data() {
            return {
              isAdd: false,
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
                  roleRefer: [
                        { required: true, message: "Please input role", trigger: "blur" }
                    ],
                    status: [{ required: true, message: "Please input status", trigger: "blur" }]
                },
                userList: [],
                roleList:[],
                page: 1,
                pageSize: 10,
                total: 0,
                userForm:{
                    uid: '',
                    password:"",
                    username: "",
                    phone: "",
                    roleRefer:0,
                    status:''
                },
              moment:moment,
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
             this.handleGetUserList()
             this.handlerGetUserKV()
            this.handleUserTotal()

        },
        methods: {
          // 用戶總數
          async handleUserTotal(){
            const res = await getUserCount()
            this.total = res.data
          },
          // 獲取用戶
            async handleGetUserList(){
                const {data} = await getUserList({page: this.page, pageSize: this.pageSize})
                this.userList = data
            },
            async handlerSetRoleOptions(){
               const res = await getRoleList()
                this.roleList = res.data
                this.roleList.forEach(item =>{
                    this.roleOptions.push({"label":item.role,"value":Number(item.id)})
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.page = 1
                this.handleGetUserList()
            },
            handleCurrentChange(val) {
                this.page  = val
              this.handleGetUserList()
            },
            tableRowClassName({row}) {
                if (row.status === 4) {
                    return 'warning-row';
                } else  {
                    return 'success-row';
                }
            },
          addUser(){
              this.dialogVisible = true
              this.isAdd = true

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
                const res = await editUserInfo({uid:row.uid,roleRefer:row.roleRefer})
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
                   await  this.$store.dispatch("user/getUserInfo")

            },
            // editUser
            async editUser(row){
                this.dialogVisible = true
                this.userForm = row
                this.isAdd = false
            },
            async handlerGetUserKV(){
                const res= await getUserKV()
                this.options= res.data
            },
            async enterDialog(){
                if (this.isAdd){
                  const res = await addUser(this.userForm)
                  this.isAdd =false
                  if (res.meta.message === "success"){
                    this.$message({
                      type: 'success',
                      message: 'success!'})
                  }
                }else {
                  const res = await editUserInfo(this.userForm)
                  if (res.meta.message === "success"){
                    this.$message({
                      type: 'success',
                      message: 'success!'})
                  }
                }
              await  this.$store.dispatch("user/getUserInfo")
              this.dialogVisible = false

            },
          cancelDialog(){
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
    .perm-user-add {
      padding: 10px 20px;
      float: right;
    }
</style>
