<template>
    <div>
        <div class="button-box clearflex">
            <el-button @click="addMenu('0')" type="primary">add menu</el-button>
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
            <el-table-column prop="name" label="name"  min-width="160" sortable></el-table-column>
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
<!--            edit-->
            <el-table-column fixed="right" label="edit" width="350">
                <template slot-scope="scope">
<!--                    add -->
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-edit"
                    >add children</el-button>
<!--                    edit-->
                    <el-button type="primary"
                               size="small"
                               icon="svg-icon-edit" >edit</el-button>
<!--                    delete-->
                    <el-button type="danger"
                               size="small"
                               icon="el-icon-delete">delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Menu",
        data(){
            return {
            }
        },

        computed:{
            ...mapGetters("router",["menuList"]),
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