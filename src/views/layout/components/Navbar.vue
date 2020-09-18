<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

<!--        <el-tooltip content="Global Size" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="'data:image/png;base64,'+avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/layout/profile">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/olongfen/user_admin">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <!--          <a target="_blank" href="https://olongfen.github.io/vue-element-admin-site/#/">-->
          <!--            <el-dropdown-item>Docs</el-dropdown-item>-->
          <!--          </a>-->
          <el-dropdown-item @click.native="showPassword=true" >Modify password</el-dropdown-item>
          <el-dropdown-item @click.native="showHeadIcon=true" >Upload head icon</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Logout</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog :visible.sync="showPassword" @close="clearPassword" title="修改密码" width="360px">
        <el-form :model="pwdModify" :rules="rules" label-width="80px"  center ref="modifyPwdForm">
          <el-form-item :minlength="6" label="原密码" prop="password">
            <el-input show-password v-model="pwdModify.password"></el-input>
          </el-form-item>
          <el-form-item :minlength="6" label="新密码" prop="newPassword">
            <el-input show-password v-model="pwdModify.newPassword"></el-input>
          </el-form-item>
          <el-form-item :minlength="6" label="确认密码" prop="confirmPassword">
            <el-input show-password v-model="pwdModify.confirmPassword"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="showPassword=false">取 消</el-button>
          <el-button @click="savePassword" type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="showHeadIcon"  title="Upload Head Icon"  >
        <el-upload
            :action="`${path}/user/modifyHeadIcon`"
            :before-upload="checkFile"
            :headers="{ 'token': token }"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :show-file-list="false"
            name="headIcon"
            multiple
            drag
        >
          <el-button size="small" type="primary">Click upload</el-button>
          <div class="el-upload__tip" slot="tip">
            Only jpg/png files can be uploaded, and no more than 500kb
          </div>
        </el-upload>

      </el-dialog>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import {baseApi} from "@/settings"
import {getToken} from "@/utils/auth"
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {changeLoginPwd} from "@/api/user";

export default {
  inject:['reload'],
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      path: baseApi,
      showPassword: false,
      showHeadIcon:false,
      token:getToken(),
      pwdModify: {},
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.pwdModify.newPassword) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
    }
  },
  computed: {
    ...mapGetters("app",[
      'sidebar',
      'device'
    ]),
    ...mapGetters("user",["avatar"]),
    ...mapGetters('user', ['userInfo']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    savePassword() {
      this.$refs.modifyPwdForm.validate(valid => {
        if (valid) {
          changeLoginPwd({
            username: this.userInfo.username,
            oldPwd: this.pwdModify.password,
            newPwd: this.pwdModify.newPassword
          }).then(() => {
            this.$message.success('success！')
            this.showPassword = false
          })
        } else {
          return false
        }
      })
    },
    clearPassword() {
      this.pwdModify = {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$refs.modifyPwdForm.clearValidate()
    },
    checkFile(file) {
      const isJPG = file.type === "image/jpeg";
      const isPng = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPng) {
        this.$message.error("The uploaded profile picture can only be in JPG or png format!");
      }
      if (!isLt2M) {
        this.$message.error("The size of the uploaded profile picture cannot exceed 2MB!");
      }
      return (isPng || isJPG) && isLt2M;
    },
    uploadSuccess(res) {
      if (res.meta.code === 20000) {
        this.$store.dispatch("user/getUserInfo")
        this.reload()
        this.$message({
          type: "success",
          message: "success",
        });
      } else {
        this.$message({
          type: "warning",
          message: res.meta.message,
        });
      }
    },
    uploadError() {
      this.$message({
        type: "error",
        message: "fail",
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
