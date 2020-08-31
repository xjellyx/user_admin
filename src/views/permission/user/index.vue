<template>
    <div>
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
                    min-width="60">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.role"
                               @change="changeAuthority(scope.row)">
                        <el-option
                                v-for="item in authOptions"
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
                    min-width="30">
            </el-table-column>
            <el-table-column fixed="right"  align="center" label="Edit" min-width="100">
                <template slot-scope="scope">
                    <!--                    edit-->
                    <el-button type="primary"
                               size="small"
                               @click="editUser(scope.row.uid)"
                               icon="el-icon-edit">edit</el-button>
                    <!--                    delete-->
                    <el-button type="danger"
                               size="small"
                               @click="deleteUser(scope.row.uid)"
                               icon="el-icon-delete">delete</el-button>
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
        >
            <el-form :inline="true" :rules="rules" ref="userForm"
                     label-position="top"
                     label-width="85px"
                     :model="userInfo">
                <el-form-item label="Username" label-width="80px" prop="username">
                    <el-input v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="Password" label-width="80px" prop="password">
                    <el-input v-model="userInfo.password"></el-input>
                </el-form-item>
                <el-form-item label="Phone" label-width="80px" prop="phone">
                    <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {getUserList,delUser,editUserInfo} from "@/api/user";
    import moment from 'moment'
    export default {
        name: "User",
        data() {
            return {
                rules:[],
                userList: [],
                page: 0,
                pageSize: 10,
                total: 0,
                userInfo:{
                    password:"",
                    username: "",
                    phone: "",
                },
                authOptions: [{
                    value:"0",
                    label:"general",
                },
                    {
                        value:"1",
                        label:"admin",
                    }, {
                        value:"2",
                        label:"superAdmin",
                    }
                ],
            }
        },
        created() {
            this.getUserAll()
        },
        methods: {
            async getUserAll(){
                const {data} = await getUserList({})
                this.userList = data
                this.userList.forEach(item =>{
                    item.createdAt = moment(item.createdAt).format("YYYY-MM-DD hh:mm:ss")
                    // 0 role general; 1 role admin; 2 role superAdmin
                    switch (item.role) {
                        case 0:
                            item.role = "general"
                            break
                        case 1:
                            item.role = "admin"
                            break
                        case 2:
                            item.role ="superAdmin"
                            break

                    }
                })
                this.total = this.userList.length
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
                this.$confirm('This operation will permanently delete the menu under all roles, Whether to continue?',
                    'prompt',{
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        type: 'warning'
                    }
                ).then(async () => {
                    const res = await delUser(uid)
                    if (res.meta.message === "success") {
                        this.userList.forEach(item =>{
                            if (item.uid === uid){
                                this.userList.splice(item,1)
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
                            message: '已取消删除'
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
                }
            }
    }
</script>

<style>
    .el-table .warning-row {
        background-color: oldlace;
    }

    .el-table .success-row {
        background-color: #ebf9ec;
    }
</style>
