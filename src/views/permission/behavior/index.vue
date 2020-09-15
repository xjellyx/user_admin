<template>
  <div>
    <div class="perm-behavior">
      <el-form :inline="true" :model="searchInfo" class="perm-behavior-search">
        <el-form-item label="Request Method">
          <el-input placeholder="method" v-model="searchInfo.method"></el-input>
        </el-form-item>
        <el-form-item label="Time">
          <el-input placeholder="created time" v-model="searchInfo.createdTime"></el-input>
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
        border
        ref="multipleTable"
        stripe
        style="width: 100%"
        tooltip-effect="dark"
    >
    <el-table-column type="selection" min-width="55"></el-table-column>
    <el-table-column label="Username" min-width="55"></el-table-column>
      <el-table-column label="CreatedTime" min-width="120">
        <template slot-scope="scope">{{ moment(scope.row.createdAt).format("YYYY-MM-DD hh:mm:ss")}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return{
    searchInfo: {},
      moment:moment
  }},
  methods: {
    onSubmit(){},
    removeBehavior(){}
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
