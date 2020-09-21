<template>
<div>
  <div>
    <el-button @click="roleAPiEnter" size="small" type="primary" >Enter</el-button>
  </div>
  <el-tree :data="apiTreeData"
           :default-checked-keys="apiTreeIds"
           :props="apiDefaultProps"
           default-expand-all
           highlight-current
           node-key="uniqueId"
           ref="apiTree"
           show-checkbox
  >
  </el-tree>
</div>
</template>

<script>
// import {mapGetters} from 'vuex'
import {getApiListAll} from "@/api/api";
import {getRoleAPIList,addRoleApi,removeRoleApi} from "@/api/casbin";

export default {
  name: "index",
  props: {
    row: {
      default: function() {
        return {}
      },
      type: Object
    },
  },
  data(){
    return {
      apiTreeData:[],
      apiTreeIds: [],
      role:'',
      apiDefaultProps: {
        children: 'children',
        label: 'description'
      }
    }
  },

  async created() {
    await this.handleSetAPITree()

    // make default checked
    const res = await getRoleAPIList(this.row.role)
    this.role = this.row.role
    this.apiTreeIds = []
    res.data&&res.data.map(item=>{
      this.apiTreeIds.push(item.path+"|"+item.method)
    })
  },

  //
  methods: {
    async handleSetAPITree(){
      const {data} = await getApiListAll()
      this.apiTreeData = []
      const apiObject = {}

      // parse data
      data && data.map(item =>{
         item['uniqueId'] = item.path+"|"+item.method
        if (apiObject.hasOwnProperty(item.apiGroup)){
          apiObject[item.apiGroup].push(item)
        }else {
          Object.assign(apiObject, { [item.apiGroup]: [item] })
        }
      })

      // make tree
     for (const key in  apiObject){
       const treeNode = {
         ID:key,
         description:key+'组',
         children: apiObject[key]
       }
       this.apiTreeData.push(treeNode)
     }

    },

    // nodeChange(node,data,value){
    //   console.log("node",node)
    //   console.log("data",data)
    //   console.log("value",value)
    //   this.$refs.apiTree.setCheckedNodes([node])
    // },

    // add role api
    async handleSetAddAPI(checkList){
      let datas = []
      checkList.forEach(item =>{
        if (this.apiTreeIds.indexOf(item.uniqueId)<0){
            datas.push({"method":item.method,"path":item.path})
        }
      })
      if (datas.length>0){
        await addRoleApi({"role":this.role,"groups":datas})
      }
    },

    // delete role api
    async handleSetRemoveAPI(checkList){
      let datas =[]

      // g checked item list
      let checkedItemList = []
      checkList.forEach(item =>{
        checkedItemList.push(item.uniqueId)
      })
      this.apiTreeIds.forEach(item => {
        if (checkedItemList.indexOf(item)===-1){
            let data = item.split("|")
            datas.push({"method":data[1],"path":data[0]})
        }
      })
      if (datas.length>0){
        await removeRoleApi({"role":this.role,"groups":datas})
      }

    },

    //
    roleAPiEnter(){
      const checkList = this.$refs.apiTree.getCheckedNodes(true)
      this.handleSetAddAPI(checkList)
      this.handleSetRemoveAPI(checkList)
      this.$message.success({
        message:"success",
      })
    }
  },


}
</script>

<style scoped>

</style>