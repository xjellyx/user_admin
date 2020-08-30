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
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="uid"
                    label="UID"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="createdAt"
                    label="createdTime"
                    sortable
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="username"
                    min-width="180">
            </el-table-column>
            <el-table-column  fixed="right" label="edit" width="350">
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
    </div>
</template>

<script>
    import {getUserTotal,getUserList} from "@/api/user";

    export default {
        name: "User",
        data() {
            return {
                userList: [],
                page: 1,
                pageSize: 10,
                total: 0,
            }
        },
        created() {
            this.getTotal()
            this.getList()
        },
        methods: {
            async getTotal(){
                const {data} = await getUserTotal()
                this.total = data + 1000
            },
            async getList(){
                const {data} = await getUserList({"pageSize":this.pageSize,"pageNum":this.page})
                this.userList = data
            },
            handleSizeChange(val) {
                this.pageSize = val
            },
            handleCurrentChange(val) {
                this.page  = val
                this.getList()
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            }
        }
    }
</script>

<style scoped>
    .el-table .warning-row {
        background-color: oldlace;
    }

    .el-table .success-row {
        background-color: #e914f0;
    }
</style>
