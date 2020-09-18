<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

            <div class="title-container">
                <h3 class="title" style="color: black">欢迎来到后台管理中心</h3>
            </div>

<!--            username-->
            <el-form-item prop="username">
        <span class="svg-container"      style="color: black">
          <svg-icon icon-class="user" />
        </span>
                <el-input
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="Username"
                        name="username"
                        type="text"
                        tabindex="1"
                        autocomplete="on"
                />
            </el-form-item>

<!--            password-->
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
          <span class="svg-container"      style="color: black">
            <svg-icon icon-class="password" />
          </span>
                    <el-input
                            :key="passwordType"
                            ref="password"
                            v-model="loginForm.password"
                            :type="passwordType"
                            placeholder="Password"
                            name="password"
                            tabindex="2"
                            autocomplete="on"
                            @keyup.native="checkCapslock"
                            @blur="capsTooltip = false"

                    />
                    <span class="show-pwd" @click="showPwd">
            <svg-icon      style="color: black" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
                </el-form-item>
            </el-tooltip>

<!--            verify code-->
            <el-form-item style="position:relative">
                <el-input
                        v-model="loginForm.digits"
                        name="logVerify"
                        placeholder="请输入验证码"
                        style="width:60%"
                        @keyup.enter.native="handleLogin"
                />
                <div class="vPic">
                    <img    v-if="captchaIcon"
                            :src="captchaIcon"
                            width="100%"
                            height="100%"
                            @click="handleGetCaptcha()"
                    />
                </div>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

            <div style="position:relative">
                <div class="tips">
                    <a  href="https://github.com/olongfen/gorm-gin-admin">
                      <img style="height: 25px;width: 25px;" src="@/assets/github.png"/>
                    </a>
                  <a style="margin-left: 40px" href="https://github.com/olongfen/user_admin">
                    <img style="height: 25px;width: 25px;" src="@/assets/web.png"/>
                  </a>
<!--                  <a style="margin-left: 40px" href="https://github.com/olongfen/gorm-gin-admin">-->
<!--                    <img style="height: 25px;width: 25px;" src="@/assets/github.png"/>-->
<!--                  </a>-->
<!--                  <a style="margin-left: 40px" href="https://github.com/olongfen/gorm-gin-admin">-->
<!--                    <img style="height: 25px;width: 25px;" src="@/assets/github.png"/>-->
<!--                  </a>-->
                </div>
              <div class="tips">
                <span >Copyright © 2020 💖olongfen</span>
              </div>
<!--                <el-button class="thirdparty-button" type="primary" @click="showDialog=true">-->
<!--                    Or connect with-->
<!--                </el-button>-->
            </div>
        </el-form>

<!--        <el-dialog title="Or connect with" :visible.sync="showDialog">-->
<!--            Can not be simulated on local, so please combine you own business simulation! ! !-->
<!--            <br>-->
<!--            <br>-->
<!--            <br>-->
<!--            <social-sign />-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    import { validUsername } from '@/utils/validate'
    // import SocialSign from './components/SocialSignin'
    import {getCaptcha} from "../../api/captcha"
    import { mapActions } from "vuex";
    export default {
        name: 'Login',
       // components: { SocialSign },
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!validUsername(value)) {
                    callback(new Error('Please enter the correct user name'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('The password can not be less than 6 digits'))
                } else {
                    callback()
                }
            }
            return {
                loginForm: {
                    username: 'admin',
                    password: '111111',
                    digits:'',
                    captchaId: ''
                },
                loginRules: {
                    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                showDialog: false,
                redirect: undefined,
                otherQuery: {},
                captchaIcon:''
            }
        },
        watch: {
            $route: {
                handler: function(route) {
                    const query = route.query
                    if (query) {
                        this.redirect = query.redirect
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true
            }
        },
        created() {
            // window.addEventListener('storage', this.afterQRScan)
            this.handleGetCaptcha()
        },
        mounted() {
            if (this.loginForm.username === '') {
                this.$refs.username.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
        },
        destroyed() {
            // window.removeEventListener('storage', this.afterQRScan)
        },
        methods: {
            ...mapActions("user",["login"]),
            checkCapslock(e) {
                const { key } = e
                this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
           async handleLogin() {
                this.$refs.loginForm.validate( async  valid => {
                    if (valid) {
                        this.loading = true
                        await this.login(this.loginForm)
                        await this.$store.dispatch("user/getUserInfo")
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            async handleGetCaptcha(){
                const res = await getCaptcha()
                this.captchaIcon = "data:image/png;base64," + res.data.img
                this.loginForm.captchaId = res.data.id
                console.log(this.captchaIcon)
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            }
            // afterQRScan() {
            //   if (e.key === 'x-admin-oauth-code') {
            //     const code = getQueryObject(e.newValue)
            //     const codeMap = {
            //       wechat: 'code',
            //       tencent: 'code'
            //     }
            //     const type = codeMap[this.auth_type]
            //     const codeName = code[type]
            //     if (codeName) {
            //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            //         this.$router.push({ path: this.redirect || '/' })
            //       })
            //     } else {
            //       alert('第三方登录失败')
            //     }
            //   }
            // }
        }
    }
</script>

<style lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg:#283443;
    $light_gray:#fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    $bg:linear-gradient( -30deg,#03a9f4 0%,#3a78b7 50%,#262626 50%,#607d8b 100%);
    $dark_gray:#889aa4;
    $light_gray:#eee;

    .login-container {
        display: flex;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
        background-image: $bg;
        overflow: hidden;
        position: relative;
        align-items: center;
        filter: hue-rotate(120deg);
        animation: animate 10s linear infinite;
        @keyframes animate {
            0% {
                filter: hue-rotate(0deg);
            }
            100% {
                filter: hue-rotate(360deg);
            }
        }
        .login-form {
            position: relative;
            width: 360px;
            max-width: 100%;
            padding: 50px;
            height: 480px;
            margin: 0 auto;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            box-shadow: 0 5px 35px rgba(0,0,0,0.2);
        }
        .login-form::after {
            content: '';
            position: absolute;
            top: 5px;
            left: 5px;
            right:5px;
            bottom: 5px;
            border-radius: 5px;
            pointer-events: none;
            background: linear-gradient(to bottom,rgba(255,255,255,0.3) 0%,rgba(255,255,255,0.1) 15%,
            transparent 85%, rgba(255,255,255,0.3) 100%);
        }

        .tips {
            flex: content-box;
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;
            span {
                align-content: center;
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0 auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }

        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }
    .vPic {
        width: 33%;
        height: 50px;
        float: right !important;
        background: #ccc;
        img {
            cursor: pointer;
            vertical-align: middle;
        }
    }
</style>
