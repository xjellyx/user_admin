<template>
    <div>
        <div class="button-box clearflex">
            <el-button v-show="isSuperRole()" @click="addMenu('0')" type="primary">add menu</el-button>
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
            <el-table-column prop="id" label="ID" min-width="120" sortable></el-table-column>
<!--           name -->
            <el-table-column prop="name" label="name"  min-width="160" ></el-table-column>
<!--        path    -->
            <el-table-column prop="path" label="path"  min-width="160"></el-table-column>
<!--            component-->
            <el-table-column prop="component" label="component"  min-width="180"></el-table-column>
            <!--            parent-->
            <el-table-column prop="parentId" label="parent"  min-width="100"></el-table-column>
<!--            hidden-->
            <el-table-column prop="hidden" label="hidden"  min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.hidden?"yes":"no"}}</span>
                </template>
            </el-table-column>
            <!--            title-->
            <el-table-column prop="title" label="title"  min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.meta.title}}</span>
                </template>
            </el-table-column>
            <!--            icon-->
            <el-table-column prop="icon" label="icon"  min-width="180">
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.meta.icon" style="padding-right: 5px"/>
                    <span>{{scope.row.meta.icon}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="sort" label="sort" min-width="120" sortable></el-table-column>
<!--            edit-->
            <el-table-column v-if="isSuperRole()" fixed="right" label="edit" width="350">
                <template slot-scope="scope">
<!--                    add -->
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-edit"
                               @click="addMenu(scope.row.id)"

                    >add children</el-button>
<!--                    edit-->
                    <el-button type="primary"
                               size="small"
                               @click="editMenu(scope.row)"
                               icon="svg-icon-edit" >edit</el-button>
<!--                    delete-->
                    <el-button type="danger"
                               size="small"
                               @click="deleteMenu(scope.row.id)"
                               icon="el-icon-delete">delete</el-button>
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
                    :model="form"
                    :rules="rules"
                    label-position="top"
                    label-width="85px"
                    ref="menuForm"
            >
<!--                path -->
                <el-form-item label="name" prop="name" style="width:30%">
                    <el-input
                            autocomplete="off"
                            placeholder="name"
                            v-model="form.name"
                    ></el-input>
                </el-form-item>
<!--                path-->
                <el-form-item label="path" prop="path" style="width:30%">
                    <el-input
                            placeholder="router path"
                            v-model="form.path"
                    ></el-input>
                </el-form-item>
<!--                hidden-->
                <el-form-item label="hidden"  style="width:30%">
                    <el-select placeholder="hidden" v-model="form.hidden">
                        <el-option :value="false" label="no"></el-option>
                        <el-option :value="true" label="yes"></el-option>
                    </el-select>
                </el-form-item>
<!--                component-->
                <el-form-item label="component" prop="component" style="width:30%">
                    <el-input autocomplete="off" v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item label="title" prop="meta.title" style="width:30%">
                    <el-input autocomplete="off" v-model="form.meta.title"></el-input>
                </el-form-item>
                <el-form-item label="icon" prop="meta.icon" style="width:30%">
                    <el-input v-model="form.meta.icon">
                        <template slot="prepend">
                            <svg-icon :icon-class="form.meta.icon"></svg-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="sort" prop="sort" style="width:30%">
                    <el-input autocomplete="off" v-model.number="form.sort"></el-input>
                </el-form-item>
            </el-form>
            <div class="warning">Only Super Administrator Can Operate</div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button @click="enterDialog" type="primary">Confirm</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {checkSuperRole} from "@/utils/role"

    export default {
        name: "Menu",
        data(){
            return {
                isEdit: false,
                dialogTitle: 'Add Menu',
                dialogFormVisible: false,
                form: {
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
            ...mapGetters("user",["userInfo"]),
        },
        methods: {
            isSuperRole() {
                return checkSuperRole(this.userInfo.role)
            },
            addMenu(id){
                this.dialogTitle  = "Add Menu"
                this.form.parentId = Number(id)
                this.dialogFormVisible = true
            },
            editMenu(row){
                this.changeEditStatus()
                this.dialogTitle  = "Edit Menu"
                this.dialogFormVisible = true
                this.form=row
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
                            message: '已取消删除'
                        })
                    })
                // this.$confirm('This operation will permanently delete the menu under all roles, Whether to continue?', 'prompt', {
                //     confirmButtonText: 'Confirm',
                //     cancelButtonText: 'Cancel',
                //     type: 'warning'
                // })
                //     .then(async () => {
                //         await  this.$store.dispatch("router/deleteMenu",id)
                //         this.$message({
                //             type: 'success',
                //             message: 'success'
                //         })
                //     })
                //     .catch(() => {
                //         this.$message({
                //             type: 'info',
                //             message: 'Undeleted'
                //         })
                //     })

            },
            // 关闭对话框
            handleClose(done) {
                this.initForm()
                done()
            },
            changeEditStatus() {
                this.isEdit = ! this.isEdit
            },
            // 关闭弹窗
            closeDialog() {
                this.initForm()
                this.dialogFormVisible = false
            },
            // 确认提交
            async enterDialog(){
                if (this.isEdit){
                    await this.$store.dispatch("router/changeMenu",this.form)
                }else {
                    await  this.$store.dispatch("router/addMenu",this.form)
                }
                this.initForm()
                this.dialogFormVisible = false
            },
            // 初始化弹窗内表格方法
            initForm() {
                this.checkFlag = false
                this.$refs.menuForm.resetFields()
                this.form = {
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
