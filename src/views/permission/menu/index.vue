<template>
    <div class="perm-menu">
        <div class="button-box clearflex">
            <el-button :disabled="!roleRoot" @click="addMenu('0')" type="primary">Add menu</el-button>
        </div>
        <el-table
                stripe
                :data="menuList"
                style="width: 100%;margin-bottom: 20px; font-size: 18px"
                row-key="id"
                border
                :tree-props="{children: 'children'}">
        >
<!--            id -->
            <el-table-column align="center" prop="id" label="ID" min-width="120" sortable></el-table-column>
<!--           name -->
            <el-table-column align="center" prop="name" label="Name"  min-width="160" ></el-table-column>
<!--        path    -->
            <el-table-column align="center" prop="path" label="Path"  min-width="200"></el-table-column>
<!--            component-->
            <el-table-column align="center" prop="component" label="Component"  min-width="200"></el-table-column>
            <!--            parent-->
            <el-table-column align="center" prop="parentId" label="Parent"  min-width="100"></el-table-column>
<!--            hidden-->
            <el-table-column align="center" prop="hidden" label="Hidden"  min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.hidden?"yes":"no"}}</span>
                </template>
            </el-table-column>
            <!--            title-->
            <el-table-column align="center" prop="title" label="Title"  min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.meta.title}}</span>
                </template>
            </el-table-column>
            <!--            icon-->
            <el-table-column align="center" prop="icon" label="Icon"  min-width="180">
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.meta.icon" style="padding-right: 5px"/>
                    <span>{{scope.row.meta.icon}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="sort" label="Sort" min-width="120" sortable></el-table-column>
<!--            edit-->
            <el-table-column align="center"  fixed="right" label="Edit" width="350">
                <template slot-scope="scope">
<!--                    add -->
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-edit"
                               :disabled="!roleRoot"
                               @click="addMenu(scope.row.id)"

                    >Add children</el-button>
<!--                    edit-->
                    <el-button type="primary"
                               size="small"
                               :disabled="!roleRoot"
                               @click="editMenu(scope.row)"
                               icon="el-icon-edit" >Edit</el-button>
<!--                    delete-->
                    <el-button type="danger"
                               size="small"
                               :disabled="!roleRoot"
                               @click="deleteMenu(scope.row.id)"
                               icon="el-icon-delete">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            :before-close="handleClose"
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
        >
            <el-form
                    :inline="true"
                    :model="menuForm"
                    :rules="rules"
                    label-position="top"
                    label-width="85px"
                    ref="menuFormRef"
            >
<!--                path -->
                <el-form-item label="name" prop="name" style="width:30%">
                    <el-input
                            autocomplete="off"
                            placeholder="name"
                            v-model="menuForm.name"
                    ></el-input>
                </el-form-item>
<!--                path-->
                <el-form-item label="path" prop="path" style="width:30%">
                    <el-input
                            placeholder="router path"
                            v-model="menuForm.path"
                    ></el-input>
                </el-form-item>
<!--                hidden-->
                <el-form-item label="hidden"  style="width:30%">
                    <el-select placeholder="hidden" v-model="menuForm.hidden">
                        <el-option :value="false" label="no"></el-option>
                        <el-option :value="true" label="yes"></el-option>
                    </el-select>
                </el-form-item>
<!--                component-->
                <el-form-item label="component" prop="component" style="width:30%">
                    <el-input autocomplete="off" v-model="menuForm.component"></el-input>
                </el-form-item>
                <el-form-item label="title" prop="meta.title" style="width:30%">
                    <el-input autocomplete="off" v-model="menuForm.meta.title"></el-input>
                </el-form-item>
                <el-form-item label="icon" prop="meta.icon" style="width:30%">
                    <el-input v-model="menuForm.meta.icon">
                        <template slot="prepend">
                            <svg-icon :icon-class="menuForm.meta.icon"></svg-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="sort" prop="sort" style="width:30%">
                    <el-input autocomplete="off" v-model.number="menuForm.sort"></el-input>
                </el-form-item>
            </el-form>
            <div class="warning">Only Super Administrator Can Operate</div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button @click="enterMenuDialog" type="primary">Confirm</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {checkSuperRole} from "@/utils/role"
    import {addApi, editApi} from "../../../api/api";

    export default {
        name: "Menu",
        // inject: ['reload'],
        data(){
            return {
                isEdit: false,
                dialogTitle: 'Add Menu',
                dialogFormVisible: false,
                menuForm: {
                    path: '',
                    name: '',
                    parentId: '',
                    component:'',
                    hidden: false,
                    meta:{
                        title: '',
                        icon: '',
                        affix: false,
                    }
                },
                rules: {
                    name: [
                        { required: true, message: 'please input name', trigger: 'blur' }
                    ],
                    path: [
                        { required: true, message: 'please input name', trigger: 'blur' }
                        ],
                    component: [{required: true, message:'please input component' ,trigger: 'blur'}],
                    'meta.title': [
                        { required: true, message: 'please input title', trigger: 'blur' }
                    ],
                    'meta.icon': [
                        { required: true, message: 'please input icon', trigger: 'blur' }
                    ],
                    parentId: [
                        { required: true, message: 'please input parentId', trigger: 'blur' }
                    ]
                }
            }
        },
        computed:{
            ...mapGetters("router",["menuList"]),
            ...mapGetters("user",["userInfo","roleRoot"]),
        },
        methods: {
            addMenu(id){
                this.dialogTitle  = "Add Menu"
                this.menuForm.parentId = Number(id)
                this.dialogFormVisible = true
            },
            editMenu(row){
                this.changeEditStatus()
                this.dialogTitle  = "Edit Menu"
                this.dialogFormVisible = true
                this.menuForm=row
            },
           async deleteMenu(id) {
                this.$confirm('This operation will permanently delete the menu under all roles, Whether to continue?', 'prompt', {
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type: 'warning'
                })
                    .then( async () => {

                        const res = await this.$store.dispatch("router/deleteMenu",id)
                         if (res) {
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
            // 关闭对话框
            handleClose(done) {
                this.initForm()
                this.isEdit = false
                done()
            },
            changeEditStatus() {
                this.isEdit = true
            },
            // 关闭弹窗
            closeDialog() {
                this.initForm()
                this.dialogFormVisible = false
            },
            // 确认提交
            // enter
            enterMenuDialog(){
                this.$refs.menuFormRef.validate(async valid =>{
                    if(valid){
                       if (this.isEdit){
                           await this.$store.dispatch("router/changeMenu",this.menuForm)
                       }else {
                         await  this.$store.dispatch("router/addMenu",this.menuForm)
                       }
                    }else {
                        this.$message({
                            message:"please input data",
                            type:"waring",
                        })
                    }
                })
                this.closeDialog()
            },
            // 初始化弹窗内表格方法
            initForm() {
                this.menuForm = {
                    path: '',
                    name: '',
                    parentId: '',
                    component:'',
                    hidden: false,
                    meta:{
                        title: '',
                        icon: '',
                        affix: false,
                    }
                }
            },
        }


    }
</script>

<style scoped lang="scss">
.button-box {
    padding: 10px 20px;
.el-button {
        float: right;
    }
}
.warning {
    color: #dc143c;
}
</style>
