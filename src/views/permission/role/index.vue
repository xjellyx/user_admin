<template>
    <div class="perm-role">
        <div class="perm-role-add">
            <el-button @click="handleAddRole"  type="primary">Add Role</el-button>
        </div>
        <el-table :data="roleData"
                  stripe
                  border
                  style="width: 100%;margin-top:20px;margin-bottom: 20px; font-size: 18px"
        >
            <el-table-column align="center" label="ID" prop="id" min-width="60px" sortable></el-table-column>
            <el-table-column align="center" label="Role" prop="role" min-width="80px" ></el-table-column>
            <el-table-column align="center" label="Level" prop="level" min-width="60px" sortable></el-table-column>
            <el-table-column  fixed="right" align="center" label="Edit" min-width="180px" >
                <template slot-scope="scope">
                    <el-button type="primary">Set Permission</el-button>
                    <el-button @click="handleEditRole" icon="el-icon-edit" type="primary">Edit</el-button>
                    <el-button icon="el-icon-delete" type="danger">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :before-close="handleCloseRoleDialog" :title="roleDialogTitle"
                   :visible.sync="dialogRoleVisible" center >

        </el-dialog>
    </div>
</template>

<script>
    import {getRoleList} from "@/api/role";

    export default {
        name: "index",
        data(){
            return {
                addRoleForm:{},
                roleData:[],
                dialogRoleVisible: false,
                roleDialogTitle: '',

            }
        },
        created() {
            this.handlerGetRoleList()
        },
        methods: {
            async handlerGetRoleList (){
               const res= await getRoleList()
                this.roleData = res.data
            },
            handleCloseRoleDialog(){
                this.dialogRoleVisible = false
                this.roleDialogTitle= ""
            },
            handleAddRole(){
                this.dialogRoleVisible = true
                this.roleDialogTitle= "Add Role"
            },
            handleEditRole(){
                this.dialogRoleVisible = true
                this.roleDialogTitle= "Edit Role"
            }
        }
    }
</script>

<style scoped>
.perm-role-add {
    padding: 10px 20px;
    float: right;
}
</style>
