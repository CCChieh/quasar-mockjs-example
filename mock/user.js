const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

// const users = {
//   'admin-token': {
//     roles: ['admin'],
//     introduction: 'I am a super administrator',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Super Admin'
//   },
//   'editor-token': {
//     roles: ['editor'],
//     introduction: 'I am an editor',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal Editor'
//   }
// }

module.exports = [
  // user login
  {
    url: '/sys/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          respCode: '60204',
          respMsg: 'Account and password are incorrect.'
        }
      }

      return {
        respMsg: '操作成功',
        respCode: '20000',
        data: {
          access_token: token.token,
          token_type: 'bearer',
          refresh_token: token.token,
          expires_in: 30000,
          scope: 'app'
        }
      }
    }
  },

  // get user info
  {
    url: '/sys/users/current',
    type: 'get',
    response: config => {
      const info = {
        id: '1',
        username: 'admin',
        companyId: '15987',
        rePassword: null,
        nickname: null,
        headImgUrl: '1',
        phone: '1',
        sex: null,
        enabled: true,
        type: '',
        createTime: 1970,
        updateTime: 2020,
        role: null,
        organizationId: null,
        sysRoles: [
          {
            id: '1',
            code: 'admin',
            name: '管理员',
            createTime: 0,
            updateTime: 0
          }
        ],
        permissions: [
          'back:menu:set2role',
          'mail:update',
          'back:permission:delete',
          'role:permission:byroleid',
          'back:menu:save',
          'back:menu:query',
          'ip:black:query',
          'ip:black:save',
          'file:del',
          'ip:black:delete',
          'mail:query',
          'back:user:query',
          'back:role:permission:set',
          'sms:query',
          'back:role:query',
          'log:query',
          'back:permission:query',
          'back:role:save',
          'back:user:role:set',
          'file:query',
          'back:menu:update',
          'back:role:delete',
          'back:user:password',
          'back:role:update',
          'back:menu:delete',
          'back:user:update',
          'menu:byroleid',
          'user:role:byuid',
          'mail:save',
          'back:permission:save',
          'back:permission:update'
        ],
        accountNonExpired: true,
        credentialsNonExpired: true,
        accountNonLocked: true
      }

      // mock error
      if
      (!info) {
        return {
          respCode: '50008',
          respMsg: 'Login failed, unable to get user details.'
        }
      }

      return {
        respCode: '20000',
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: '20000',
        data: 'success'
      }
    }
  }
]
