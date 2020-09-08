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
                    <el-button @click="handleEditRole(scope.row)" icon="el-icon-edit" size="small" type="primary">Edit</el-button>
                    <el-button @click="deleteRole(scope.row)" icon="el-icon-delete" size="small" type="danger">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :before-close="handleCloseRoleDialog" :title="roleDialogTitle"
                   :visible.sync="dialogRoleVisible" center >
          <el-form :model="roleForm"
                   :rules="roleFormRules"
                   ref="roleFormRefs"

          >
            <el-form-item label="Role"  prop="role">
              <el-input placeholder="role" autocomplete="off" v-model="roleForm.role"></el-input>
            </el-form-item>
            <el-cascader
                v-model="value"
                :options="roleLevelOptions"
                @change="changeRoleLevel"
                filterable
            >
            </el-cascader>
          </el-form>
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
    import {getRoleList,getRoleLevelList,editRole,removeRole,addRole} from "@/api/role";
    import Apis from './components/apis'

    export default {
        name: "index",
      components:{Apis},
        data(){
            return {
                activeRow: {},
              value:[],
                roleForm:{
                  role:'',
                  level:0,
                  id:0,
                },
                roleData:[],
                roleLevelOptions:[],
                roleFormRules:{
                    role: [
                      { required: true, message: "role name", trigger: "blur" }
                    ],
                    level: [
                      { required: true, message: "role level", trigger: "blur" }
                    ]
              },
                dialogRoleVisible: false,
                roleDrawer:false,
                roleDialogTitle: '',

            }
        },
        created() {
          this.handlerGetRoleList()
          this.setRoleLevelOptions()

        },
        methods: {
          // set role level options
            async setRoleLevelOptions(){
              const {data} = await getRoleLevelList()
              this.roleLevelOptions = []
               data && data.forEach(item =>{
                 let _d = {}
                 _d["label"] = "Level "+item
                 _d['value'] =  String(item)
                 this.roleLevelOptions.push(_d)
               })
            },

          // get role list
            async handlerGetRoleList (){
               const res= await getRoleList()
                this.roleData = res.data
            },
            handleCloseRoleDialog(){
                this.dialogRoleVisible = false
                this.roleDialogTitle= ""
            },

          // add
            handleAddRole(){
                this.dialogRoleVisible = true
                this.roleDialogTitle= "Add Role"
            },

          // edit
            handleEditRole(row){
                this.dialogRoleVisible = true
                this.roleDialogTitle= "Edit Role"
                this.roleForm = row
                this.value = []
                this.value.push(row.level)
            },

          // delete
          deleteRole(row){
            this.$confirm('This operation will permanently delete all data, Whether to continue?', 'prompt', {
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              type: 'warning'
            })
                .then( async () => {
                  const res = await removeRole(row.id)
                  if (res) {
                    this.$message({
                      type: 'success',
                      message: 'success!'})
                  }
                 await this.handlerGetRoleList()
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: 'Has been canceled'
                  })
                })
          },

          // open drawer
          openRoleDrawer(row){
            this.roleDrawer = true
            this.activeRow = row;

          },

          // get value arr to level
          changeRoleLevel(){
              this.roleForm.level=this.value[0]
          },

          // cancel
          closeRoleDialog(){
            this.dialogRoleVisible = false
            this.roleDialogTitle= ""
            this.roleForm = {}
            this.value = []
          },

          // enter
          enterRoleDialog(){
            this.$refs.roleFormRefs.validate(
                async valid =>{
                  if (valid){
                    switch (this.roleDialogTitle){
                      case "Add Role":
                        await addRole(this.roleForm)
                        break
                      case "Edit Role":
                        await editRole(this.roleForm)
                        break
                      default:
                        return
                    }
                    this.$message({
                      message:"success",
                      type:"success",
                    })
                  }else {
                    this.$message({
                      message:"please input data",
                      type:"waring",
                    })
                  }
                }
            )
            this.dialogRoleVisible = false
            this.roleDialogTitle= ""
            this.roleForm = {}
            this.value = []
          },
        }
    }
</script>

<style scoped>
.perm-role-add {
    padding: 10px 20px;
    float: right;
}
</style>
