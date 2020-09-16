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

    <el-table
            :data="behaviorList"
        border
        ref="multipleTable"
        stripe
        style="width: 100%;"
        tooltip-effect="dark"
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
    onSubmit(){},
    async removeBehavior(){
      await removeBehaviorList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
    },
    handleCurrentChange(val) {
      this.page  = val
    },
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
