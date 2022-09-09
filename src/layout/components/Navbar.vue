<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="editPassword">
            <span style="display:block;">重置密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="visible" destroy-on-close @closed="onCancel">
      <el-form ref="dataForm" :rules="rules" :model="pwd" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="pwd.oldPassword" show-password placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="pwd.newPassword" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwd.confirmPassword" show-password placeholder="请确认密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">
          取消
        </el-button>
        <el-button type="primary" @click="changePassword">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { pwdReg } from '@/utils'
import { editPassword } from '@/api/user' // 此处接口需要自己定义

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    // 校验密码
    const validatePassword = (rule, value, callback) => {
      if (!pwdReg(value)) {
        callback('请输入6-16位至少包含数字加字母密码')
      } else {
        if (this.pwd.confirmPassword !== '') {
          this.$refs.dataForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwd.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      username: '',
      pwd: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ validator: checkPassword, trigger: 'blur' }]
      },
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    editPassword() {
      this.visible = true
    },
    onCancel() {
      this.visible = false
      this.pwd = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    changePassword() {
      const params = Object.assign({}, this.pwd)
      delete params.confirmPassword
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          editPassword(params).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '密码修改成功, 将重新登录',
                type: 'success'
              })
              this.visible = false
              this.$store.dispatch('user/resetToken')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
          })
        }
      })
    }
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
