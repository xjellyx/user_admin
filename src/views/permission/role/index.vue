<template>
    <div class="perm-role">
        <div class="perm-role-add">
            <el-button @click="handleAddRole" size="small"  type="primary">Add Role</el-button>
        </div>
        <el-table :data="roleData"
                  stripe
                  border
                  style="width: 100%;margin-top:20px;margin-bottom: 20px; font-size: 18px"
        >
            <el-table-column align="center" label="ID" prop="id" min-width="60px" sortable></el-table-column>
            <el-table-column align="center" label="Role" prop="role" min-width="80px" ></el-table-column>
            <el-table-column align="center" label="Level" prop="level" min-width="60px" sortable></el-table-column>
            <el-table-column  fixed="right" align="center" label="Edit" width="400px" >
                <template slot-scope="scope">
                    <el-button @click="openRoleDrawer(scope.row)" type="primary" size="small">Set Permission</el-button>
                    <el-button @click="handleEditRole" icon="el-icon-edit" size="small" type="primary">Edit</el-button>
                    <el-button icon="el-icon-delete" size="small" type="danger">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :before-close="handleCloseRoleDialog" :title="roleDialogTitle"
                   :visible.sync="dialogRoleVisible" center >
          <div class="dialog-footer" slot="footer">
            <el-button @click="closeRoleDialog">Close</el-button>
            <el-button @click="enterRoleDialog" type="primary">Enter</el-button>
          </div>
        </el-dialog>

      <el-drawer :visible.sync="roleDrawer" :with-header="false" size="40%" title="Role Configuration" v-if="roleDrawer">
        <el-tabs type="border-card">
          <el-tab-pane label="Role API">
            <apis :row="activeRow" ref="apis"></apis>
          </el-tab-pane>
        </el-tabs>
      </el-drawer>
    </div>
</template>

<script>
    import {getRoleList} from "@/api/role";
    import Apis from './components/apis'

    export default {
        name: "index",
      components:{Apis},
        data(){
            return {
                activeRow: {},
                addRoleForm:{},
                roleData:[],
                dialogRoleVisible: false,
                roleDrawer:false,
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
            },
          openRoleDrawer(row){
            this.roleDrawer = true
            this.activeRow = row;

          },
          closeRoleDialog(){},
          enterRoleDialog(){},
        }
    }
</script>

<style scoped>
.perm-role-add {
    padding: 10px 20px;
    float: right;
}
</style>
