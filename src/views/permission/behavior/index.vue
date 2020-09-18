<template>
  <div>
    <div class="perm-behavior">
      <el-form :inline="true" :model="searchInfo" class="perm-behavior-search">
        <el-form-item label="Request Method">
          <el-input placeholder="method" v-model="searchInfo.method"></el-input>
        </el-form-item>
        <el-form-item label="Time">
          <el-input placeholder="created time" v-model="searchInfo.createdAt"></el-input>
        </el-form-item>
        <el-form-item label="Username">
          <el-input placeholder="username" v-model="searchInfo.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="removeBehavior" type="danger">Remove</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 20px">
      <el-table
              :data="behaviorList"
              border
              ref="multipleTable"
              stripe
              style="width: 100%;"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
      >
        <el-table-column         align="center"  type="selection" min-width="55"></el-table-column>
        <el-table-column       prop="id"  align="center" label="ID" min-width="80"></el-table-column>
        <el-table-column       prop="username"  align="center" label="Username" min-width="120"></el-table-column>
        <el-table-column         align="center" label="CreatedTime" min-width="120">
          <template slot-scope="scope">{{ moment(scope.row.createdAt).format("YYYY-MM-DD hh:mm:ss")}}</template>
        </el-table-column>

        <el-table-column       prop="behavior"  align="center" label="Behavior" min-width="120"></el-table-column>
        <el-table-column       prop="ip"  align="center" label="IP" min-width="120"></el-table-column>
        <el-table-column       prop="path"  align="center" label="Path" min-width="120"></el-table-column>
        <el-table-column      prop="method"   align="center" label="Method" min-width="120"></el-table-column>
        <el-table-column        align="center" label="Edit" width="180">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleRemoveBehavior(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              :current-page="page"
              :page-size="pageSize"
              :total="total"
              :page-sizes="[10, 30, 50, 100]"
              :style="{float:'right',padding:'20px'}"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout=" total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div style="margin-top: 40px;display: flex; float: right;flex: content">
      <el-button type="primary" @click="toggleSelection()">Cancel Selection</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {getBehaviorList,removeBehaviorList,behaviorCount} from "@/api/behavior"
export default {
  data() {
    return{
      pageSize:10,
      page:1,
      total:0,
      behaviorList:[],
      multipleSelection:[],
    searchInfo: {},
      moment:moment
  }},
  async created() {
    const {data} = await behaviorCount()
    this.total = data
    const res  = await getBehaviorList({"page":this.page,"pageSize":this.pageSize})
    this.behaviorList = res.data
  },
  methods: {
    // 查找數據
    async onSubmit(){
      this.searchInfo.page = this.page
      this.searchInfo.pageSize = this.pageSize
      const {data}  = await getBehaviorList(this.searchInfo)
      this.behaviorList = data
    },
    // 刪除數據
    async removeBehavior(){
      const ids =[]
      this.multipleSelection.forEach(item =>{
        ids.push(item.id)
      })
      const res = await removeBehaviorList( {"ids":ids})
      if (res){
        this.$message.success("remove behavior success")
      }
    },
    // 改變每頁size
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.onSubmit()
    },
    //  改变页数
    handleCurrentChange(val) {
      this.page  = val
      this.onSubmit()
    },
    // 取消选中
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleRemoveBehavior(row){
      const ids =[]
      ids.push(row.id)
      const res = await removeBehaviorList( {"ids":ids})
      if (res){
        this.$message.success("remove behavior success")
      }
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
    .perm-behavior-search {
      margin-top: 30px;
      margin-left: 20px;
      display: flex;
    }
</style>
